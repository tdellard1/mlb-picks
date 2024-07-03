import {Game} from "./game.interface";
import {Team} from "./team.interface";
import {BoxScore} from "./box-score.interface";
import {AnalyticsUtils} from "../utils/analytics.utils";

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

      this.analytics?.push(new Analytics(team, boxScores.slice(0, i)));
    }
  }
}

export class Analytics {
  battingAverage?: number;
  runsPerGameAverage?: number;
  sluggingAverage?: number;
  onBasePercentage?: number;
  onBasePlusSlugging?: number;


  constructor(team: string, boxScores: BoxScore[]) {
    this.battingAverage = AnalyticsUtils.getTeamBattingAverages(team, boxScores);
    this.runsPerGameAverage = AnalyticsUtils.getTeamRunsPerGameAverages(team, boxScores);
    this.sluggingAverage = AnalyticsUtils.getTeamSluggingAverages(team, boxScores);
    this.onBasePercentage = AnalyticsUtils.getOnBasePercentageAverage(team, boxScores);
    this.onBasePlusSlugging = AnalyticsUtils.getOnBasePlusSluggingAverage(team, boxScores);
  }
}

export class LeagueAnalytics











export function gameToBoxScore({boxScore}: Game) {
  return boxScore!;
}

export function gameHasBoxScore(game: Game) {
  return game !== undefined && game !== null && game.boxScore !== undefined && game.boxScore !== null;
}
