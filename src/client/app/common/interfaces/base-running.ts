import {TotalPlayerObject} from "./game-stats";

export interface BaseRunning {
  CS: string | TotalPlayerObject;
  PO: string | TotalPlayerObject;
  SB: string | TotalPlayerObject;
}