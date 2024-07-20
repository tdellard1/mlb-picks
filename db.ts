// db.ts
import Dexie, { Table } from 'dexie';
import {RosterPlayer} from "./src/client/common/model/roster.interface";
import {Team} from "./src/client/common/model/team.interface";
import {TeamSchedule} from "./src/client/common/model/team-schedule.interface";

export class AppDB extends Dexie {
  boxScores: Table<IBoxScore, string>;
  rosterPlayers: Table<RosterPlayer, string>;
  allPlayers: Table<RosterPlayer, string>;
  teams: Table<Team, string>;
  schedules: Table<TeamSchedule, string>;

  constructor() {
    super('mlb-picks');
    this.version(3).stores({
      boxScores: 'gameID, home, away, gameStatus',
      rosterPlayers: 'playerID, team, teamID',
      allPlayers: 'playerID, team, teamID',
      teams: 'teamAbv, teamName, teamCity',
      schedules: 'team',
    });
  }
}

export const db = new AppDB();

export interface IBoxScore {
  GameLength: string;
  Umpires: string;
  gameStatus: string;
  Attendance: string;
  teamStats: ITeamStatsWrapper;
  gameDate: string;
  Venue: string;
  currentCount: string;
  homeResult: string;
  away: string;
  lineScore: ILineScore;
  currentOuts: string;
  FirstPitch: string;
  Wind: string;
  home: string;
  playerStats: {[playerId: string]: IPlayerStats};
  decisions: IDecision[];
  currentBatter: string;
  bases: any;
  awayResult: string;
  Weather: string;
  currentPitcher: string;
  currentInning: string;
  gameID: string;
  startingLineups: any;
}

export interface ITeamStatsWrapper {
  home: ITeamStats;
  away: ITeamStats;
}

export interface ITeamStats {
  Pitching: ITeamPitchingStats;
  BaseRunning: ITeamBaseRunningStats;
  Fielding: ITeamFieldingStats;
  Hitting: ITeamHittingStats;
}

export interface ITeamPitchingStats {
  Groundouts: string;
  Balk: string;
  ['Wild Pitch']: string;
  Flyouts: string;
  ['Inherited Runners']: string;
  ['Batters Faced']: string;
  Pitches: string;
  Strikes: string;
  ['Inherited Runners Scored']: string;
}

export interface ITeamBaseRunningStats {
  CS: string;
  SB: string
  PO: string;
}
export interface ITeamFieldingStats {
  E: string;
  Pickoffs: string;
  ['Passed Ball']: string;
}

export interface ITeamHittingStats {
  BB: string;       // Walks
  ['2B']: string;   // Doubles
  R: string;        // Runs
  SF: string;       // Sacrifice Fly
  SAC: string;      //
  HBP: string;      // Hit By Pitch
  H: string;        // Hits
  RBI: string;      // Runs Batted In
  IBB: string;      // Intentional Walks
  TB: string;       // Total Bases
  ['3B']: string;   // Triples
  GIDP: string;     // Ground Into Double Play
}

export interface ILineScore {
  away: ILineScoreTeam;
  home: ILineScoreTeam;
}

export interface ILineScoreTeam {
  E: string;
  H: string;
  R: string;
  scoresByInning: IScoreByInning;
  team: string;
}

export interface IScoreByInning {
  [inning: number]: string;
}

export interface IPlayerStats {
  gameID: string;
  Pitching: IPlayerPitchingStats;
  allPositionsPlayed: string;
  note: string;
  Hitting: IPlayerHittingStats;
  BaseRunning: BaseRunning;
  started: string;
  team: string;
  startingPosition: string;
  Fielding: IPlayerFieldingStats;
  teamID: string;
  playerID: string;
  mlbID: string;
}

export interface IPlayerPitchingStats extends ITeamPitchingStats {
  BB: string;
  decision: string;
  H: string;
  HR: string;
  ER: string;
  R: string;
  pitchingOrder: string;
  ERA: string;
  InningsPitched: string;
  SO: string;
}
export interface IPlayerHittingStats extends ITeamHittingStats {
  AB: ITotalPlayerObject;     // At Bats
  HR: ITotalPlayerObject;     // Home Runs
  avg: ITotalPlayerObject; // Batting Average
  SO: ITotalPlayerObject;
}

export interface BaseRunning {
  CS: ITotalPlayerObject;
  SB: ITotalPlayerObject
  PO: ITotalPlayerObject;
}

export interface IPlayerFieldingStats extends ITeamFieldingStats {
  E: string;
}

export interface ITotalPlayerObject {
  total: string;
  playerID: string[];
}

export interface IDecision {
  decision: string;
  playerID: string;
  team: string;
}
