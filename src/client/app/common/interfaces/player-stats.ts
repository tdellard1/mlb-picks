import {Pitching} from "./pitching";
import {BaseRunning} from "./base-running";
import {Fielding} from "./fielding";
import {Hitting} from "./hitting";

export interface PlayerStats {
  BaseRunning: BaseRunning;
  Fielding: Fielding;
  Hitting: Hitting;
  Pitching: Pitching;
  allPositionsPlayed: string;
  gameID: string;
  mlbID: string;
  note: string;
  playerID: string;
  started: string;
  startingPosition: string;
  team: string;
  teamID: string;
}
