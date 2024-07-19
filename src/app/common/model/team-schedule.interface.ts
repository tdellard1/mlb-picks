import {Game} from "./game.interface";
import {Team} from "./team.interface";
import {BoxScore} from "./box-score.interface";
import {TeamAnalyticsUtils} from "../utils/team-analytics.utils";
import {roundToDecimalPlace} from "../utils/general.utils";
import {getGamesBeforeToday} from "../utils/schedule.utils";
import {RunsFirstInning} from "../../Analysis/data-access/runs-first-inning.model";

export interface TeamSchedule {
  team: string,
  schedule: Game[],
  teamDetails?: Team,
}

export class TeamAnalytics {
  team: string;
  analytics?: Analytics[] = [];
  runsFirstInning: RunsFirstInning = new RunsFirstInning();

  constructor(team: string, schedule: Game[]) {
    this.team = team;

    const scheduleBeforeToday: Game[] = getGamesBeforeToday(schedule);
    const last15GamesBeforeToday: Game[] = scheduleBeforeToday.slice(scheduleBeforeToday.length - 15, scheduleBeforeToday.length);


    for (let i = 1; i < last15GamesBeforeToday.length + 1; i++) {
      const boxScores: BoxScore[] = last15GamesBeforeToday.map(gameToBoxScore);

      console.log(boxScores);
      this.analytics?.push(new Analytics(team, boxScores.slice(0, i), i));
    }

    schedule.forEach((game: Game) => {
      this.processRunsFirstInning(game, team);
    });
  }

  processRunsFirstInning(game: Game, team: string) {
    let lineScore = game.lineScore || game.boxScore?.lineScore;
    if (lineScore) {
      const isHome: boolean = lineScore.home.team === team;

      if (isHome) {
        const isNRFI: boolean = Number(lineScore.home.scoresByInning[1]) === 0;

        if (isNRFI) {
          this.runsFirstInning.addHomeNRFI();
        } else {
          this.runsFirstInning.addHomeYRFI();
        }
      } else {
        const isNRFI: boolean = Number(lineScore.away.scoresByInning[1]) === 0;

        if (isNRFI) {
          this.runsFirstInning.addAwayNRFI();
        } else {
          this.runsFirstInning.addAwayYRFI();
        }
      }
    } else {
      return;
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
  weightedOnBaseAverage?: number;
  hittingStrikeouts?: number;
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
    this.weightedOnBaseAverage = Number(TeamAnalyticsUtils.getWeightedOnBaseAverage(team, boxScore).toFixed(3));

    this.hittingStrikeouts = TeamAnalyticsUtils.getHittingStrikeouts(team, boxScore);
  }
}




export function gameToBoxScore({boxScore}: Game) {
  return boxScore!;
}

export function gameHasBoxScore(game: Game) {
  return game !== undefined && game !== null && game.boxScore !== undefined && game.boxScore !== null;
}
