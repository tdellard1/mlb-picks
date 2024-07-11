import {Injectable, OnDestroy} from '@angular/core';
import {convertArrayToMap, convertMapToArray, deepCopy} from "../utils/general.utils";
import {TeamSchedule} from "../model/team-schedule.interface";
import {Team} from "../model/team.interface";
import {Roster, RosterPlayer} from "../model/roster.interface";
import {BoxScore, listOfBoxScoresToListOfPlayerStats} from "../model/box-score.interface";
import {PlayerStats} from "../model/player-stats.interface";
import {Game} from "../model/game.interface";
import {BackendApiService} from "./backend-api/backend-api.service";
import {StateUtils} from "../utils/state.utils";
import {LoggerService} from "./logger.service";
import {Player} from "../model/players.interface";

@Injectable({
  providedIn: 'root'
})
export class StateService implements OnDestroy {
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


  loadState(teamSchedules: TeamSchedule[]) {
    // const teams: Team[] = teamSchedules.map(({teamDetails}) => teamDetails!);
    // const games: Game[] = teamSchedules.map(({schedule}) => schedule!).flat();
    // const boxScores: BoxScore[] = teamSchedules.map(({schedule}) => schedule.map(({boxScore}) => boxScore!)).flat();
    // const rosterPlayers: RosterPlayer[] = teams.map(({roster}) => roster!).flat();
    // const playerStats: PlayerStats[] = rosterPlayers.map(({games}) => games!).flat();

    // this._schedules = new Map(teamSchedules.map((schedule) => ([schedule.team, schedule])));
    // this._teams = new Map(teams.map((team) => ([team.teamAbv, team])));
    // // this._games = new Map(games.map((game) => ([game.gameID, game])));
    // this._boxScores = new Map(boxScores.filter(Boolean).map((boxScore) => ([boxScore.gameID, boxScore])));
    // this._rosterPlayers = new Map(rosterPlayers.map((rosterPlayer) => ([rosterPlayer.playerID, rosterPlayer])));
    // this._playerStats = new Map(playerStats.filter(Boolean).map((playerStats) => ([`${playerStats.playerID}:${playerStats.gameID}`, playerStats])));
  }

  loadStateSlices(teams: Team[], players: RosterPlayer[], rosters: Roster[], schedules: TeamSchedule[], boxScores: BoxScore[]) {
    // BoxScores must filter suspended and postponed games not have null player Stats
    const usableBoxScores = boxScores.filter((boxScore: BoxScore) => {
      return boxScore.gameStatus !== 'Postponed'
    });



    /** Start with BoxScores, this is going to determine all stats for everything */
    this._boxScores = new Map(boxScores.filter(Boolean).map((boxScore) => ([boxScore.gameID, boxScore])));


    /** Add PlayerStats Map from box Scores */
    const playerStats: PlayerStats[] = listOfBoxScoresToListOfPlayerStats(usableBoxScores);
    this._playerStats = new Map(playerStats.map((playerStats) => ([`${playerStats.playerID}:${playerStats.gameID}`, playerStats])));
    const tempRosterMap: Map<string, RosterPlayer> = new Map();

    rosters.forEach(({roster}: Roster) => {
      roster.forEach((rosterPlayer: RosterPlayer) => {
        tempRosterMap.set(rosterPlayer.playerID, rosterPlayer);
      });
    });

    players.forEach((player: RosterPlayer) => {
      const rosterPlayer: RosterPlayer | undefined = tempRosterMap.get(player.playerID);

       if (rosterPlayer) {
         const gamesForPlayer: PlayerStats[] = playerStats.filter(({playerID}) => playerID === rosterPlayer.playerID);
         if (gamesForPlayer.length) {
           rosterPlayer.games = gamesForPlayer;
         }
         this._rosterPlayers.set(rosterPlayer.playerID, rosterPlayer);
       } else {
         const gamesForPlayer: PlayerStats[] = playerStats.filter(({playerID}) => playerID === player.playerID);
         if (gamesForPlayer.length) {
           player.games = gamesForPlayer;
         }
         this._rosterPlayers.set(player.playerID, player);
       }
    });

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


    // this.backendApiService.updateBoxScoresOnly(convertMapToArray(this._boxScores)).subscribe(console.log);
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
    const playerStats = listOfBoxScoresToListOfPlayerStats(boxScores);
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
}

