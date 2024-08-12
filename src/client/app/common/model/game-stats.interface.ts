export interface GameStats {
  Pitching: Pitching;
  BaseRunning: BaseRunning;
  Fielding: Fielding;
  Hitting: any;
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
  WHIP: string;
  Win: string;
  Loss: string;
}

export interface Fielding {
  ['Passed Ball']: TotalPlayerObject;
  ['Outfield assists']: TotalPlayerObject;
  E: TotalPlayerObject;
  Pickoffs: TotalPlayerObject;
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
