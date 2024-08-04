import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
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
import {ActivatedRoute, Data, Event, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component.js";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {BehaviorSubject, Observable} from "rxjs";

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
    AsyncPipe, MatProgressSpinner
  ],
  templateUrl: './analysis-view.component.html',
  styleUrl: './analysis-view.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AnalysisViewComponent extends SubscriptionHolder implements OnInit {
  homeAnalytics: TeamAnalytics;
  home: string;

  awayAnalytics: TeamAnalytics;
  away: string;

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
      this.activatedRoute.data.subscribe(({game}: Data) => {
        this.home = game.home.team;
        this.away = game.away.team;
        this.homeAnalytics = new TeamAnalytics(this.home, game.home.schedule);
        this.awayAnalytics = new TeamAnalytics(this.away, game.away.schedule);
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
        `${this.home} - ${Analytic.get(key)}`,
        homeStats,
        `${this.away} - ${Analytic.get(key)}`,
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
