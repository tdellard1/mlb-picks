import {Injectable, OnDestroy} from '@angular/core';
import {convertArrayToMap, convertMapToArray, deepCopy} from "../utils/general.utils";
import {TeamSchedule} from "../model/team-schedule.interface";
import {Team} from "../model/team.interface";
import {RosterPlayer} from "../model/roster.interface";
import {BoxScore, convertBoxScoresToListOfPlayerStats} from "../model/box-score.interface";
import {PlayerStats} from "../model/player-stats.interface";
import {Game} from "../model/game.interface";
import {BackendApiService} from "./backend-api/backend-api.service";
import {StateUtils} from "../utils/state.utils";
import {LoggerService} from "./logger.service";
import {createRosterPlayerAndAddToMap, removePostponedGames} from "../utils/state-builder.utils";

@Injectable({
  providedIn: 'root'
})
export class StateService implements OnDestroy {
  private readonly GAME_ID: string = 'gameID';
  private readonly PLAYER_ID: string = 'playerID';
  constructor(private backendApiService: BackendApiService,
              private logger: LoggerService) {
  }

// Domain: Single daily (if desired) requested data
  private _schedules: Map<string, TeamSchedule> = new Map();

  private _teams: Map<string, Team> = new Map();
  /** Payer Info + PLayer Stats = Roster Player */
  private _rosterPlayers: Map<string, RosterPlayer> = new Map();

  // More dynamic data that bas to be requested upon need, and incorporated into Domain objects
  private _playerStats: Map<string, PlayerStats> = new Map();
  newBoxScores: Map<string, BoxScore> = new Map<string, BoxScore>();
  private _boxScores: Map<string, BoxScore> = new Map();

  loadStateSlices(teams: Team[], players: RosterPlayer[], rosters: RosterPlayer[], schedules: TeamSchedule[], boxScores: BoxScore[]) {
    const usableBoxScores: BoxScore[] = removePostponedGames(boxScores);
    this._boxScores = convertArrayToMap(usableBoxScores, this.GAME_ID);

    const playerStats: PlayerStats[] = convertBoxScoresToListOfPlayerStats(usableBoxScores);
    this._playerStats = new Map(playerStats.map((playerStats) => ([`${playerStats.playerID}:${playerStats.gameID}`, playerStats])));

    const tempRosterMap: Map<string, RosterPlayer> = convertArrayToMap(rosters, this.PLAYER_ID);

    createRosterPlayerAndAddToMap(players, playerStats, tempRosterMap, this._rosterPlayers);

    const updatedTeams = teams.map((team: Team) => {
      /** Add Rosters To Teams */
      team.roster = StateUtils.playersOnRoster(team.teamAbv, this._rosterPlayers);

      return team;
    });

    this._teams = new Map(updatedTeams.map((team) => ([team.teamAbv, team])));

    const updatedSchedules: TeamSchedule[] = schedules.map((teamSchedule: TeamSchedule) => {
      /** Add Teams To Schedule */
      if (this._teams.has(teamSchedule.team)) {
        teamSchedule.teamDetails = this._teams.get(teamSchedule.team);
      }

      /** Add BoxScores To Schedule */
      teamSchedule.schedule = teamSchedule.schedule.map((game: Game) => {
        if (this._boxScores.has(game.gameID)) {
          game.boxScore = this._boxScores.get(game.gameID);
        }

        return game;
      });

      return teamSchedule;
    });

    this._schedules = new Map(updatedSchedules.map((schedule) => ([schedule.team, schedule])));
  }

  saveRosters() {
    return this.backendApiService.updateRosters(convertMapToArray(this._rosterPlayers));
  }

  saveState() {
    return this.backendApiService.updateState(convertMapToArray(this._schedules));
  }

  addBoxScore(boxScore: BoxScore): void {
    this.newBoxScores.set(boxScore.gameID, boxScore);
  }

  getPlayersWithoutFullGames(playerIDs: string[]): RosterPlayer[] {
    return convertMapToArray<RosterPlayer>(this._rosterPlayers).filter((player: RosterPlayer) => !player.allGamesSaved);
  }

  getPlayersWithFullGames(playerIDs: string[]): RosterPlayer[] {
    return convertMapToArray<RosterPlayer>(this._rosterPlayers).filter((player: RosterPlayer) => player.allGamesSaved);
  }


  getAllPlayers() {
    return convertMapToArray<RosterPlayer>(this._rosterPlayers);
  }

  getHittingStreaks() {
    StateUtils.getHittingStreaks(this._rosterPlayers);
  }

  /** Method to return the PlayerIDs not a part of rosters that need more info */
  requiredPlayerIDInfos(...boxScores: BoxScore[]) {
    const playerStats = convertBoxScoresToListOfPlayerStats(boxScores);
    const playerIDs = playerStats.map((playerStats: PlayerStats) => {
      return this.isPlayerApartOfRoster(playerStats) ? '' : playerStats.playerID;
    });

    return playerIDs.filter(Boolean);
  }

  // If player is not a part of a roster, then we need to retrieve the playerInfo, then add it to A roster.
  private isPlayerApartOfRoster({playerID}: PlayerStats): boolean {
    return this._rosterPlayers.has(playerID);
  }

  addRosterPlayersAndTriggerUpwards(rosterPlayers: RosterPlayer[]) {
    rosterPlayers.forEach((player: RosterPlayer) => {
      if (player.team) {
        console.log('players team: ', player);
        if (this._teams.get(player.team) === undefined) {
          console.log(this._teams, player);
        }
        const team: Team = deepCopy<Team>(this._teams.get(player.team));
        const teamRosterMap = convertArrayToMap(team.roster!, 'playerID');
        teamRosterMap.set(player.playerID, Object.assign({}, player, {allGamesSaved: true}));

        team.roster = convertMapToArray(teamRosterMap);
        this._teams.set(team.teamAbv, team);

        /** This should be outside the roster for each loop, but I need to figure out how to handle a player not having an assigned team */
        const uniqueListOfTeamsChanged: Set<string> = new Set(rosterPlayers.map((rosterPlayer: RosterPlayer) => rosterPlayer.team));

        [...uniqueListOfTeamsChanged].filter(Boolean).forEach((team: string) => {
          const schedule: TeamSchedule = deepCopy(this._schedules.get(team));
          schedule.teamDetails = this._teams.get(team);

          this._schedules.set(team, schedule);
        });
      } else {
        this._rosterPlayers.set(player.playerID, player);
        this.logger.warn(`Player has no team: ${player}`);
      }
    });
  }

  extractState(): TeamSchedule[] {
    return convertMapToArray<TeamSchedule>(this._schedules);
  }

  hasPlayer(playerID: string): boolean {
    return this._rosterPlayers.has(playerID);
  }

  getPlayer(playerID: string): RosterPlayer | undefined {
    return this._rosterPlayers.get(playerID);
  }

  get allPlayers(): Map<string, RosterPlayer> {
    return this._rosterPlayers;
  }

  getPlayers(playerIDs: string[]): RosterPlayer[] {
    return convertMapToArray<RosterPlayer>(this._rosterPlayers)
      .filter((player: RosterPlayer) => playerIDs.includes(player.playerID))
    // .filter((player: RosterPlayer) => player.allGamesSaved);
  }

  ngOnDestroy(): void {
    this.saveState();
  }

  getPitcherNRFIRecord(rosterPlayer: RosterPlayer) {
    return StateUtils.getNoRunsFirstInningRecord(this._boxScores, rosterPlayer);
  }

  getNRFIStreak(rosterPlayer: RosterPlayer) {
    return StateUtils.getNoRunsFirstInningStreak(this._boxScores, rosterPlayer);
  }

  getTeamNRFI(team: string) {
    const teamSchedule = this._schedules.get(team);
    if (teamSchedule) {
      return StateUtils.getTeamNRFI(team, teamSchedule, this._boxScores);
    } else {
      return 'No NRFI Data';
    }
  }

  containsPlayers(players: string[]) {
    const allPlayers: RosterPlayer[] = convertMapToArray<RosterPlayer>(this._rosterPlayers);

    return players.every((playerID: string): boolean =>
      allPlayers.findIndex((rosterPlayer: RosterPlayer): boolean =>
        rosterPlayer.playerID === playerID) !== -1);
  }

  filterNewPlayers(players: string[]): string[] {
    const newPlayers: string[] = [];

    players.forEach((playerId: string) => {
      if (!this._rosterPlayers.has(playerId)) {
        newPlayers.push(playerId);
      }
    });

    return newPlayers;
  }
}

