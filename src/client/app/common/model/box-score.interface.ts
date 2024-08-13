import {PlayerStats} from "./player-stats.interface";

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
  decisions!: Decision;
  gameDate!: string;
  gameID!: string;
  gameStatus!: string;
  gameStatusCode: string;
  home: string;
  homeResult: string;
  lineScore!: any;
  playerStats!: PlayerStats[];
  startingLineups!: any;
  teamIDAway: string;
  teamIDHome: string;
  teamStats!: any;


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

export interface PlayersStats {
  [playerId: string]: PlayerStats
}

export interface Decision {
  decision: string;
  playerID: string;
  team: string;
}


export function convertBoxScoresToListOfPlayerStats(boxScores: BoxScore[]): PlayerStats[] {
  const playerStats: PlayerStats[] = [];
  const arrayLength: number = boxScores.length;

  for (let i: number = 0; i < arrayLength; i++) {
    const playerStatsFromBoxScores = boxScores[i].playerStats;
    if (playerStatsFromBoxScores) {
      const playerStatsList: PlayerStats[] = Object.values(playerStatsFromBoxScores);
      const playerStatsLength: number = playerStatsList.length;

      for (let i: number = 0; i < playerStatsLength; i++) {
        playerStats.push(playerStatsList[i]);
      }
    }
  }

  return playerStats;
}

export function convertPlayerStatsToArray({playerStats}: BoxScore): PlayerStats[] {
  return Object.values(playerStats);
}
