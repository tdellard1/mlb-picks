import {TeamSchedule} from "../../common/model/team-schedule.interface";
import {Game, LineScore} from "../../common/model/game.interface";
import {BoxScore, Decision, TeamStatsWrapper} from "../../common/model/box-score.interface";
import {deepCopy} from "../../common/utils/general.utils";
import {PlayerStats} from "../../common/model/player-stats.interface";

export class MLBTeamSchedule {
  private readonly _teamAbv: string;
  private readonly _games: MLBGame[];

  constructor(schedule: TeamSchedule) {
    this._teamAbv = schedule.team;
    this._games = schedule.schedule.map((game: Game) => {
      return new MLBGame(game);
    });
  }

  getSchedule(beforeToday: boolean = false, mustHaveBoxScores: boolean = false): MLBGame[] {
    let games: MLBGame[] = this.copyOfSchedule;

    if (beforeToday) {
      games = games.filter(({gameTime_epoch}: MLBGame) => {
        const epochForGame: number = Number(gameTime_epoch) * 1000;
        const epochForToday: number = new Date().setHours(0, 0, 0, 0);
        return epochForGame < epochForToday;
      })
    }

    if (mustHaveBoxScores) {
      games = games.filter(({boxScore}: MLBGame) => !!boxScore)
    }

    return games;
  }

  get team() {
    return this._teamAbv;
  }

  private get copyOfSchedule(): MLBGame[] {
    return deepCopy<MLBGame[]>(this._games);
  }
}

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

  constructor(game: Game) {
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
  }

  hasBoxScore() {
    return this.boxScore !== undefined && this.boxScore !== null;
  }

  addBoxScore(boxScore: BoxScore) {
    this.boxScore = boxScore;
  }
}

export class MLBBoxScore {
  Attendance: string;
  FirstPitch: string;
  GameLength: string;
  Umpires: string;
  Venue: string;
  Weather: string;
  Wind: string;
  away: string;
  awayResult: string;
  bases: any;
  currentBatter: string;
  currentCount: string;
  currentInning: string;
  currentOuts: string;
  currentPitcher: string;
  decisions: Decision[];
  gameDate: string;
  gameID: string;
  gameStatus: string;
  home: string;
  homeResult: string;
  lineScore: LineScore;
  playerStats: { [p: string]: PlayerStats };
  startingLineups: any;
  teamStats: TeamStatsWrapper;

  constructor(boxScore: BoxScore) {
    this.Attendance = boxScore.Attendance;
    this.FirstPitch = boxScore.FirstPitch;
    this.GameLength = boxScore.GameLength;
    this.Umpires = boxScore.Umpires;
    this.Venue = boxScore.Venue;
    this.Weather = boxScore.Weather;
    this.Wind = boxScore.Wind;
    this.away = boxScore.away;
    this.awayResult = boxScore.awayResult;
    this.bases = boxScore.bases;
    this.currentBatter = boxScore.currentBatter;
    this.currentCount = boxScore.currentCount;
    this.currentInning = boxScore.currentInning;
    this.currentOuts = boxScore.currentOuts;
    this.currentPitcher = boxScore.currentPitcher;
    this.decisions = boxScore.decisions;
    this.gameDate = boxScore.gameDate;
    this.gameID = boxScore.gameID;
    this.gameStatus = boxScore.gameStatus;
    this.home = boxScore.home;
    this.homeResult = boxScore.homeResult;
    this.lineScore = boxScore.lineScore;
    this.playerStats = boxScore.playerStats;
    this.startingLineups = boxScore.startingLineups;
    this.teamStats = boxScore.teamStats;
  }
}
