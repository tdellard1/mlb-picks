import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
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
import {NrfiPanelComponent} from "../../ui/nrfi-panel/nrfi-panel.component";
import {MLBGame} from "../../data-access/mlb-game.model";
import {GameSelectorService} from "../../data-access/services/game-selector.service";
import {StateService} from "../../../common/services/state.service";
import {BaseGameSelectorComponent} from "../../../common/components/base-game-selector/base-game-selector.component";

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
export class AnalysisViewComponent extends BaseGameSelectorComponent implements OnInit {
  private teamScheduleMap: Map<string, MLBTeamSchedule> = new Map();
  private teamMap: Map<string, Team> = new Map();

  charts: ChartData[] = [];

  constructor(private stateService: StateService,
              gameSelectorService: GameSelectorService,
              changeDetectionRef: ChangeDetectorRef) {
    super(gameSelectorService, changeDetectionRef);
  }

  ngOnInit(): void {
    this.teamMap = this.stateService.allTeams;
    this.teamScheduleMap = this.stateService.allMLBSchedules;

    this.subscriptions.push(
      this.game$.subscribe((game: Game) => {
        const home: Team = this.teamMap.get(game.home)!;
        const away: Team = this.teamMap.get(game.away)!;
        this.gameSelected(game, away, home);
      })
    )
  }

  gameSelected({gameID}: Game, away: Team, home: Team) {
    const hasBothTeams: boolean = !!away && !!home;

    if (gameID && hasBothTeams) {
      this.charts = [];
      this.makeEverythingWork(away, home);
    }
  }

  makeEverythingWork(away: Team, home: Team) {
    const homeTeamSchedule = this.stateService.getSchedule(home.teamAbv);
    const awayTeamSchedule = this.stateService.getSchedule(away.teamAbv);

    const homeTeamMLBSchedule: MLBTeamSchedule = new MLBTeamSchedule(homeTeamSchedule);
    const awayTeamMLBSchedule: MLBTeamSchedule = new MLBTeamSchedule(awayTeamSchedule);

    const homeAnalytics: TeamAnalytics = new TeamAnalytics(home.teamAbv, homeTeamMLBSchedule.analysisSchedule);
    const awayAnalytics: TeamAnalytics = new TeamAnalytics(away.teamAbv, awayTeamMLBSchedule.analysisSchedule);
    const homeTeam: string = home.teamName;
    const awayTeam: string = away.teamName;

    const battingAveragesHome: number[] = homeAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    const battingAveragesAway: number[] = awayAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.battingAverageForGame!)!;
    console.log(battingAveragesHome, battingAveragesAway);
    this.charts.push(this.createChart('Batting Average',
      `${homeTeam} - Batting Averages`,
      battingAveragesHome,
      `${awayTeam} - Batting Averages`,
      battingAveragesAway));

    const runsForGameHome: number[] = homeAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.runsForGame!)!;
    const runsForGameAway: number[] = awayAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.runsForGame!)!;
    this.charts.push(this.createChart('Runs For Games',
      `${homeTeam} - Runs`,
      runsForGameHome,
      `${awayTeam} - Runs`,
      runsForGameAway));

    const sluggingPercentageHome: number[] = homeAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    const sluggingPercentageAway: number[] = awayAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.sluggingPercentage!)!;
    this.charts.push(this.createChart('Slugging Percentage',
      `${homeTeam} - Slugging Percentage`,
      sluggingPercentageHome,
      `${awayTeam} - Slugging Percentage`,
      sluggingPercentageAway));


    const onBasePercentageHome: number[] = homeAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    const onBasePercentageAway: number[] = awayAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.onBasePercentage!)!;
    this.charts.push(this.createChart('On Base Percentage',
      `${homeTeam} - On Base Percentage`,
      onBasePercentageHome,
      `${awayTeam} - On Base Percentage`,
      onBasePercentageAway));


    const onBasePlusSluggingHome: number[] = homeAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
    const onBasePlusSluggingAway: number[] = awayAnalytics.analytics?.slice().map((analytics: Analytics) => analytics.onBasePlusSlugging!)!;
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
