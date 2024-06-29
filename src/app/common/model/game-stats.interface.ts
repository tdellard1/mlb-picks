export interface GameStats {
  Pitching: Pitching;
  BaseRunning: BaseRunning;
  Fielding: Fielding;
  Hitting: Hitting;
}

export interface Pitching {
  BB: string;
  Balk: string;
  ['Wild Pitch']: string;
  decision: string;
  Flyouts: string;
  ['Inherited Runners']: string;
  H: string;
  HR: string;
  ER: string;
  Strikes: string;
  ['Inherited Runners Scored']: string;
  Groundouts: string;
  R: string;
  pitchingOrder: string;
  ERA: string;
  InningsPitched: string;
  ['Batters Faced']: string;
  SO: string;
  Pitches: string;
}

export interface Fielding {
  ['Passed Ball']: TotalPlayerObject;
  ['Outfield assists']: TotalPlayerObject;
  E: TotalPlayerObject;
  Pickoffs: TotalPlayerObject;
}

export interface Hitting {
  BB: TotalPlayerObject;     // Walks
  AB: TotalPlayerObject;     // At Bats
  H: TotalPlayerObject;      // Hits
  IBB: TotalPlayerObject;    // Intentional Walks
  HR: TotalPlayerObject;     // Home Runs
  TB: TotalPlayerObject;     // Total Bases
  ['3B']: TotalPlayerObject; // Triples
  GIDP: TotalPlayerObject;   // Ground Into Double Play
  ['2B']: TotalPlayerObject; // Doubles
  R: TotalPlayerObject; // Runs
  SF: TotalPlayerObject; // Sacrifice Fly
  avg: TotalPlayerObject; // Batting Average
  SAC: TotalPlayerObject; //
  HBP: TotalPlayerObject; // Hit By Pitch
  RBI: TotalPlayerObject; // Runs Batted In
  SO: TotalPlayerObject;
}

export interface BaseRunning {
  CS: TotalPlayerObject;
  SB: TotalPlayerObject
  PO: TotalPlayerObject;
}

export interface TotalPlayerObject {
  total: string;
  playerID: string[];
}
