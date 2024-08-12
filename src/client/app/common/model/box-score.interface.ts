import {LineScoreTeam, Site, Teams} from "./game.interface";
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



  public static addOffensiveStats(
    offensiveStats: OffensiveStats,
    targetedTeam: string,
    statsSource: StatsSource,
    site: Site,
    opposingTeam: string) {
    return (boxScore: BoxScore): any => {
      const newOffensiveStats: OffensiveStats = new OffensiveStats();

      const teamsMatch: boolean =
        [boxScore[Site.Away], boxScore[Site.Home]].some((team: string) => team === targetedTeam) &&
        [boxScore[Site.Away], boxScore[Site.Home]].some((team: string) => team === opposingTeam)

      switch (statsSource) {
        case StatsSource.Season:
          collectOffensiveStatsFromBoxScore(newOffensiveStats, boxScore);
          break;
        case StatsSource.Split:
          if (boxScore[site] === targetedTeam) {
            collectOffensiveStatsFromBoxScore(newOffensiveStats, boxScore);
          }
          break;
        case StatsSource.Teams:
          if (teamsMatch) {
          console.log(statsSource, boxScore.gameID, boxScore.teamStats);
            collectOffensiveStatsFromBoxScore(newOffensiveStats, boxScore);
          }
          break;
      }

      offensiveStats.add(newOffensiveStats);

      function collectOffensiveStatsFromBoxScore(os: OffensiveStats, b: BoxScore): void {
        os.Hits = BoxScoreUtils.getHits(targetedTeam, b);
        os.Doubles = BoxScoreUtils.getDoubles(targetedTeam, b);
        os.AtBats = BoxScoreUtils.getAtBats(targetedTeam, b);
        os.PlateAppearance = BoxScoreUtils.getPlateAppearances(targetedTeam, b);
        os.Singles = BoxScoreUtils.getSingles(targetedTeam, b);
        os.Triples = BoxScoreUtils.getTriples(targetedTeam, b);
        os.HomeRuns = BoxScoreUtils.getHomeRuns(targetedTeam, b);
        os.IntentionalWalks = BoxScoreUtils.getIntendedWalks(targetedTeam, b);
        os.Walks = BoxScoreUtils.getTotalWalks(targetedTeam, b);
        os.HitByPitch = BoxScoreUtils.getHitByPitch(targetedTeam, b);
        os.SacrificeFly = BoxScoreUtils.getSacrificeFly(targetedTeam, b);
      }
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
