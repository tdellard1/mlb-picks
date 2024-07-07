import {BoxScore} from "../../common/model/box-score.interface";
import {TeamAnalyticsUtils} from "../../common/utils/team-analytics.utils";
import {roundToDecimalPlace} from "../../common/utils/general.utils";

export class SaberMetrics {
  battingAverage?: number;
  sluggingPercentage?: number;
  onBasePercentage?: number;
  onBasePlusSlugging?: number;
  weightedOnBaseAverage?: number;
  hittingStrikeouts?: number;

  constructor(team: string, boxScore: BoxScore) {
    this.battingAverage = Number(TeamAnalyticsUtils.getTeamBattingAverage(team, boxScore).toFixed(3));
    this.sluggingPercentage = Number(TeamAnalyticsUtils.getTeamSluggingAverage(team, boxScore).toFixed(3));
    this.onBasePercentage = Number(TeamAnalyticsUtils.getTeamOnBasePercentage(team, boxScore).toFixed(3));
    this.onBasePlusSlugging = roundToDecimalPlace((this.onBasePercentage + this.sluggingPercentage), 3);
    this.weightedOnBaseAverage = Number(TeamAnalyticsUtils.getWeightedOnBaseAverage(team, boxScore).toFixed(3));
    this.hittingStrikeouts = TeamAnalyticsUtils.getHittingStrikeouts(team, boxScore);
  }
}
