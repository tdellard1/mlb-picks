import {LineScore} from "./game.interface";
import {TeamStats} from "./team-stats.interface";
import {PlayerStats} from "./player-stats.interface";

export interface BoxScore {
  GameLength: string;
  Umpires: string;
  gameStatus: string;
  Attendance: string;
  teamStats: TeamStatsWrapper;
  gameDate: string;
  Venue: string;
  currentCount: string;
  homeResult: string;
  away: string;
  lineScore: LineScore;
  currentOuts: string;
  FirstPitch: string;
  Wind: string;
  home: string;
  playerStats: {[playerId: string]: PlayerStats};
  decisions: Decision[];
  currentBatter: string;
  bases: any;
  awayResult: string;
  Weather: string;
  currentPitcher: string;
  currentInning: string;
  gameID: string;
  startingLineups: any;
}

export interface TeamStatsWrapper {
  home: TeamStats;
  away: TeamStats;
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
