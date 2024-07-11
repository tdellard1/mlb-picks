import {Game} from "./game.interface";
import {Team, Teams} from "./team.interface";
import {BoxScore} from "./box-score.interface";
import {TeamAnalyticsUtils} from "../utils/team-analytics.utils";
import {roundToDecimalPlace} from "../utils/general.utils";

export interface TeamSchedule {
  team: string,
  schedule: Game[],
  // games?: Map<string, Game>,
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
  battingAveragePerGame?: number;
  battingAverageForGame?: number;
  runsPerGame?: number;
  runsForGame?: number;
  averagePerGameSluggingPercentage?: number;
  sluggingPercentage?: number;
  averagePerGameOnBasePercentage?: number;
  onBasePercentage?: number;
  averagePerGameOnBasePlusSlugging?: number;
  onBasePlusSlugging?: number;
  averagePerGameWeightedOnBaseAverage?: number;
  weightedRunsAboveAverage?: number;


  constructor(team: string, boxScores: BoxScore[], whichGame: number) {
    const boxScore: BoxScore = boxScores.slice(whichGame - 1, whichGame)[0]!;

    this.battingAveragePerGame = TeamAnalyticsUtils.getTeamBattingAverages(team, boxScores);
    this.battingAverageForGame = Number(TeamAnalyticsUtils.getTeamBattingAverage(team, boxScore).toFixed(3));

    this.runsPerGame = TeamAnalyticsUtils.getTeamRunsPerGameAverages(team, boxScores);
    this.runsForGame = TeamAnalyticsUtils.getTeamRunsForGame(team, boxScore);

    this.averagePerGameSluggingPercentage = TeamAnalyticsUtils.getTeamSluggingAverages(team, boxScores);
    this.sluggingPercentage = Number(TeamAnalyticsUtils.getTeamSluggingAverage(team, boxScore).toFixed(3));


    this.averagePerGameOnBasePercentage = TeamAnalyticsUtils.getOnBasePercentageAverages(team, boxScores);
    this.onBasePercentage = Number(TeamAnalyticsUtils.getTeamOnBasePercentage(team, boxScore).toFixed(3));

    this.averagePerGameOnBasePlusSlugging = TeamAnalyticsUtils.getOnBasePlusSluggingAverages(team, boxScores);
    this.onBasePlusSlugging = roundToDecimalPlace((this.onBasePercentage + this.sluggingPercentage), 3);

    this.averagePerGameWeightedOnBaseAverage = TeamAnalyticsUtils.getWeightedOnBaseAverages(team, boxScores);
  }
}




export function gameToBoxScore({boxScore}: Game) {
  return boxScore!;
}

export function gameHasBoxScore(game: Game) {
  return game !== undefined && game !== null && game.boxScore !== undefined && game.boxScore !== null;
}
