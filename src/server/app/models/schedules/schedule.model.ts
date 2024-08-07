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
        return schedule.slice().filter(({gameTime_epoch}) =>
            Number(gameTime_epoch) * 1000 < new Date().setHours(0, 0, 0, 0))
            /** FixMe Schedules aren't updated immediately, may need to filter gameStatus on Box Scores that have been added to schedules */
            .filter(({gameStatus}) => gameStatus === 'Completed')
            .sort((aGame: Game, bGame: Game) => {
                const aGameStart: number = Number(aGame.gameTime_epoch);
                const bGameStart: number = Number(bGame.gameTime_epoch);
                return aGameStart - bGameStart;
            })
            .slice(-15);
    }
}