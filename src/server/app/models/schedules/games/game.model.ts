/*
{
  "gameID": "20240328_WAS@CIN",
  "gameType": "REGULAR_SEASON",
  "away": "WAS",
  "teamIDHome": "7",
  "gameDate": "20240328",
  "gameStatus": "Completed",
  "teamIDAway": "30",
  "home": "CIN",
  "awayResult": "L",
  "gameTime": "4:10p",
  "gameTime_epoch": "1711656600.0",
  "homeResult": "W",
  "probableStartingLineups": {},
  "probableStartingPitchers": {},
  "lineScore": {},
  "gameStatusCode": "2"
}
*/

import {Starter} from "./starter";
import {BoxScore} from "../../boxScores/box-scores.model.js";
import {GameStatus} from "../../enums/game-status.enum.js";
import {Sites} from "../../interfaces/teams.interface.js";
import {LineScore} from "../../interfaces/line-score.interface.js";

export class Game {
    gameID: string;
    gameType: string;
    away: string;
    teamIDHome: string;
    gameDate: string;
    gameStatus: string;
    teamIDAway: string;
    home: string;
    awayResult: string;
    gameTime: string;
    private readonly _gameTime_epoch: string;
    homeResult: string;
    probableStartingLineups: Sites<Starter[]>;
    probableStartingPitchers: Sites<string>;
    lineScore: Sites<LineScore>;
    gameStatusCode: string;
    boxScore: BoxScore;

    constructor(data: any) {
        this.gameID = data.gameID;
        this.gameType = data.gameType;
        this.away = data.away;
        this.teamIDHome = data.teamIDHome;
        this.gameDate = data.gameDate;
        this.gameStatus = data.gameStatus;
        this.teamIDAway = data.teamIDAway;
        this.home = data.home;
        this.awayResult = data.awayResult;
        this.gameTime = data.gameTime;
        this._gameTime_epoch = data.gameTime_epoch;
        this.homeResult = data.homeResult;
        this.probableStartingLineups = data.probableStartingLineups;
        this.probableStartingPitchers = data.probableStartingPitchers;
        this.lineScore = data.lineScore;
        this.gameStatusCode = data.gameStatusCode;
        this.boxScore = data.boxScore;
    }

    public static toDTO(game: any) {
        const gameDTO: any = {};

        Object.getOwnPropertyNames(game).forEach((key: string) => {
           if (key === '_gameTime_epoch') {
               gameDTO['gameTime_epoch'] = game['_gameTime_epoch'];
           } else {
               gameDTO[key] = game[key];
           }
        });

        return gameDTO;

    }

    get gameTime_epoch(): number {
        return Number(this._gameTime_epoch) * 1000;
    }

    public static get isPostponed() {
        return (game: Game): boolean => {
            return game.gameStatus === GameStatus.Postponed;
        }
    }

    public static get isCompleted() {
        return (game: Game): boolean => {
            return game.gameStatus === GameStatus.Completed;
        }
    }

    public static get isCompletedOrSuspended() {
        return (game: Game): boolean => {
            return game.gameStatus === GameStatus.Completed || game.gameStatus === GameStatus.Suspended;
        }
    }

    public static teamIsHome(team: string) {
        return (game: Game): boolean => {
            return game.home === team;
        }
    }

    public static teamIsAway(team: string) {
        return (game: Game): boolean => {
            return game.home === team;
        }
    }

    public static get toGameID() {
        return (game: Game): string => {
            if (!game) {
                return '';
            }

            return game.gameID;
        }
    }

    public static notContainedWithin(possiblyContainsAMatchingGameID: { gameID: string }[]) {
        return (game: Game): boolean => {
            return !possiblyContainsAMatchingGameID.some(({gameID}) => game.gameID === gameID);
        }
    }

    public static get isBeforeToday() {
        return ({gameTime_epoch}: Game): boolean => {
            return gameTime_epoch < new Date().setHours(0, 0, 0, 0);
        }
    }

    public static get sortChronologically() {
        return (game1: Game, game2: Game): number => {
            return game1.gameTime_epoch - game2.gameTime_epoch;
        }
    }

    public static get sortReverseChronologically() {
        return (game1: Game, game2: Game): number => {
            return game2.gameTime_epoch - game1.gameTime_epoch;
        }
    }

    public static isFromYesterday({gameDate}: Game) {
        if (gameDate === undefined) {
            return false;
        }
        const formattedDate: string = gameDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
        const boxScoreDateTimeStamp: number = new Date(formattedDate).setHours(0, 0, 0, 0);
        const boxScoreDate: Date = new Date(boxScoreDateTimeStamp);

        const todayTimestamp: number = new Date().setHours(0, 0, 0, 0);
        const yesterday: Date = new Date(todayTimestamp);
        yesterday.setDate(yesterday.getDate() - 1);

        return yesterday.getTime() === boxScoreDate.getTime();
    }

    public static getIfSource(target: string, source: string, site: string, opp: string) {
        return (game: Game): boolean => {
            switch (source) {
                case 'split':
                    return (site === 'away' && game.away === target || site === 'home' && game.home === target);
                case 'teams':
                    return (game.away === target || game.home === target) && (game.away === opp || game.home === opp);
                default:
                    throw new Error('There should be no default')
            }
        }
    }
}