import {GameStatus} from "../enums/game-status.enum.js";
import {Sites} from "../interfaces/teams.interface.js";
import {LineUp} from "../interfaces/line-up.interface.js";
import {Decision} from "../interfaces/decision.interface.js";
import {PlayerStats} from "./player-stats.model.js";
import {Stats} from "../interfaces/stats.interface.js";
import {LineScore} from "../interfaces/line-score.interface.js";

export class BoxScore {
    GameLength?: string;
    Umpires?: string;
    gameStatus!: string;
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
    awayResult?: string;
    teamIDAway?: string;
    Weather?: string;
    currentPitcher?: string;
    currentInning?: string;
    gameID!: string;
    gameStatusCode?: string;
    Ejections?: string;
    bases?: any;
    decisions!: Decision;
    playerStats!: PlayerStats[];
    teamStats!: Sites<Stats>;
    lineScore!: Sites<LineScore>;
    startingLineups!: Sites<LineUp>;

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
        return (boxScore: BoxScore): Stats => {
            if (!boxScore) {
                return {} as Stats;
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