import {Game} from "./games/game.model.js";

export class Schedule {
    team!: string;
    schedule!: Game[];

    constructor(data?: any) {
        if (data) {
            this.team = data.team;
            this.schedule = data.schedule;
        }
    }
}