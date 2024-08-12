import {LineScore, Teams} from "../schedules/games/starting-lineups.model.js";
import {PlayersStats, PlayerStats} from "./player-stats.model.js";

export enum GameStatus {
    Completed = 'Completed',
    Postponed = 'Postponed',
    Suspended = 'Suspended',
    Live = 'Live - In Progress',
}

export interface Stats {
    Pitching: any;
    Fielding: any;
    Hitting: any;
    BaseRunning: any;
}

export class Hitting {
    private _D: string;
    private _T: string;
    private _AB: string;
    private _BB: string;
    private _GIDP: string;
    private _H: string;
    private _HBP: string;
    private _HR: string;
    private _IBB: string;
    private _R: string;
    private _RBI: string;
    private _SAC: string;
    private _SF: string;
    private _SO: string;
    private _TB: string;
    private _avg: string;

    constructor(data: any) {
        this._D = this.assignIfValid(data['2B'], '2B');
        this._T = this.assignIfValid(data['3B'], '3B');
        this._AB = this.assignIfValid(data.AB, 'AB');
        this._BB = this.assignIfValid(data.BB, 'BB');
        this._GIDP = this.assignIfValid(data.GIDP, 'GIDP');
        this._H = this.assignIfValid(data.H, 'H');
        this._HBP = this.assignIfValid(data.HBP, 'HBP');
        this._HR = this.assignIfValid(data.HR, 'HR');
        this._IBB = this.assignIfValid(data.IBB, 'IBB');
        this._R = this.assignIfValid(data.R, 'R');
        this._RBI = this.assignIfValid(data.RBI, 'RBI');
        this._SAC = this.assignIfValid(data.SAC, 'SAC');
        this._SF = this.assignIfValid(data.SF, 'SF');
        this._SO = this.assignIfValid(data.SO, 'SO');
        this._TB = this.assignIfValid(data.TB, 'TB');
        this._avg = data.avg;
    }

    assignIfValid(value: any, key: string): any {
        if (value === undefined) {
            throw new Error(`${key} is undefined`);
        }

        return value;
    }

    get D(): number {
        return Number(this._D);
    }

    get T(): number {
        return Number(this._T);
    }

    get AB(): number {
        return Number(this._AB);
    }

    get BB(): number {
        return Number(this._BB);
    }

    get GIDP(): number {
        return Number(this._GIDP);
    }

    get H(): number {
        return Number(this._H);
    }

    get HBP(): number {
        return Number(this._HBP);
    }

    get HR(): number {
        return Number(this._HR);
    }

    get IBB(): number {
        return Number(this._IBB);
    }

    get R(): number {
        return Number(this._R);
    }

    get RBI(): number {
        return Number(this._RBI);
    }

    get SAC(): number {
        return Number(this._SAC);
    }

    get SF(): number {
        return Number(this._SF);
    }

    get SO(): number {
        return Number(this._SO);
    }

    get TB(): number {
        return Number(this._TB);
    }

    get avg(): number {
        return Number(this._avg);
    }
}

export class BoxScore {
    GameLength?: string;
    Umpires?: string;
    gameStatus!: GameStatus;
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

    public static isFromYesterday({gameDate}: BoxScore) {
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

    public static get hasGameDate() {
        return (boxScore: BoxScore): boolean => {
            if (!boxScore) {
                return false;
            }

            return boxScore.gameDate !== undefined;
        }
    }

    public static get toGameID() {
        return (boxScore: BoxScore): string => {
            if (!boxScore) {
                return '';
            }

            return boxScore.gameID;
        }
    }

    public static toTeamStats(team: string) {
        return (boxScore: BoxScore): any => {
            if (!boxScore) {
                return '';
            }

            // const [away, home]: string[] = boxScore.gameID.split('_')[1].split('@');

            if (boxScore.away === team) {
                return boxScore.teamStats.away;
            } else if (boxScore.home === team) {
                return boxScore.teamStats.home;
            } else {
                throw new Error('Expected team not in game');
            }

        }
    }

    public static get isGameInProgress() {
        return (boxScore: BoxScore): boolean => {
            if (!boxScore) {
                return false;
            }

            return boxScore.gameStatus === GameStatus.Live;
        }
    }

    public static get sortChronologically() {
        return (boxScore: BoxScore, boxScore2: BoxScore) => {
            const gameDateOne: string = boxScore.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
            const aGameDate: Date = new Date(gameDateOne);

            const gameDateTwo: string = boxScore2.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
            const bGameDate: Date = new Date(gameDateTwo);

            return aGameDate.getTime() - bGameDate.getTime();
        }
    }

    public static includedIn(gameIds: string[]) {
        return ({gameID}: BoxScore): boolean => {
            return gameIds.includes(gameID)
        };
    }
}