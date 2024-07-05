import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {Analytics, TeamAnalytics, TeamSchedule} from "../../../common/model/team-schedule.interface";
import {ensure} from "../../../common/utils/array.utils";
import {AnalysisData} from "../../../common/model/analysis.interface";
import {LeagueRanking} from "../../../common/model/average-runs-per-game.interface";
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {NgForOf, NgOptimizedImage} from "@angular/common";

import {NgApexchartsModule
} from "ng-apexcharts";
import {LineChartComponent} from "../../ui/line-chart/line-chart.component";
import {ChartData, ChartOptions} from "../../data-access/chart-options";

@Component({
  selector: 'analysis-component-view',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    NgApexchartsModule,
    MatIcon,
    MatFabButton,
    MatCard,
    NgOptimizedImage,
    NgForOf,
    LineChartComponent
  ],
  templateUrl: './analysis-view.component.html',
  styleUrl: './analysis-view.component.css'
})
export class AnalysisViewComponent implements OnChanges {
  @Input() game: Game = {} as Game;
  @Input() teams: Teams = {} as Teams;
  @Input() teamSchedules: TeamSchedule[] = [];
  @Input() boxScoreSchedule: TeamSchedule[] = [];
  @Input() homeTeamAnalytics: TeamAnalytics = {} as TeamAnalytics;
  @Input() awayTeamAnalytics: TeamAnalytics = {} as TeamAnalytics;

  currentGame: Game = {} as Game;
  charts: ChartData[] = [];

  public runsPerGameAverageChartOptions: ChartOptions = {} as ChartOptions;
  public averageBattingAverageChartOptions: ChartOptions = {} as ChartOptions;
  public strikeoutAverageChartOptions: ChartOptions = {} as ChartOptions;


  ngOnChanges(changes: SimpleChanges): void {
    this.charts = [];
    this.currentGame = this.game;
    this.makeEverythingWork(this.currentGame);
  }

  makeEverythingWork(game: Game) {
    const homeTeam: string = this.teams.getTeamName(this.homeTeamAnalytics.team);
    const awayTeam: string = this.teams.getTeamName(this.awayTeamAnalytics.team);

    const battingAveragesHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    const battingAveragesAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    this.charts.push({
      nameOfChart: 'Batting Average',
      series: [
        {
          data: battingAveragesHome,
          name: `${homeTeam} - Batting Averages`
        },
        {
          data: battingAveragesAway,
          name: `${awayTeam} - Batting Averages`
        },
      ]
    } as ChartData);

    const runsForGameHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.runsForGame!)!;
    const runsForGameAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.runsForGame!)!;
    this.charts.push({
      nameOfChart: 'Runs For Games',
      series: [
        {
          data: runsForGameHome,
          name: `${homeTeam} - Runs`
        },
        {
          data: runsForGameAway,
          name: `${awayTeam} - Runs`
        },
      ]
    } as ChartData);

    const sluggingPercentageHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    const sluggingPercentageAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    this.charts.push({
      nameOfChart: 'Slugging Percentage',
      series: [
        {
          data: sluggingPercentageHome,
          name: `${homeTeam} - Slugging Percentage`
        },
        {
          data: sluggingPercentageAway,
          name: `${awayTeam} - Slugging Percentage`
        },
      ]
    } as ChartData);

    const onBasePercentageHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    const onBasePercentageAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    this.charts.push({
      nameOfChart: 'On Base Percentage',
      series: [
        {
          data: onBasePercentageHome,
          name: `${homeTeam} - On Base Percentage`
        },
        {
          data: onBasePercentageAway,
          name: `${awayTeam} - On Base Percentage`
        },
      ]
    } as ChartData);


    const onBasePlusSluggingHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
    const onBasePlusSluggingAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
    this.charts.push({
      nameOfChart: 'On Base Plus Slugging',
      series: [
        {
          data: onBasePlusSluggingHome,
          name: `${homeTeam} - On Base Plus Slugging`
        },
        {
          data: onBasePlusSluggingAway,
          name: `${awayTeam} - On Base Plus Slugging`
        },
      ]
    } as ChartData);












    const analysisData: AnalysisData = new AnalysisData(this.teamSchedules);

    this.runsPerGameAverageChartOptions = {} as ChartOptions;
    this.averageBattingAverageChartOptions = {} as ChartOptions;

    const rpgLeagueHigh: any[] = [];
    const rpgLeagueLow: any[] = [];

    for (let i = 15; i > 0; --i) {
      rpgLeagueHigh.push(ensure(analysisData.averageRunsPerGameModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '1')).value)
      rpgLeagueLow.push(ensure(analysisData.averageRunsPerGameModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '30')).value)
    }

    // this.runsPerGameAverageChartOptions.series[0].data = rpgLeagueHigh;
    // this.runsPerGameAverageChartOptions.series[3].data = rpgLeagueLow;
    // this.runsPerGameAverageChartOptions.series[1].data = [...analysisData.averageRunsPerGameModel.Team[home].values()].reverse();
    // this.runsPerGameAverageChartOptions.series[1].name = this.teams.getTeamFullName(home);
    // this.runsPerGameAverageChartOptions.series[2].data = [...analysisData.averageRunsPerGameModel.Team[away].values()].reverse();
    // this.runsPerGameAverageChartOptions.series[2].name = this.teams.getTeamFullName(away);

    const abaLeagueHigh: any[] = [];
    const abaLeagueLow: any[] = [];

    for (let i = 15; i > 0; --i) {
      abaLeagueHigh.push(ensure(analysisData.battingAverageModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '1')).value)
      abaLeagueLow.push(ensure(analysisData.battingAverageModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '30')).value)
    }

    // this.averageBattingAverageChartOptions.series[0].data = abaLeagueHigh;
    // this.averageBattingAverageChartOptions.series[3].data = abaLeagueLow;
    // this.averageBattingAverageChartOptions.series[1].data = [...analysisData.battingAverageModel.getTeamValues(home)].reverse();
    // this.averageBattingAverageChartOptions.series[1].name = this.teams.getTeamFullName(home);
    // this.averageBattingAverageChartOptions.series[2].data = [...analysisData.battingAverageModel.getTeamValues(away)].reverse();
    // this.averageBattingAverageChartOptions.series[2].name = this.teams.getTeamFullName(away);

    const soLeagueHigh: any[] = [];
    const soLeagueLow: any[] = [];

    for (let i = 15; i > 0; --i) {
      soLeagueHigh.push(ensure(analysisData.strikeoutModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '1')).value)
      soLeagueLow.push(ensure(analysisData.strikeoutModel.League[i].find((leagueRanking: LeagueRanking) => leagueRanking.rank === '30')).value)
    }

    // this.strikeoutAverageChartOptions.series[0].data = soLeagueHigh;
    // this.strikeoutAverageChartOptions.series[3].data = soLeagueLow;
    // this.strikeoutAverageChartOptions.series[1].data = [...analysisData.strikeoutModel.getTeamValues(home)].reverse();
    // this.strikeoutAverageChartOptions.series[1].name = this.teams.getTeamFullName(home);
    // this.strikeoutAverageChartOptions.series[2].data = [...analysisData.strikeoutModel.getTeamValues(away)].reverse();
    // this.strikeoutAverageChartOptions.series[2].name = this.teams.getTeamFullName(away);

  }
}
