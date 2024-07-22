import {Injectable} from '@angular/core';
import {convertArrayToMap, convertMapToArray} from "../utils/general.utils";
import {TeamAnalytics, TeamSchedule} from "../model/team-schedule.interface";
import {Team} from "../model/team.interface";
import {RosterPlayer} from "../model/roster.interface";
import {BoxScore, convertBoxScoresToListOfPlayerStats} from "../model/box-score.interface";
import {PlayerStats} from "../model/player-stats.interface";
import {StateUtils} from "../utils/state.utils";
import {
  addPlayersToTeamRoster, addTeamsAndBoxScoresToSchedule,
  createRosterPlayerMap, removePostponedGames
} from "../utils/state-builder.utils";
import {db, IBoxScore} from "../../../../db";
import {combineLatest, from, Observable} from "rxjs";
import {liveQuery} from "dexie";
import {Player} from "../model/players.interface";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  boxScoresSource$: Observable<IBoxScore[]> = from(liveQuery<IBoxScore[]>(() => db.boxScores.toArray()));
  teamsSource$: Observable<Team[]> = from(liveQuery<Team[]>(() => db.teams.toArray()));
  schedulesSource$: Observable<TeamSchedule[]> = from(liveQuery<TeamSchedule[]>(() => db.schedules.toArray()));
  rosterPlayersSource$: Observable<RosterPlayer[]> = from(liveQuery<RosterPlayer[]>(() => db.rosterPlayers.toArray()));
  allPlayersSource$: Observable<RosterPlayer[]> = from(liveQuery<RosterPlayer[]>(() => db.allPlayers.toArray()));

  private readonly GAME_ID: string = 'gameID';
  private readonly PLAYER_ID: string = 'playerID';

  constructor() {
    combineLatest([this.boxScoresSource$, this.teamsSource$, this.schedulesSource$, this.rosterPlayersSource$, this.allPlayersSource$])
      .subscribe(([boxScores, teams, schedules, rosterPlayers, allPlayers]:
                    [BoxScore[], Team[], TeamSchedule[], RosterPlayer[], RosterPlayer[]]) => {
        this.loadStateSlices(teams, allPlayers, rosterPlayers, schedules, boxScores);
      });
  }

  private _boxScores: Map<string, BoxScore> = new Map();
  private _playerStats: Map<string, PlayerStats> = new Map();
  private _rosterPlayers: Map<string, RosterPlayer> = new Map();
  private _teams: Map<string, Team> = new Map();
  private _schedules: Map<string, TeamSchedule> = new Map();
  private _analytics: Map<string, TeamAnalytics> = new Map();

  loadStateSlices(teams: Team[], players: RosterPlayer[], rosters: RosterPlayer[], schedules: TeamSchedule[], boxScores: BoxScore[]) {
    const noParameterIsEmpty: boolean =
      teams.length !== 0
      && players.length !== 0
      && rosters.length !== 0
      && schedules.length !== 0
      && boxScores.length !== 0;

    if (noParameterIsEmpty) {
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

      this._schedules.forEach(({team, schedule}: TeamSchedule) => {
        const teamAnalytics: TeamAnalytics = new TeamAnalytics(team, schedule);
        this._analytics.set(team, teamAnalytics)
      });
    }


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

  getSchedule(team: string): TeamSchedule {
    return this._schedules.get(team)!;
  }

  getTeamAnalytics(teamName: string): TeamAnalytics {
    return this._analytics.get(teamName)!;
  }
}

