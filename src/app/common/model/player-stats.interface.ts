import {TeamFieldingStats, TeamHittingStats, TeamPitchingStats} from "./team-stats.interface";

export interface PlayerStats {
  gameID: string;
  Pitching: PlayerPitchingStats;
  allPositionsPlayed: string;
  note: string;
  Hitting: PlayerHittingStats;
  BaseRunning: BaseRunning;
  started: string;
  team: string;
  startingPosition: string;
  Fielding: PlayerFieldingStats;
  teamID: string;
  playerID: string;
  mlbID: string;
}

export interface PlayerPitchingStats extends TeamPitchingStats {
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



export interface PlayerHittingStats extends TeamHittingStats {
  AB: TotalPlayerObject;     // At Bats
  HR: TotalPlayerObject;     // Home Runs
  avg: TotalPlayerObject; // Batting Average
  SO: TotalPlayerObject;
}

export interface BaseRunning {
  CS: TotalPlayerObject;
  SB: TotalPlayerObject
  PO: TotalPlayerObject;
}

export interface PlayerFieldingStats extends TeamFieldingStats {
  E: string;
}

export interface TotalPlayerObject {
  total: string;
  playerID: string[];
}
