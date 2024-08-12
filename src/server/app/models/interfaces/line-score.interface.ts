import {ScoresByInning} from "./score-by-inning.interface.js";

export interface LineScore {
    H: string;
    R: string;
    team: string;
    scoresByInning: ScoresByInning;
    E: string;
}