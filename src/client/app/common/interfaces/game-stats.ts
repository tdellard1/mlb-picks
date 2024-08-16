import {Hitting} from "./hitting";
import {Pitching} from "./pitching";
import {Fielding} from "./fielding";
import {BaseRunning} from "./base-running";

export interface GameStats {
  Pitching: Pitching;
  BaseRunning: BaseRunning;
  Fielding: Fielding;
  Hitting: Hitting;
}

export interface TotalPlayerObject {
  total: string;
  playerID: string[];
}
