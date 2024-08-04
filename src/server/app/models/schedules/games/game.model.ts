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
import {BoxScore} from "../../boxScores/box-scores.model.js";

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
    gameTime_epoch: string;
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
        this.gameTime_epoch = data.gameTime_epoch;
        this.homeResult = data.homeResult;
        this.probableStartingLineups = data.probableStartingLineups;
        this.probableStartingPitchers = data.probableStartingPitchers;
        this.lineScore = data.lineScore;
        this.gameStatusCode = data.gameStatusCode;
        this.boxScore = data.boxScore;
    }
}