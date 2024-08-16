import {TotalPlayerObject} from "./game-stats";

export interface Pitching {
  BB: string | TotalPlayerObject;
  Balk: string | TotalPlayerObject;
  ['Wild Pitch']: string | TotalPlayerObject;
  Flyouts: string | TotalPlayerObject;
  decision: string | TotalPlayerObject;
  ['Inherited Runners']: string | TotalPlayerObject;
  H: string | TotalPlayerObject;
  HR: string | TotalPlayerObject;
  ER: string | TotalPlayerObject;
  Strikes: string | TotalPlayerObject;
  ['Inherited Runners Scored']: string | TotalPlayerObject;
  Groundouts: string | TotalPlayerObject;
  R: string | TotalPlayerObject;
  pitchingOrder: string | TotalPlayerObject;
  ERA: string | TotalPlayerObject;
  HBP: string | TotalPlayerObject;
  InningsPitched: string | TotalPlayerObject;
  ['Batters Faced']: string | TotalPlayerObject;
  SO: string | TotalPlayerObject;
  Pitches: string | TotalPlayerObject;
  WHIP: string | TotalPlayerObject;
  Win: string | TotalPlayerObject;
  Loss: string | TotalPlayerObject;
}