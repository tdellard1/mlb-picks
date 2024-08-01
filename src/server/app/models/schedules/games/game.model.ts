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

export interface Game {
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
}