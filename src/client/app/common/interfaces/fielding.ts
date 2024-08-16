import {TotalPlayerObject} from "./game-stats";

export interface Fielding {
  ['Passed Ball']: string | TotalPlayerObject;
  ['Outfield assists']: string | TotalPlayerObject;
  E: string | TotalPlayerObject;
  Pickoffs: string | TotalPlayerObject;
}