import {LineScoreTeam, Teams} from "./game.interface";
import {TeamStats} from "./team-stats.interface";
import {PlayerStats} from "./player-stats.interface";
import {OffensiveStats, StatsSource} from "../../features/Splits/splits/splits.component.js";
import {BoxScoreUtils} from "../utils/boxscore.utils.js";

export class BoxScore {
  GameLength: string;
  Umpires: string;
  gameStatus: string;
  Attendance: string;
  teamStats: Teams<TeamStats>;
  gameDate: string;
  Venue: string;
  currentCount: string;
  homeResult: string;
  away: string;
  lineScore: Teams<LineScoreTeam>;
  currentOuts: string;
  FirstPitch: string;
  Wind: string;
  home: string;
  playerStats: PlayersStats;
  decisions: Decision[];
  currentBatter: string;
  bases: any;
  awayResult: string;
  Weather: string;
  currentPitcher: string;
  currentInning: string;
  gameID: string;
  startingLineups: any;

  playerStatsMap: Map<string, PlayerStats> = new Map;

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

    if (data.playerStats && Object.keys(data.playerStats).length > 0) {
      const playerKeys: string[] = Object.keys(data.playerStats);

      playerKeys.forEach(playerKey => this.playerStatsMap.set(playerKey, new PlayerStats(data.playerStats[playerKey])));
    }
  }



  public static addOffensiveStats(offensiveStats: OffensiveStats, targetedTeam: string, statsSource: StatsSource) {
    return (boxScore: BoxScore): any => {
      const newOffensiveStats: OffensiveStats = new OffensiveStats();

      if ((statsSource !== StatsSource.Both && boxScore[statsSource] === targetedTeam) || statsSource === StatsSource.Both) {
        newOffensiveStats.Hits = BoxScoreUtils.getHits(targetedTeam, boxScore);
        newOffensiveStats.Doubles = BoxScoreUtils.getDoubles(targetedTeam, boxScore);
        newOffensiveStats.AtBats = BoxScoreUtils.getAtBats(targetedTeam, boxScore);
        newOffensiveStats.PlateAppearance = BoxScoreUtils.getPlateAppearances(targetedTeam, boxScore);
        newOffensiveStats.Singles = BoxScoreUtils.getSingles(targetedTeam, boxScore);
        newOffensiveStats.Triples = BoxScoreUtils.getTriples(targetedTeam, boxScore);
        newOffensiveStats.HomeRuns = BoxScoreUtils.getHomeRuns(targetedTeam, boxScore);
        newOffensiveStats.IntentionalWalks = BoxScoreUtils.getIntendedWalks(targetedTeam, boxScore);
        newOffensiveStats.Walks = BoxScoreUtils.getTotalWalks(targetedTeam, boxScore);
        newOffensiveStats.HitByPitch = BoxScoreUtils.getHitByPitch(targetedTeam, boxScore);
        newOffensiveStats.SacrificeFly = BoxScoreUtils.getSacrificeFly(targetedTeam, boxScore);
      }

      offensiveStats.add(newOffensiveStats);
    }
  }





















/*
  public static addOffensiveStats(offensiveStats: OffensiveStats, team: string) {
    return ({playerStatsMap, teamStats, home, away, gameID}: BoxScore): any => {
      console.log('Game: ', gameID);
      const newOffensiveStats: OffensiveStats = new OffensiveStats();
      // Use playerStats to get stats
      playerStatsMap.forEach((playerStats: PlayerStats) => {
        if (playerStats.team === team) {
          newOffensiveStats.AtBats += Number(playerStats.Hitting.AB);
          newOffensiveStats.Hits += playerStats.hits;
          newOffensiveStats.Singles += playerStats.singles;
          newOffensiveStats.Doubles += playerStats.doubles;
          newOffensiveStats.Triples += playerStats.triples;
          newOffensiveStats.HomeRuns += playerStats.homeRuns;
          newOffensiveStats.Walks += playerStats.unintentionalWalk;
          newOffensiveStats.IntentionalWalks += playerStats.intentionalWalk;
        } else if (playerStats.allPositionsPlayed === 'P') {
          newOffensiveStats.PlateAppearance += playerStats.plateAppearance;
        }
      });

      if (team === away) {
        console.log('hits: ', teamStats.away.Hitting.H);
        // console.log('pitching: ', teamStats.home.Pitching);

        if (Number(teamStats.away.Hitting.H) !== newOffensiveStats.Hits) {
          console.log('The hits don\'t match: ', teamStats.away.Hitting, newOffensiveStats);
        }
      } else if (team === home) {
        console.log('hits: ', teamStats.home.Hitting.H);
        // console.log('pitching: ', teamStats.away.Pitching);

        if (Number(teamStats.home.Hitting.H) !== newOffensiveStats.Hits) {
          console.log('The hits don\'t match: ', teamStats.home.Hitting, newOffensiveStats);
        }
      }

      offensiveStats.add(newOffensiveStats);
    }
  }
  */

  public static totalAtBatsFor(team: string, statsSource: StatsSource) {
    return (boxScore: BoxScore) => {
      let hits: number = 0;

      if (statsSource !== StatsSource.Both) {
        if (statsSource === StatsSource.Home && boxScore.home !== team) {
          return hits;
        } else if (statsSource === StatsSource.Away && boxScore.away !== team) {
          return hits;
        }
      }

      boxScore.playerStatsMap.forEach((playerStats: PlayerStats) => {
        if (playerStats.team === team && playerStats.Hitting.AB !== '0') {
          hits += Number(playerStats.Hitting.AB);
        }
      });

      return hits;
    }
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
