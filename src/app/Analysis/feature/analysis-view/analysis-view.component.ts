import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {Analytics, TeamAnalytics, TeamSchedule} from "../../../common/model/team-schedule.interface";
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {NgForOf, NgOptimizedImage} from "@angular/common";

import {
  NgApexchartsModule
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
  @Input() boxScoreSchedule: TeamSchedule[] = [];
  @Input() homeTeamAnalytics: TeamAnalytics = {} as TeamAnalytics;
  @Input() awayTeamAnalytics: TeamAnalytics = {} as TeamAnalytics;

  currentGame: Game = {} as Game;
  charts: ChartData[] = [];


  ngOnChanges(): void {
    this.charts = [];
    this.currentGame = this.game;
    this.makeEverythingWork();
  }

  makeEverythingWork() {
    const homeTeam: string = this.teams.getTeamName(this.homeTeamAnalytics.team);
    const awayTeam: string = this.teams.getTeamName(this.awayTeamAnalytics.team);

    const battingAveragesHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    const battingAveragesAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    this.charts.push(this.createChart('Batting Average',
      `${homeTeam} - Batting Averages`,
      battingAveragesHome,
      `${awayTeam} - Batting Averages`,
      battingAveragesAway));

    const runsForGameHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.runsForGame!)!;
    const runsForGameAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.runsForGame!)!;
    this.charts.push(this.createChart('Runs For Games',
      `${homeTeam} - Runs`,
      runsForGameHome,
      `${awayTeam} - Runs`,
      runsForGameAway));

    const sluggingPercentageHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    const sluggingPercentageAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    this.charts.push(this.createChart('Slugging Percentage',
      `${homeTeam} - Slugging Percentage`,
      sluggingPercentageHome,
      `${awayTeam} - Slugging Percentage`,
      sluggingPercentageAway));


    const onBasePercentageHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    const onBasePercentageAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    this.charts.push(this.createChart('On Base Percentage',
      `${homeTeam} - On Base Percentage`,
      onBasePercentageHome,
      `${awayTeam} - On Base Percentage`,
      onBasePercentageAway));


    const onBasePlusSluggingHome: number[] = this.homeTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
    const onBasePlusSluggingAway: number[] = this.awayTeamAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
    this.charts.push(this.createChart(
      'On Base Plus Slugging',
      `${homeTeam} - On Base Plus Slugging`,
      onBasePlusSluggingHome,
      `${awayTeam} - On Base Plus Slugging`,
      onBasePlusSluggingAway));
  }

  private createChart(nameOfChart: string, homeTeamLabel: string, homeTeamData: any[], awayTeamLabel: string, awayTeamData: any[]) {
    return {
      nameOfChart,
      series: [
        {
          data: homeTeamData,
          name: homeTeamLabel
        },
        {
          data: awayTeamData,
          name: awayTeamLabel
        },
      ]
    } as ChartData
  }
}
