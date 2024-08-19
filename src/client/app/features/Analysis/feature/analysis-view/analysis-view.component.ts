import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Analytic, Analytics, Schedule, TeamAnalytics} from "../../../../common/interfaces/team-schedule.interface";
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
import {ActivatedRoute, Event, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {BehaviorSubject, Observable} from "rxjs";
import {Team} from "../../../../common/interfaces/team.interface.js";
import {GameSelectedComponent} from "../../ui/game-selected/game-selected.component.js";
import {GameDetailsComponent} from "../../ui/game-details/game-details.component.js";
import {MatDivider} from "@angular/material/divider";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatSlider, MatSliderRangeThumb, MatSliderThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {BoxScore} from "../../../../common/model/box.score.model";
import {GameUtils} from "../../../../common/utils/game.utils";
import {OffensiveStats} from "../../../../common/model/offensive-stats.modal";
import {TeamStatsHitting} from "../../../../common/model/team-stats.model";
import {StatsSupplierComponent} from "../../../../shared/components/stats-supplier.component";

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
    AsyncPipe, MatProgressSpinner, GameSelectedComponent, GameDetailsComponent, MatDivider, MatRadioButton, MatRadioGroup, MatSlideToggle, MatSliderThumb, MatSlider, MatSliderRangeThumb, FormsModule
  ],
  templateUrl: './analysis-view.component.html',
  styleUrl: './analysis-view.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AnalysisViewComponent extends StatsSupplierComponent implements OnInit {
  upperSliderValue: number = 16;
  lowerSliderValue: number = 1;

  home: Team;
  homeSchedule: Schedule;

  away: Team;
  awaySchedule: Schedule;

  collectionType: CollectionType = CollectionType.AVERAGE;
  statType: StatType = StatType.AVG;

  chartData: ChartData = {} as ChartData;

  _spinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get spinner$(): Observable<boolean> {
    return this._spinner.asObservable();
  }

  constructor(private route: ActivatedRoute, private router: Router) {
    super(route);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(({gameId}) => {
        const [away, home]: string[] = gameId.split('_')[1].split('@');

        this.away = this.getTeam(away);
        this.awaySchedule = this.getSchedule(away);
        this.home = this.getTeam(home);
        this.homeSchedule = this.getSchedule(home);

        this.populateChart();
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

  populateChart() {
    this.chartData = {} as ChartData;
    const nameOfChart: string = STATS_TYPE_MAP.get(this.statType)[this.collectionType];
    const homeTeam: string = this.home.teamName;
    const awayTeam: string = this.away.teamName;
    const homeTeamData: number[] = this.getTeamData(this.home.teamAbv, this.homeSchedule, this.statType, this.collectionType, this.boxScoresMap);
    const awayTeamData: number[] = this.getTeamData(this.away.teamAbv, this.awaySchedule, this.statType, this.collectionType, this.boxScoresMap);
    this.chartData = this.createChart(nameOfChart, homeTeam, homeTeamData, awayTeam, awayTeamData);
  }

  private getTeamData(team: string, {schedule}: Schedule, statType: StatType, collectionType: CollectionType, boxScoresMap: Map<string, BoxScore>): number[] {
    const games = schedule
      .filter(GameUtils.gameCompleted)
      .sort(GameUtils.sortGames)
      .reverse()
      .slice(this.lowerSliderValue - 1, this.upperSliderValue - 1)
      .reverse();

    const stats: number[] = [];

    if (collectionType === CollectionType.AVERAGE) {
      const perGameStats: number[] = [];
      games.map(({gameID}) => boxScoresMap.get(gameID)!).forEach(({teamStats, away, home}) => {
        if (away === team) {
          const teamHittingStats: TeamStatsHitting = new TeamStatsHitting(teamStats.away.Hitting);
          const offensiveStats: OffensiveStats = new OffensiveStats();
          offensiveStats.addTeamStatsHitting(teamHittingStats);
          offensiveStats.finalize(1);
          perGameStats.push(Number(offensiveStats[statType]));
        } else if (home === team) {
          const teamHittingStats: TeamStatsHitting = new TeamStatsHitting(teamStats.home.Hitting);
          const offensiveStats: OffensiveStats = new OffensiveStats();
          offensiveStats.addTeamStatsHitting(teamHittingStats);
          offensiveStats.finalize(1);
          perGameStats.push(Number(offensiveStats[statType]));
        } else {
          throw new Error('No team found in Box Score');
        }
      });

      for (let i = 1; i < perGameStats.length + 1; i++) {
        const total = perGameStats.slice(0, i).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

        stats.push(Number((total / i).toFixed(3)));
      }
    } else {
      games.map(({gameID}) => boxScoresMap.get(gameID)!).forEach(({teamStats, away, home}) => {
        if (away === team) {
          const teamHittingStats: TeamStatsHitting = new TeamStatsHitting(teamStats.away.Hitting);
          const offensiveStats: OffensiveStats = new OffensiveStats();
          offensiveStats.addTeamStatsHitting(teamHittingStats);
          offensiveStats.finalize(1);
          stats.push(Number(offensiveStats[statType]));
        } else if (home === team) {
          const teamHittingStats: TeamStatsHitting = new TeamStatsHitting(teamStats.home.Hitting);
          const offensiveStats: OffensiveStats = new OffensiveStats();
          offensiveStats.addTeamStatsHitting(teamHittingStats);
          offensiveStats.finalize(1);
          stats.push(Number(offensiveStats[statType]));
        } else {
          throw new Error('No team found in Box Score');
        }
      });
    }

    return stats;
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

  changeCollectionType({checked}: any) {
    if (checked) {
      this.collectionType = CollectionType.PER_GAME
    } else if (!checked) {
      this.collectionType = CollectionType.AVERAGE
    }

    this.populateChart();
  }

  protected readonly StatType = StatType;

  changeStatType() {
    this.populateChart();
  }
}

export enum CollectionType {
  PER_GAME = 'Per Game',
  AVERAGE = 'Average'
}

export enum StatType {
  AVG = 'AVG',
  RUNS = 'RUNS',
  SLG = 'SLG',
  OBP = 'OBP',
  OPS = 'OPS',
  wOBA = 'wOBA'
}

export const STATS_TYPE_MAP = new Map()
  .set(StatType.AVG, {
    ['Per Game']: 'Batting Average Per Game',
    Average: 'Batting Average Mean',
  })
  .set(StatType.RUNS, {
    ['Per Game']: 'Runs Per Game',
    Average: 'Runs Per Game Mean',
  })
  .set(StatType.SLG, {
    ['Per Game']: 'Slugging Percentage Per Game',
    Average: 'Slugging Percentage Mean',
  })
  .set(StatType.OBP, {
    ['Per Game']: 'On Base Percentage Per Game',
    Average: 'On Base Percentage Mean',
  })
  .set(StatType.OPS, {
    ['Per Game']: 'On-base Plus Slugging Per Game',
    Average: 'On-base Plus Slugging Mean',
  })
  .set(StatType.wOBA, {
    ['Per Game']: 'weighted On Base Average Per Game',
    Average: 'weighted On Base Average Mean',
  });
