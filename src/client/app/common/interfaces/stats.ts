import {Hitting} from "./hitting";
import {Fielding} from "./fielding";
import {Pitching} from "./pitching";
import {BaseRunning} from "./base-running";

export interface Stats {
  Hitting: Hitting;
  Fielding: Fielding;
  Pitching: Pitching;
  BaseRunning: BaseRunning;
}