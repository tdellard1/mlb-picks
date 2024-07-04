import {Game} from "./game.interface";
import {Team, Teams} from "./team.interface";
import {BoxScore} from "./box-score.interface";
import {TeamAnalyticsUtils} from "../utils/team-analytics.utils";

export interface TeamSchedule {
  team: string,
  schedule: Game[],
  teamDetails?: Team,
}

export class TeamAnalytics {
  team: string;
  analytics?: Analytics[] = [];

  constructor(team: string, schedule: Game[]) {
    this.team = team;

    for (let i = 1; i < schedule.length + 1; i++) {
      const boxScores: BoxScore[] = schedule.filter(gameHasBoxScore).map(gameToBoxScore);

      this.analytics?.push(new Analytics(team, boxScores.slice(0, i), i));
    }
  }
}

export class Analytics {
  averagePerGameBattingAverage?: number;
  battingAverage?: number;
  averagePerGameRunsPerGameAverage?: number;
  // runsPerGameAverage?: number;
  averagePerGameSluggingPercentage?: number;
  // sluggingAverage?: number;
  averagePerGameOnBasePercentage?: number;
  // onBasePercentage?: number;
  averagePerGameOnBasePlusSlugging?: number;
  // onBasePlusSlugging?: number;
  averagePerGameWeightedOnBaseAverage?: number;
  weightedRunsAboveAverage?: number;


  constructor(team: string, boxScores: BoxScore[], whichGame: number) {
    const boxScore: BoxScore = boxScores.slice(whichGame - 1, whichGame)[0]!;
    this.averagePerGameBattingAverage = TeamAnalyticsUtils.getTeamBattingAverages(team, boxScores);
    this.battingAverage = Number(TeamAnalyticsUtils.getTeamBattingAverage(team, boxScore).toFixed(3));
    this.averagePerGameRunsPerGameAverage = TeamAnalyticsUtils.getTeamRunsPerGameAverages(team, boxScores);
    this.averagePerGameSluggingPercentage = TeamAnalyticsUtils.getTeamSluggingAverages(team, boxScores);
    this.averagePerGameOnBasePercentage = TeamAnalyticsUtils.getOnBasePercentageAverages(team, boxScores);
    this.averagePerGameOnBasePlusSlugging = TeamAnalyticsUtils.getOnBasePlusSluggingAverages(team, boxScores);
    this.averagePerGameWeightedOnBaseAverage = TeamAnalyticsUtils.getWeightedOnBaseAverages(team, boxScores);
  }
}




export function gameToBoxScore({boxScore}: Game) {
  return boxScore!;
}

export function gameHasBoxScore(game: Game) {
  return game !== undefined && game !== null && game.boxScore !== undefined && game.boxScore !== null;
}
