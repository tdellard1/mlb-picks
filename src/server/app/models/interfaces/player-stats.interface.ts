import {Fielding} from "./fielding.interface.js";
import {Hitting} from "./hitting.interface.js";
import {BaseRunning} from "./base-running.interface.js";
import {Pitching} from "./pitching.interface.js";

export interface PlayerStats {
    allPositionsPlayed: string;
    gameID: string;
    teamID: string;
    started: string;
    team: string;
    note: string;
    playerID: string;
    startingPosition: string;
    Hitting: Fielding;
    Fielding: Hitting;
    Pitching: BaseRunning;
    BaseRunning: Pitching;
}