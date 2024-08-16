import {TotalPlayerObject} from "./game-stats";

export interface Hitting {
  BB: string | TotalPlayerObject;
  AB: string | TotalPlayerObject;
  battingOrder: string | TotalPlayerObject;
  IBB: string | TotalPlayerObject;
  H: string | TotalPlayerObject;
  HR: string | TotalPlayerObject;
  substitutionOrder: string | TotalPlayerObject;
  TB: string | TotalPlayerObject;
  ['3B']: string | TotalPlayerObject;
  GIDP: string | TotalPlayerObject;
  ['2B']: string | TotalPlayerObject;
  R: string | TotalPlayerObject;
  SF: string | TotalPlayerObject;
  SAC: string | TotalPlayerObject;
  HBP: string | TotalPlayerObject;
  RBI: string | TotalPlayerObject;
  SO: string | TotalPlayerObject;
  AVG: string | TotalPlayerObject;
}