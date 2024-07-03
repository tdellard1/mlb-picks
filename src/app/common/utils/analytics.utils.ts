import {BoxScore} from "../model/box-score.interface";
import {PlayerStats} from "../model/player-stats.interface";
import {roundToDecimalPlace, sum} from "./general.utils";
import {LineScore} from "../model/game.interface";
import {ensure} from "./array.utils";

export class AnalyticsUtils {

  /* ------------------------------------------------------------------------------------- */
  /* ---------------------------------- Batting Average ---------------------------------- */
  /* ------------------------------------------------------------------------------------- */
  static getTeamBattingAverages(team: string, boxScores: BoxScore[]) {
    const battingAverageForAllGames: number[] = boxScores.map((boxScore: BoxScore) => {
      return AnalyticsUtils.getTeamBattingAverage(team, boxScore);
    });

    const battingAverageTotal: number = sum(battingAverageForAllGames) / boxScores.length;
    return roundToDecimalPlace(battingAverageTotal, 3);
  }

  static getTeamBattingAverage(teamAbbreviation: string, boxScore: BoxScore): number {
    const players: PlayerStats[] = Array.from(Object.values(boxScore?.playerStats));
    const playersOnTeam: PlayerStats[] = players.filter((player: PlayerStats) => player.team === teamAbbreviation);

    const playersAtBats: number[] = playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.AB));
    const teamsTotalAtBats: number = sum(playersAtBats);
    let teamHits: number;

    if (teamAbbreviation === boxScore.away) {
      teamHits = Number(boxScore?.teamStats['away'].Hitting.H);
    } else if (teamAbbreviation === boxScore.home) {
      teamHits = Number(boxScore?.teamStats['home'].Hitting.H);
    } else {
      throw new Error('Team doesn\'t match');
    }

    return teamHits / teamsTotalAtBats;
  }

  /* ------------------------------------------------------------------------------------------- */
  /* ---------------------------------- Runs Per Game Average ---------------------------------- */
  /* ------------------------------------------------------------------------------------------- */

  static getTeamRunsPerGameAverages(team: string, boxScores: BoxScore[]) {
    const runsPerGameForAllGames: number[] = boxScores.map((boxScore: BoxScore) => {
      return AnalyticsUtils.getTeamRunsPerGameAverage(team, boxScore);
    });

    const runsPerGameAverageTotal: number = sum(runsPerGameForAllGames) / boxScores.length;
    return roundToDecimalPlace(runsPerGameAverageTotal, 2);
  }

  static getTeamRunsPerGameAverage(teamAbbreviation: string, boxScore: BoxScore) {
    const {home, away}: LineScore = ensure(boxScore?.lineScore);
    if (home.team === teamAbbreviation) {
      return Number(home.R);
    } else if (away.team === teamAbbreviation) {
      return Number(away.R);
    } else {
      throw new TypeError('Team is not home or away: ' + teamAbbreviation);
    }
  }

  /* ------------------------------------------------------------------------------------------- */
  /* ------------------------------------- Slugging Average ------------------------------------ */
  /* ------------------------------------------------------------------------------------------- */

  static getTeamSluggingAverages(team: string, boxScores: BoxScore[]) {
    const sluggingAverageForAllGames: number[] = boxScores.map((boxScore: BoxScore) => {
      return AnalyticsUtils.getTeamSluggingAverage(team, boxScore);
    });

    const runsPerGameAverageTotal: number = sum(sluggingAverageForAllGames) / boxScores.length;
    return roundToDecimalPlace(runsPerGameAverageTotal, 3);
  }

  static getTeamSluggingAverage(teamAbbreviation: string, {away, home, teamStats, playerStats}: BoxScore) {
    const players: PlayerStats[] = Array.from(Object.values(playerStats));
    const playersOnTeam: PlayerStats[] = players.filter((player: PlayerStats) => player.team === teamAbbreviation);

    const hits: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.H)));
    const atBats: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.AB)));
    const homeRuns: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.HR)));
    const triples: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting["3B"])));
    const doubles: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting["2B"])));
    const singles: number = hits - doubles - triples - homeRuns;
    return (singles + (doubles * 2) + (triples * 2) + (homeRuns * 4)) / atBats;
  }

  /* ------------------------------------------------------------------------------------------- */
  /* ----------------------------------- On Base Percentage ------------------------------------ */
  /* ------------------------------------------------------------------------------------------- */

  static getOnBasePercentageAverage(team: string, boxScores: BoxScore[]) {
    const sluggingAverageForAllGames: number[] = boxScores.map((boxScore: BoxScore) => {
      return AnalyticsUtils.getTeamOnBasePercentage(team, boxScore);
    });

    const runsPerGameAverageTotal: number = sum(sluggingAverageForAllGames) / boxScores.length;
    return roundToDecimalPlace(runsPerGameAverageTotal, 3);
  }

  static getTeamOnBasePercentage(teamAbbreviation: string, {away, home, teamStats, playerStats}: BoxScore) {
    const players: PlayerStats[] = Array.from(Object.values(playerStats));
    const playersOnTeam: PlayerStats[] = players.filter((player: PlayerStats) => player.team === teamAbbreviation);

    const hits: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.H)));
    const walks: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.BB)));
    const hitByPitch: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.HBP)));
    const atBats: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.AB)));
    const sacrificeFly: number = sum(playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.SF)));

    return (hits + walks + hitByPitch) / (atBats + walks + hitByPitch + sacrificeFly);
  }

  /* ------------------------------------------------------------------------------------------- */
  /* ----------------------------------- On Base Plus Slugging --------------------------------- */
  /* ------------------------------------------------------------------------------------------- */

  static getOnBasePlusSluggingAverage(team: string, boxScores: BoxScore[]) {
    const onBasePercentage: number = AnalyticsUtils.getOnBasePercentageAverage(team, boxScores);
    const sluggingPercentage: number = AnalyticsUtils.getTeamSluggingAverages(team, boxScores);
    return roundToDecimalPlace((onBasePercentage + sluggingPercentage), 3);
  }
}
