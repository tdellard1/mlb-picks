import {PlayerStats} from "../interfaces/player-stats";
import {Sites} from "../interfaces/sites";
import {LineScore} from "../interfaces/line-score";
import {StartingLineUp} from "../interfaces/starting-line-up";
import {Stats} from "../interfaces/stats";
import {Decision} from "../interfaces/decision";

export class BoxScore {
  Attendance: string;
  Ejections: string;
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
  decisions: Decision;
  gameDate: string;
  gameID: string;
  gameStatus!: string;
  gameStatusCode: string;
  home: string;
  homeResult: string;
  lineScore: Sites<LineScore>;
  playerStats: PlayerStats[];
  startingLineups: Sites<StartingLineUp>;
  teamIDAway: string;
  teamIDHome: string;
  teamStats!: Sites<Stats>;

  constructor(data: any) {
    this.GameLength = data.GameLength;
    this.Umpires = data.Umpires;
    this.gameStatus = data.gameStatus;
    this.Attendance = data.Attendance;
    this.teamStats = data.teamStats;
    this.gameDate = data.gameDate;
    this.Venue = data.Venue;
    this.currentCount = data.currentCount;
    this.homeResult = data.homeResult;
    this.away = data.away;
    this.lineScore = data.lineScore;
    this.currentOuts = data.currentOuts;
    this.FirstPitch = data.FirstPitch;
    this.Wind = data.Wind;
    this.home = data.home;
    this.playerStats = data.playerStats;
    this.decisions = data.decisions;
    this.currentBatter = data.currentBatter;
    this.bases = data.bases;
    this.awayResult = data.awayResult;
    this.Weather = data.Weather;
    this.currentPitcher = data.currentPitcher;
    this.currentInning = data.currentInning;
    this.gameID = data.gameID;
    this.startingLineups = data.startingLineups;
  }
}
