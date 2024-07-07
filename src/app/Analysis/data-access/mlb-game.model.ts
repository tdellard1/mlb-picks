import {Game, LineScore} from "../../common/model/game.interface";
import {BoxScore} from "../../common/model/box-score.interface";
import {SaberMetrics} from "./sabermetrics.model";

export class MLBGame {
  gameID: string;
  gameType: string;
  away: string;
  gameTime: string;
  teamIDHome: string;
  gameDate: string;
  gameStatus?: string;
  gameTime_epoch: string;
  teamIDAway: string;
  probableStartingPitchers: any;
  probableStartingLineups?: any;
  home: string;
  lineScore?: LineScore;
  boxScore?: BoxScore;
  saberMetrics: SaberMetrics = {} as SaberMetrics;

  constructor(team: string, game: Game) {
    this.gameID = game.gameID;
    this.gameType = game.gameType;
    this.away = game.away;
    this.gameTime = game.gameTime;
    this.teamIDHome = game.teamIDHome;
    this.gameDate = game.gameDate;
    this.gameStatus = game.gameStatus;
    this.gameTime_epoch = game.gameTime_epoch;
    this.teamIDAway = game.teamIDAway;
    this.probableStartingPitchers = game.probableStartingPitchers;
    this.probableStartingLineups = game.probableStartingLineups;
    this.home = game.home;
    this.lineScore = game.lineScore;
    this.boxScore = game.boxScore;
    if (this.boxScore) {
      this.saberMetrics = new SaberMetrics(team, this.boxScore);
    }
  }
}
