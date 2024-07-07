import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
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
import {map} from "rxjs/operators";
import {BehaviorSubject, first, Observable} from "rxjs";
import {NrfiPanelComponent} from "../../ui/nrfi-panel/nrfi-panel.component";
import {MLBGame} from "../../data-access/mlb-game.model";

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
export class AnalysisViewComponent implements OnChanges {
  @Input() game: Game = {} as Game;
  @Input() teams: Teams = {} as Teams;

  private teamScheduleMap: Map<string, MLBTeamSchedule> = new Map();

  private homeSubject: BehaviorSubject<MLBTeamSchedule> = new BehaviorSubject<MLBTeamSchedule>({} as MLBTeamSchedule);
  private awaySubject: BehaviorSubject<MLBTeamSchedule> = new BehaviorSubject<MLBTeamSchedule>({} as MLBTeamSchedule);

  protected home$: Observable<MLBTeamSchedule> = this.homeSubject.asObservable();
  protected away$: Observable<MLBTeamSchedule> = this.awaySubject.asObservable();

  charts: ChartData[] = [];

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.pipe(first(),
      map((data: Data) => data['mlbSchedules'] as MLBTeamSchedule[]))
      .subscribe((schedules: MLBTeamSchedule[]) => {
        schedules.forEach(schedule => {
          this.teamScheduleMap.set(schedule.team, schedule);
        });
      });
  }



  ngOnChanges(changes: SimpleChanges): void {
    const game: Game = changes['game'].currentValue as Game;

    if (game) {
      this.charts = [];
      const {home, away}: Game = game;
      const homeSchedule: MLBTeamSchedule = this.teamScheduleMap.get(home)!;
      const awaySchedule: MLBTeamSchedule = this.teamScheduleMap.get(away)!;
      this.homeSubject.next(homeSchedule);
      this.awaySubject.next(awaySchedule);
      this.makeEverythingWork(new TeamAnalytics(away, awaySchedule.analysisSchedule), new TeamAnalytics(home, homeSchedule.analysisSchedule));
    }
  }

  makeEverythingWork(away: TeamAnalytics, home: TeamAnalytics) {
    const homeTeam: string = this.teams.getTeamName(home.team);
    const awayTeam: string = this.teams.getTeamName(away.team);

    const battingAveragesHome: number[] = home.analytics?.slice().reverse().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    const battingAveragesAway: number[] = away.analytics?.slice().reverse().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    this.charts.push(this.createChart('Batting Average',
      `${homeTeam} - Batting Averages`,
      battingAveragesHome,
      `${awayTeam} - Batting Averages`,
      battingAveragesAway));

    const runsForGameHome: number[] = home.analytics?.slice().reverse().map((analytics: Analytics) => analytics.runsForGame!)!;
    const runsForGameAway: number[] = away.analytics?.slice().reverse().map((analytics: Analytics) => analytics.runsForGame!)!;
    this.charts.push(this.createChart('Runs For Games',
      `${homeTeam} - Runs`,
      runsForGameHome,
      `${awayTeam} - Runs`,
      runsForGameAway));

    const sluggingPercentageHome: number[] = home.analytics?.slice().reverse().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    const sluggingPercentageAway: number[] = away.analytics?.slice().reverse().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    this.charts.push(this.createChart('Slugging Percentage',
      `${homeTeam} - Slugging Percentage`,
      sluggingPercentageHome,
      `${awayTeam} - Slugging Percentage`,
      sluggingPercentageAway));


    const onBasePercentageHome: number[] = home.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    const onBasePercentageAway: number[] = away.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    this.charts.push(this.createChart('On Base Percentage',
      `${homeTeam} - On Base Percentage`,
      onBasePercentageHome,
      `${awayTeam} - On Base Percentage`,
      onBasePercentageAway));


    const onBasePlusSluggingHome: number[] = home.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
    const onBasePlusSluggingAway: number[] = away.analytics?.slice().reverse().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
    this.charts.push(this.createChart(
      'On Base Plus Slugging',
      `${homeTeam} - On Base Plus Slugging`,
      onBasePlusSluggingHome,
      `${awayTeam} - On Base Plus Slugging`,
      onBasePlusSluggingAway));


    const hittingStrikeOutHome: number[] = this.teamScheduleMap.get(home.team)?.analysisSchedule.map((game: MLBGame) => game.saberMetrics.hittingStrikeouts!)!;
    const hittingStrikeOutAway: number[] = this.teamScheduleMap.get(away.team)?.analysisSchedule.map((game: MLBGame) => game.saberMetrics.hittingStrikeouts!)!;
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
