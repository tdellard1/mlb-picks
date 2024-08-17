import {TotalPlayerObject} from "./game-stats";

export interface Pitching {
  Pitches: string | TotalPlayerObject;
  Strikes: string | TotalPlayerObject;
  H: string | TotalPlayerObject;
  HR: string | TotalPlayerObject;
  BB: string | TotalPlayerObject;
  ER: string | TotalPlayerObject;
  R: string | TotalPlayerObject;
  HBP: string | TotalPlayerObject;
  SO: string | TotalPlayerObject;
  InningsPitched: string | TotalPlayerObject;
  ['Wild Pitch']: string | TotalPlayerObject;
  Flyouts: string | TotalPlayerObject;
  decision: string | TotalPlayerObject;
  ['Inherited Runners']: string | TotalPlayerObject;
  ['Inherited Runners Scored']: string | TotalPlayerObject;
  Groundouts: string | TotalPlayerObject;
  pitchingOrder: string | TotalPlayerObject;
  ERA: string | TotalPlayerObject;
  ['Batters Faced']: string | TotalPlayerObject;
  WHIP: string | TotalPlayerObject;
  Balk: string | TotalPlayerObject;
  Win: string | TotalPlayerObject;
  Loss: string | TotalPlayerObject;
}