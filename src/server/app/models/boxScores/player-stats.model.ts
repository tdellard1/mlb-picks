import {Game} from "../schedules/games/game.model.js";
import {BoxScore} from "./box-scores.model.js";
import {Sites} from "../interfaces/teams.interface.js";
import {LineScore} from "../interfaces/line-score.interface.js";

export class PlayerStats {
    allPositionsPlayed: string;
    gameID: string;
    Pitching: any;
    Fielding: any;
    teamID: string;
    Hitting: any;
    BaseRunning: any;
    started: string;
    team: string;
    startingPosition: string;
    playerID: string;
    note: string;

    constructor(data: any) {
        this.allPositionsPlayed = data.allPositionsPlayed;
        this.gameID = data.gameID;
        this.Pitching = data.Pitching;
        this.Fielding = data.Fielding;
        this.teamID = data.teamID;
        this.Hitting = data.Hitting;
        this.BaseRunning = data.BaseRunning;
        this.started = data.started;
        this.team = data.team;
        this.startingPosition = data.startingPosition;
        this.playerID = data.playerID;
        this.note = data.note;
    }

    public static get sortChronologically () {
        return (gameStatsOne: PlayerStats, gameStatsTwo: PlayerStats): number => {
            const gameDateOne: string = gameStatsOne.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
            const aGameDate: Date = new Date(gameDateOne);

            const gameDateTwo: string = gameStatsTwo.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
            const bGameDate: Date = new Date(gameDateTwo);

            return aGameDate.getTime() - bGameDate.getTime();
        }
    }

    public static get playerStarted () {
        return (gameStats: PlayerStats): boolean => {
           return gameStats.started === 'True';
        }
    }

    public static getStatsWithLineScore (lineScores: Map<string, (Game | BoxScore)>) {
        return (gameStats: PlayerStats): [PlayerStats, Sites<LineScore>] => {
            if (lineScores.has(gameStats.gameID) && lineScores.get(gameStats.gameID)?.lineScore) {
                return [gameStats, lineScores.get(gameStats.gameID)?.lineScore!];
            } else {
                throw new Error('Can\'t find line score for gameID');
                // return [gameStats, undefined] as unknown as [PlayerStats, Sites<LineScore>];
            }
        }
    }


}

export interface PlayersStats {
    [playerId: string]: PlayerStats
}