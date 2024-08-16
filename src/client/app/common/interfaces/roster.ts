import {Pitching} from "./pitching";
import {Fielding} from "./fielding";
import {Hitting} from "./hitting";
import {RosterPlayer} from "./players";
import {BaseRunning} from "./base-running";

export interface Roster {
  team: string;
  roster: RosterPlayer[];
}

export interface RosterTeamStats {
  Pitching: Pitching;
  BaseRunning: BaseRunning;
  Fielding: Fielding;
  Hitting: Hitting;
  gamesPlayed: string;
  gamesStarted: string;
  team: string;
  teamAbv: string;
  teamID: string;
}
