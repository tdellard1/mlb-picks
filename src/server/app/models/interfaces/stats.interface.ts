import {Fielding} from "./fielding.interface.js";
import {Hitting} from "./hitting.interface.js";
import {Pitching} from "./pitching.interface.js";
import {BaseRunning} from "./base-running.interface.js";

export interface Stats {
    Hitting: Hitting;
    Fielding: Fielding;
    Pitching: Pitching;
    BaseRunning: BaseRunning;
}

export function toHitting({Hitting}: Stats): Hitting {
    return Hitting;
}