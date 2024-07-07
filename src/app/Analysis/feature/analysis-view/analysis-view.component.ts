import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Game} from "../../../common/model/game.interface";
import {Team, Teams} from "../../../common/model/team.interface";
import {Analytics, TeamAnalytics} from "../../../common/model/team-schedule.interface";
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

import {
  NgApexchartsModule
} from "ng-apexcharts";
import {LineChartComponent} from "../../ui/line-chart/line-chart.component";
import {ChartData} from "../../data-access/chart-options";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MLBTeamSchedule} from "../../data-access/mlb-team-schedule.model";
import {ActivatedRoute, Data} from "@angular/router";
import {map, tap} from "rxjs/operators";
import {filter, first, Observable} from "rxjs";
import {NrfiPanelComponent} from "../../ui/nrfi-panel/nrfi-panel.component";
import {MLBGame} from "../../data-access/mlb-game.model";
import {GameSelectorService, GameSelectorState} from "../../data-access/services/game-selector.service";

@Component({
  selector: 'analysis-component-view',
  standalone: true,
  imports: [
    MatGridList, MatGridTile,
    MatIcon, MatFabButton, MatCard,
    MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle,
    NgApexchartsModule,
    NgOptimizedImage,
    NgForOf,
    NgIf,
    LineChartComponent,
    NrfiPanelComponent,
    AsyncPipe
  ],
  templateUrl: './analysis-view.component.html',
  styleUrl: './analysis-view.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AnalysisViewComponent {
  gameSelected$: Observable<GameSelectorState> = this.gameSelectorService.selectedGameInfo.pipe(
    tap(({game, home, away}: GameSelectorState) => {
      this.gameSelected(game, away, home);
    })
  );

  private teamScheduleMap: Map<string, MLBTeamSchedule> = new Map();

  protected home$: Observable<MLBTeamSchedule> = this.gameSelectorService.home.pipe(
    filter(({teamAbv}: Team) => !!teamAbv),
    map(({teamAbv}: Team) => this.teamScheduleMap.get(teamAbv)!));

  protected away$: Observable<MLBTeamSchedule> = this.gameSelectorService.away.pipe(
    filter(({teamAbv}: Team) => !!teamAbv),
    map(({teamAbv}: Team) => this.teamScheduleMap.get(teamAbv)!));

  charts: ChartData[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private gameSelectorService: GameSelectorService) {
    this.activatedRoute.data.pipe(first(),
      map((data: Data) => data['mlbSchedules'] as MLBTeamSchedule[]))
      .subscribe((schedules: MLBTeamSchedule[]) => {
        schedules.forEach(schedule => {
          this.teamScheduleMap.set(schedule.team, schedule);
        });
      });
  }

  gameSelected(game: Game, away: Team, home: Team) {
    if (game.gameID) {
      this.charts = [];
      this.makeEverythingWork(away, home);
    }
  }

  makeEverythingWork(away: Team, home: Team) {
    const homeAnalytics: TeamAnalytics = new TeamAnalytics(away.teamAbv, this.teamScheduleMap.get(away.teamAbv)!?.analysisSchedule);
    const awayAnalytics: TeamAnalytics = new TeamAnalytics(home.teamAbv, this.teamScheduleMap.get(home.teamAbv)!?.analysisSchedule);
    const homeTeam: string = home.teamName;
    const awayTeam: string = away.teamName;

    const battingAveragesHome: number[] = homeAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    const battingAveragesAway: number[] = awayAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    this.charts.push(this.createChart('Batting Average',
      `${homeTeam} - Batting Averages`,
      battingAveragesHome,
      `${awayTeam} - Batting Averages`,
      battingAveragesAway));

    const runsForGameHome: number[] = homeAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.runsForGame!)!;
    const runsForGameAway: number[] = awayAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.runsForGame!)!;
    this.charts.push(this.createChart('Runs For Games',
      `${homeTeam} - Runs`,
      runsForGameHome,
      `${awayTeam} - Runs`,
      runsForGameAway));

    const sluggingPercentageHome: number[] = homeAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    const sluggingPercentageAway: number[] = awayAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    this.charts.push(this.createChart('Slugging Percentage',
      `${homeTeam} - Slugging Percentage`,
      sluggingPercentageHome,
      `${awayTeam} - Slugging Percentage`,
      sluggingPercentageAway));


    const onBasePercentageHome: number[] = homeAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    const onBasePercentageAway: number[] = awayAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    this.charts.push(this.createChart('On Base Percentage',
      `${homeTeam} - On Base Percentage`,
      onBasePercentageHome,
      `${awayTeam} - On Base Percentage`,
      onBasePercentageAway));


    const onBasePlusSluggingHome: number[] = homeAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
    const onBasePlusSluggingAway: number[] = awayAnalytics.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
    this.charts.push(this.createChart(
      'On Base Plus Slugging',
      `${homeTeam} - On Base Plus Slugging`,
      onBasePlusSluggingHome,
      `${awayTeam} - On Base Plus Slugging`,
      onBasePlusSluggingAway));


    const hittingStrikeOutHome: number[] = this.teamScheduleMap.get(homeAnalytics.team)?.analysisSchedule.map((game: MLBGame) => game.saberMetrics.hittingStrikeouts!)!;
    const hittingStrikeOutAway: number[] = this.teamScheduleMap.get(awayAnalytics.team)?.analysisSchedule.map((game: MLBGame) => game.saberMetrics.hittingStrikeouts!)!;
    this.charts.push(this.createChart(
      'Hitting Strikeouts',
      `${homeTeam} - Hitting Strikeouts`,
      hittingStrikeOutHome,
      `${awayTeam} - Hitting Strikeouts`,
      hittingStrikeOutAway));
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
