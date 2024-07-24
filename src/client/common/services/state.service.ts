import {Injectable} from '@angular/core';
import {
  convertArrayToMapFaster,
  convertMapToArray, createAnalyticsFromSchedule
} from "../utils/general.utils";
import {TeamAnalytics, TeamSchedule} from "../model/team-schedule.interface";
import {Team} from "../model/team.interface";
import {RosterPlayer} from "../model/roster.interface";
import {BoxScore} from "../model/box-score.interface";
import {StateUtils} from "../utils/state.utils";
import {
  addPlayersToTeamRoster, addTeamsAndBoxScoresToSchedule, removePostponedGames
} from "../utils/state-builder.utils";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly GAME_ID: string = 'gameID';

  private _boxScores: Map<string, BoxScore> = new Map();
  private _rosterPlayers: Map<string, RosterPlayer> = new Map();
  private _teams: Map<string, Team> = new Map();
  private _schedules: Map<string, TeamSchedule> = new Map();
  private _analytics: Map<string, TeamAnalytics> = new Map();

  loadStateSlices(teams: Team[], rosters: RosterPlayer[], schedules: TeamSchedule[], boxScores: BoxScore[]) {
    const noParameterIsEmpty: boolean =
      teams.length !== 0
      && rosters.length !== 0
      && schedules.length !== 0
      && boxScores.length !== 0;

    if (noParameterIsEmpty) {
      const usableBoxScores: BoxScore[] = removePostponedGames(boxScores);
      this._boxScores = convertArrayToMapFaster(usableBoxScores, this.GAME_ID);

      this._rosterPlayers = convertArrayToMapFaster<RosterPlayer>(rosters, 'playerID');

      const updatedTeams: Team[] = addPlayersToTeamRoster(teams, this._rosterPlayers);
      this._teams = new Map(updatedTeams.map((team) => ([team.teamAbv, team])));

      const updatedSchedules: TeamSchedule[] = addTeamsAndBoxScoresToSchedule(schedules, this._teams, this._boxScores);
      this._schedules = new Map(updatedSchedules.map((schedule) => ([schedule.team, schedule])));

      this._analytics = createAnalyticsFromSchedule(this._schedules);
    }
  }

  getPlayer(playerID: string): RosterPlayer {
    return this._rosterPlayers.get(playerID)!;
  }

  get allPlayers(): Map<string, RosterPlayer> {
    return this._rosterPlayers;
  }

  get allTeams(): Map<string, Team> {
    return this._teams;
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

  containsEveryPlayers(players: string[]) {
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

  getTeamAnalytics(teamName: string): TeamAnalytics {
    return this._analytics.get(teamName)!;
  }
}

