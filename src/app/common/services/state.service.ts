import {Injectable} from '@angular/core';
import {convertArrayToMap, convertMapToArray} from "../utils/general.utils";
import {TeamSchedule} from "../model/team-schedule.interface";
import {Team} from "../model/team.interface";
import {RosterPlayer} from "../model/roster.interface";
import {BoxScore, convertBoxScoresToListOfPlayerStats} from "../model/box-score.interface";
import {PlayerStats} from "../model/player-stats.interface";
import {StateUtils} from "../utils/state.utils";
import {
  addPlayersToTeamRoster, addTeamsAndBoxScoresToSchedule,
  createRosterPlayerMap, removePostponedGames
} from "../utils/state-builder.utils";
import {MLBTeamSchedule} from "../../Analysis/data-access/mlb-team-schedule.model";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly GAME_ID: string = 'gameID';
  private readonly PLAYER_ID: string = 'playerID';

  private _boxScores: Map<string, BoxScore> = new Map();
  private _playerStats: Map<string, PlayerStats> = new Map();
  private _rosterPlayers: Map<string, RosterPlayer> = new Map();
  private _teams: Map<string, Team> = new Map();
  private _schedules: Map<string, TeamSchedule> = new Map();

  loadStateSlices(teams: Team[], players: RosterPlayer[], rosters: RosterPlayer[], schedules: TeamSchedule[], boxScores: BoxScore[]) {
    const usableBoxScores: BoxScore[] = removePostponedGames(boxScores);
    this._boxScores = convertArrayToMap(usableBoxScores, this.GAME_ID);

    const playerStats: PlayerStats[] = convertBoxScoresToListOfPlayerStats(usableBoxScores);
    this._playerStats = new Map(playerStats.map((playerStats) => ([`${playerStats.playerID}:${playerStats.gameID}`, playerStats])));

    const tempRosterMap: Map<string, RosterPlayer> = convertArrayToMap(rosters, this.PLAYER_ID);
    this._rosterPlayers = createRosterPlayerMap(players, playerStats, tempRosterMap);

    const updatedTeams: Team[] = addPlayersToTeamRoster(teams, this._rosterPlayers);
    this._teams = new Map(updatedTeams.map((team) => ([team.teamAbv, team])));

    const updatedSchedules: TeamSchedule[] = addTeamsAndBoxScoresToSchedule(schedules, this._teams, this._boxScores);
    this._schedules = new Map(updatedSchedules.map((schedule) => ([schedule.team, schedule])));
  }

  get allPlayers(): Map<string, RosterPlayer> {
    return this._rosterPlayers;
  }

  get allTeams(): Map<string, Team> {
    return this._teams;
  }

  get allSchedules(): Map<string, TeamSchedule> {
    return this._schedules;
  }

  get allMLBSchedules(): Map<string, MLBTeamSchedule> {
    const mlbTeamSchedules = convertMapToArray<TeamSchedule>(this._schedules).map((teamSchedule: TeamSchedule )=> new MLBTeamSchedule(teamSchedule));
    return convertArrayToMap<MLBTeamSchedule>(mlbTeamSchedules, 'team');
  }

  getPitcherNRFIRecord(rosterPlayer: RosterPlayer) {
    return StateUtils.getNoRunsFirstInningRecord(this._boxScores, rosterPlayer);
  }

  getNRFIStreak(rosterPlayer: RosterPlayer) {
    return StateUtils.getNoRunsFirstInningStreak(this._boxScores, rosterPlayer);
  }

  getTeamNRFI(team: string) {
    const teamSchedule: TeamSchedule | undefined = this._schedules.get(team);
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

  get getScheduleAsArray(): TeamSchedule[] {
    return convertMapToArray(this._schedules);
  }

  getSchedule(team: string): TeamSchedule {
    return this._schedules.get(team)!;
  }
}

