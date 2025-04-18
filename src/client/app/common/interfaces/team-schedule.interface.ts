import {Game} from "./game";
import {Team} from "./team.interface";
import {BoxScore} from "../model/box.score.model";
import {TeamAnalyticsUtils} from "../utils/team-analytics.utils";
import {roundToDecimalPlace} from "../utils/general.utils";
import {RunsFirstInning} from "../../features/Analysis/data-access/runs-first-inning.model";

export interface Schedule {
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
    const games: Game[] = schedule
      // Games before today
      .filter(({gameTime_epoch}: Game) => {
        return (Number(gameTime_epoch) + 1000) < new Date().setHours(0, 0, 0, 0);
      })
      // Non-Postponed & Non-Suspended Games
      .filter(({gameStatus}: Game) => gameStatus === 'Completed')
      // Sort remaining games
      .sort((a, b) => Number(a.gameTime_epoch) - Number(b.gameTime_epoch))
      // Games before today
      .slice(-15);

    if (!games.every(({boxScore}) => !!boxScore)) {
      throw new Error(`Not All Games Have BoxScores -> ${games.find(({boxScore}) => !boxScore)?.gameID}`);
    }


    for (let i = 1; i < games.length + 1; i++) {
      const boxScores: BoxScore[] = games.map(gameToBoxScore);

      this.analytics?.push(new Analytics(team, boxScores.slice(0, i), i));
    }

    schedule.forEach((game: Game) => {
      this.processRunsFirstInning(game, team);
    });
  }

  processRunsFirstInning(game: Game, team: string) {
    const lineScore = game.lineScore || game.boxScore?.lineScore;
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
  [stat: string]: number
  // battingAveragePerGame?: number;
  // battingAverageForGame?: number;
  // runsPerGame?: number;
  // runsForGame?: number;
  // averagePerGameSluggingPercentage?: number;
  // sluggingPercentage?: number;
  // averagePerGameOnBasePercentage?: number;
  // onBasePercentage?: number;
  // averagePerGameOnBasePlusSlugging?: number;
  // onBasePlusSlugging?: number;
  // averagePerGameWeightedOnBaseAverage?: number;
  // weightedOnBaseAverage?: number;
  // hittingStrikeouts?: number;
  // weightedRunsAboveAverage?: number;


  constructor(team: string, boxScores: BoxScore[], whichGame: number) {
    const boxScore: BoxScore = boxScores.slice(whichGame - 1, whichGame)[0]!;

    this['battingAveragePerGame'] = TeamAnalyticsUtils.getTeamBattingAverages(team, boxScores);
    this['battingAverageForGame'] = Number(TeamAnalyticsUtils.getTeamBattingAverage(team, boxScore).toFixed(3));

    this['runsPerGame'] = TeamAnalyticsUtils.getTeamRunsPerGameAverages(team, boxScores);
    this['runsForGame'] = TeamAnalyticsUtils.getTeamRunsForGame(team, boxScore);

    this['averagePerGameSluggingPercentage'] = TeamAnalyticsUtils.getTeamSluggingAverages(team, boxScores);
    this['sluggingPercentage'] = Number(TeamAnalyticsUtils.getTeamSluggingAverage(team, boxScore).toFixed(3));


    this['averagePerGameOnBasePercentage'] = TeamAnalyticsUtils.getOnBasePercentageAverages(team, boxScores);
    this['onBasePercentage'] = Number(TeamAnalyticsUtils.getTeamOnBasePercentage(team, boxScore).toFixed(3));

    this['averagePerGameOnBasePlusSlugging'] = TeamAnalyticsUtils.getOnBasePlusSluggingAverages(team, boxScores);
    this['onBasePlusSlugging'] = roundToDecimalPlace((this['onBasePercentage'] + this['sluggingPercentage']), 3);

    this['averagePerGameWeightedOnBaseAverage'] = TeamAnalyticsUtils.getWeightedOnBaseAverages(team, boxScores);
    this['weightedOnBaseAverage'] = Number(TeamAnalyticsUtils.getWeightedOnBaseAverage(team, boxScore).toFixed(3));

    this['hittingStrikeouts'] = TeamAnalyticsUtils.getHittingStrikeouts(team, boxScore);
  }
}

export const Analytic: Map<string, string> = new Map()
  .set('battingAverageForGame', 'Batting Average Per Game')
  .set('battingAveragePerGame', 'Batting Average Mean')
  .set('runsForGame', 'Runs In Each Game')
  .set('runsPerGame', 'Runs Per Game Mean')
  .set('sluggingPercentage', 'Slugging Percentage')
  .set('averagePerGameSluggingPercentage', 'Slugging Percentage Mean')
  .set('onBasePercentage', 'On Base Percentage')
  .set('averagePerGameOnBasePercentage', 'On Base Percentage Mean')
  .set('onBasePlusSlugging', 'On Base Plus Slugging')
  .set('averagePerGameOnBasePlusSlugging', 'On Base Plus Slugging Mean')
  .set('weightedOnBaseAverage', 'Weighted On Base Average')
  .set('averagePerGameWeightedOnBaseAverage', 'Weighted On Base Average Mean')
  .set('hittingStrikeouts', 'Hitting Strikeouts');




export function gameToBoxScore({boxScore}: Game) {
  return new BoxScore(boxScore);
}

export function gameHasBoxScore(game: Game) {
  return game !== undefined && game !== null && game.boxScore !== undefined && game.boxScore !== null;
}
