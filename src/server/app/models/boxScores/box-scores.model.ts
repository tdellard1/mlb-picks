import {LineScore, Teams} from "../schedules/games/starting-lineups.model.js";
import {PlayersStats, PlayerStats} from "./player-stats.model.js";

export class BoxScore {
    GameLength?: string;
    Umpires?: string;
    gameStatus?: string;
    Attendance?: string;
    gameDate!: string;
    Venue?: string;
    teamIDHome?: string;
    currentCount?: string;
    homeResult?: string;
    away?: string;
    currentOuts?: string;
    FirstPitch?: string;
    Wind?: string;
    home?: string;
    currentBatter?: string;
    Ejections?: string;
    awayResult?: string;
    teamIDAway?: string;
    Weather?: string;
    currentPitcher?: string;
    currentInning?: string;
    gameID!: string;
    gameStatusCode?: string;
    lineScore?: Teams<LineScore>;
    playerStats?: PlayersStats;
    decisions?: any;
    bases?: any;
    teamStats?: any;
    startingLineups?: any;

    constructor(data?: any) {
        if (data) {
            this.GameLength = data.GameLength;
            this.Umpires = data.Umpires;
            this.gameStatus = data.gameStatus;
            this.Attendance = data.Attendance;
            this.gameDate = data.gameDate;
            this.Venue = data.Venue;
            this.teamIDHome = data.teamIDHome;
            this.currentCount = data.currentCount;
            this.homeResult = data.homeResult;
            this.away = data.away;
            this.currentOuts = data.currentOuts;
            this.FirstPitch = data.FirstPitch;
            this.Wind = data.Wind;
            this.home = data.home;
            this.currentBatter = data.currentBatter;
            this.Ejections = data.Ejections;
            this.awayResult = data.awayResult;
            this.teamIDAway = data.teamIDAway;
            this.Weather = data.Weather;
            this.currentPitcher = data.currentPitcher;
            this.currentInning = data.currentInning;
            this.gameID = data.gameID;
            this.gameStatusCode = data.gameStatusCode;
            this.playerStats = data.playerStats;
            this.decisions = data.decisions;
            this.bases = data.bases;
            this.teamStats = data.teamStats;
            this.startingLineups = data.startingLineups;
            this.lineScore = data.lineScore;
        }
    }
}