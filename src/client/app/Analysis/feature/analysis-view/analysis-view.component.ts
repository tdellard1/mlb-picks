import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {Analytic, Analytics, TeamAnalytics} from "../../../common/model/team-schedule.interface";
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
import {NrfiPanelComponent} from "../../ui/nrfi-panel/nrfi-panel.component";
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
  private teamMap: Map<string, Team> = new Map();

  charts: ChartData[] = [];

  constructor(private stateService: StateService,
              gameSelectorService: GameSelectorService,
              changeDetectionRef: ChangeDetectorRef) {
    super(gameSelectorService, changeDetectionRef);
  }

  ngOnInit(): void {
    this.teamMap = this.stateService.allTeams;

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
    const homeAnalytics: TeamAnalytics = this.stateService.getTeamAnalytics(home.teamAbv);
    const awayAnalytics: TeamAnalytics = this.stateService.getTeamAnalytics(away.teamAbv);
    const homeTeam: string = home.teamName;
    const awayTeam: string = away.teamName;

    Object.keys(Analytic).forEach((key: string) => {
      const homeStats: number[] = homeAnalytics.analytics!.slice().map((analytics: Analytics) => analytics[key]!)!;
      const awayStats: number[] = awayAnalytics.analytics!.slice().map((analytics: Analytics) => analytics[key]!)!;
      this.charts.push(this.createChart(Analytic.get(key)!,
        `${homeTeam} - ${Analytic.get(key)}`,
        homeStats,
        `${awayTeam} - ${Analytic.get(key)}`,
        awayStats));
    });
  }


  /** TODO: Iterate through all Keys of analytics and create chart for all */
  private createChart(nameOfChart: string, homeTeamLabel: string, homeTeamData: number[], awayTeamLabel: string, awayTeamData: number[]) {
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
