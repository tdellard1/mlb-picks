import {Fielding} from "../../interfaces/fielding.interface.js";
import {Hitting} from "../../interfaces/hitting.interface.js";
import {BaseRunning} from "../../interfaces/base-running.interface.js";
import {Pitching} from "../../interfaces/pitching.interface.js";

export interface RosterPlayerStats {
    gamesStarted: string;
    Fielding: Fielding;
    gamesPlayed: string;
    Hitting: Hitting;
    BaseRunning: BaseRunning;
    longName: string;
    teamID: string;
    teamAbv: string;
    team: string;
    Pitching: Pitching;
}