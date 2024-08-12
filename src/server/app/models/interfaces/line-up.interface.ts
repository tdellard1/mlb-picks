import {Starter} from "../schedules/games/starting-lineups.model.js";

export interface LineUp {
    team: string;
    starters: Starter[]
}