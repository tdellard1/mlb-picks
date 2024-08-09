import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Analytic, Analytics, TeamAnalytics} from "../../../../common/model/team-schedule.interface";
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
import {ActivatedRoute, Data, Event, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {SubscriptionHolder} from "../../../../shared/components/subscription-holder.component.js";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {BehaviorSubject, Observable} from "rxjs";
import {Team} from "../../../../common/model/team.interface.js";
import {GameSelectedComponent} from "../../ui/game-selected/game-selected.component.js";
import {GameDetailsComponent} from "../../ui/game-details/game-details.component.js";
import {MatDivider} from "@angular/material/divider";

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
    AsyncPipe, MatProgressSpinner, GameSelectedComponent, GameDetailsComponent, MatDivider
  ],
  templateUrl: './analysis-view.component.html',
  styleUrl: './analysis-view.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AnalysisViewComponent extends SubscriptionHolder implements OnInit {
  homeAnalytics: TeamAnalytics;
  home: Team;

  awayAnalytics: TeamAnalytics;
  away: Team;

  charts: ChartData[] = [];
  _spinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get spinner$(): Observable<boolean> {
    return this._spinner.asObservable();
  }

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.data.subscribe(({matchUp}: Data) => {
        const {home, away}: any = matchUp;
        this.home = home.team;
        this.away = away.team;
        console.log(home.schedule);
        this.homeAnalytics = new TeamAnalytics(this.home.teamAbv, home.schedule);
        this.awayAnalytics = new TeamAnalytics(this.away.teamAbv, away.schedule);
        this.charts = [];
        this.populateCharts();
      }),
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          this._spinner.next(true);
        }

        if (event instanceof NavigationEnd) {
          this._spinner.next(false);
        }
      })
    )
  }

  populateCharts() {
    [...Analytic.keys()].forEach((key: string) => {
      const homeStats: number[] = this.homeAnalytics.analytics!.slice().map((analytics: Analytics) => analytics[key]!)!;
      const awayStats: number[] = this.awayAnalytics.analytics!.slice().map((analytics: Analytics) => analytics[key]!)!;
      this.charts.push(this.createChart(Analytic.get(key)!,
        `${this.home.teamAbv} - ${Analytic.get(key)}`,
        homeStats,
        `${this.away.teamAbv} - ${Analytic.get(key)}`,
        awayStats));
    });
  }

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
