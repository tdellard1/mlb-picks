import {Injectable} from '@angular/core';
import {
  convertArrayToMapFaster,
  convertMapToArray, createAnalyticsFromSchedule
} from "../utils/general.utils";
import {TeamAnalytics, TeamSchedule} from "../model/team-schedule.interface";
import {Team} from "../model/team.interface";
import {Roster, RosterPlayer} from "../model/roster.interface";
import {BoxScore} from "../model/box-score.interface";
import {StateUtils} from "../utils/state.utils";
import {
  addPlayersToTeamRoster, addTeamsAndBoxScoresToSchedule, removePostponedGames
} from "../utils/state-builder.utils";
import {PlayerStats} from "../model/player-stats.interface.js";
import {PromiseExtended} from "dexie";
import {db, IBoxScore} from "../../db.js";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  teamsSource$: PromiseExtended<Team[]> = db.teams.toArray();
  boxScoresSource$: PromiseExtended<IBoxScore[]> = db.boxScores.toArray();
  schedulesSource$: PromiseExtended<TeamSchedule[]> = db.schedules.toArray();
  playersSource$: PromiseExtended<RosterPlayer[]> = db.players.toArray();
  rostersSource$: PromiseExtended<Roster[]> = db.rosters.toArray();


  private readonly GAME_ID: string = 'gameID';

  private _boxScores: Map<string, BoxScore> = new Map();
  private _rosterPlayers: Map<string, RosterPlayer> = new Map();
  private _teams: Map<string, Team> = new Map();
  private _schedules: Map<string, TeamSchedule> = new Map();
  private _analytics: Map<string, TeamAnalytics> = new Map();

  async init(): Promise<void> {
    const teams: Team[] = await this.teamsSource$;
    const boxScores: IBoxScore[] = await this.boxScoresSource$;
    const schedules: TeamSchedule[] = await this.schedulesSource$;
    const players: RosterPlayer[] = await this.playersSource$;
    const rosters: Roster[] = await this.rostersSource$;

    this.loadStateSlices(teams, players, rosters, schedules, boxScores);
  }

  async update(t: Team[], b: BoxScore[], s: TeamSchedule[], p: RosterPlayer[], r: Roster[]) {
    let teams: Team[];
    let boxScores: IBoxScore[];
    let schedules: TeamSchedule[];
    let players: RosterPlayer[];
    let rosters: Roster[];

    if (t.length === 30) {
      await db.teams.clear();
      await db.teams.bulkAdd(t);
      teams = t;
      console.log('updated teams');
    } else {
      teams = await this.teamsSource$;
    }

    if (b.length === 30) {
      await db.boxScores.clear();
      await db.boxScores.bulkAdd(b);
      boxScores = b;
      console.log('updated boxScores');
    } else {
      boxScores = await this.boxScoresSource$;
    }

    if (s.length === 30) {
      await db.schedules.clear();
      await db.schedules.bulkAdd(s);
      schedules = s;
      console.log('updated schedules');
    } else {
      schedules = await this.schedulesSource$;
    }

    if (p.length === 30) {
      await db.players.clear();
      await db.players.bulkAdd(p);
      players = p;
      console.log('updated players');
    } else {
      players = await this.playersSource$;
    }

    if (r.length === 30) {
      await db.rosters.clear();
      await db.rosters.bulkAdd(r);
      rosters = r;
      console.log('updated rosters');
    } else {
      rosters = await this.rostersSource$;
    }



    this.loadStateSlices(teams, players, rosters, schedules, boxScores);
  }

  loadStateSlices(teams: Team[], players: RosterPlayer[], rosters: Roster[], schedules: TeamSchedule[], boxScores: BoxScore[]) {
    const usableBoxScores: BoxScore[] = removePostponedGames(boxScores);
    this._boxScores = convertArrayToMapFaster(usableBoxScores, this.GAME_ID);

    // this._rosterPlayers = convertArrayToMapFaster<RosterPlayer>(rosters, 'playerID');
    this._rosterPlayers = this.getFullListOfPlayersWithGameHistory(players, rosters, boxScores);

    const updatedTeams: Team[] = addPlayersToTeamRoster(teams, this._rosterPlayers);
    this._teams = new Map(updatedTeams.map((team) => ([team.teamAbv, team])));

    const updatedSchedules: TeamSchedule[] = addTeamsAndBoxScoresToSchedule(schedules, this._teams, this._boxScores);
    this._schedules = new Map(updatedSchedules.map((schedule) => ([schedule.team, schedule])));

    this._analytics = createAnalyticsFromSchedule(this._schedules);
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

  private getFullListOfPlayersWithGameHistory(players: RosterPlayer[], rosters: Roster[], boxScores: BoxScore[]): Map<string, RosterPlayer>  {
    const map: Map<string, RosterPlayer> = new Map();
    const allPlayerStats: PlayerStats[] = [];

    const totalNumberOfPlayers: number = players.length;
    const totalNumberOfBoxScores: number = boxScores.length;

    const rosterPlayers: RosterPlayer[] = rosters.map(({roster}) => roster).flat();

    // Convert boxScores to playerStats
    for (let i: number = 0; i < totalNumberOfBoxScores; i++) {
      if (boxScores[i] && boxScores[i].playerStats) {
        allPlayerStats.push(...Object.values(boxScores[i].playerStats));
      }
    }

    for (let i: number = 0; i < totalNumberOfPlayers; i++) {
      let currentPlayer: RosterPlayer = players[i];

      const potentialRosterPlayer: RosterPlayer | undefined = rosterPlayers.find(({playerID}) => currentPlayer.playerID === playerID)
      const playersGames: PlayerStats[] = allPlayerStats.filter(({playerID}) => currentPlayer.playerID === playerID);

      if (potentialRosterPlayer) {
        currentPlayer = potentialRosterPlayer;
      }

      currentPlayer.games = playersGames;
      map.set(currentPlayer.playerID, currentPlayer);
    }

    return map;
  }
}

