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

import {LineScore, LineUp, Teams} from "./starting-lineups.model.js";
import {BoxScore, GameStatus} from "../../boxScores/box-scores.model.js";

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
    probableStartingLineups: Teams<LineUp>;
    probableStartingPitchers: Teams<string>;
    lineScore: Teams<LineScore>;
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

    public static get gameIsCompleted() {
        return (game: Game): boolean => {
            return game.gameStatus === GameStatus.Completed;
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
}