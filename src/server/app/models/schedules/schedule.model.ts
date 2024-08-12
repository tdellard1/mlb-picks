import {Game} from "./games/game.model.js";

export class Schedule {
    team!: string;
    schedule!: Game[];

    constructor(data?: any) {
        if (data) {
            this.team = data.team;

            if (Array.isArray(data.schedule)) {
                this.schedule = data.schedule.map((data: any) => new Game(data));
            } else {
                this.schedule = data.schedule;
            }
        }
    }

    public static get15MostRecentGames({schedule}: Schedule) {
        return schedule.slice()
            .filter(Game.isBeforeToday)
            /** FixMe Schedules aren't updated immediately, may need to filter gameStatus on Box Scores that have been added to schedules */
            .filter(Game.isCompleted)
            .sort(Game.sortChronologically)
            .slice(-15);
    }
}