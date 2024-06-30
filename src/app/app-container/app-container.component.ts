import {Component, HostListener} from '@angular/core';
import {Team, Teams} from "../common/model/team.interface";
import {TeamSchedule} from "../common/model/team-schedule.interface";
import {ActivatedRoute, Data, RouterLink, RouterOutlet} from "@angular/router";
import {MatTab, MatTabContent, MatTabGroup} from "@angular/material/tabs";
import {AnalysisComponent} from "../analysis/analysis.component";
import {PicksComponent} from "./components/picks/picks.component";
import {Observable} from "rxjs";
import {Game} from "../common/model/game.interface";
import {map, tap} from "rxjs/operators";
import {AsyncPipe} from "@angular/common";
import {Player} from "../common/model/players.interface";
import {ChartsComponent} from "./components/charts/charts.component";
import {Picks, Slate} from "../common/resolvers/picks.resolver";

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    RouterLink,
    AnalysisComponent,
    RouterOutlet,
    MatTabGroup,
    MatTab,
    PicksComponent,
    AsyncPipe,
    MatTabContent,
    ChartsComponent
  ],
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.css'
})
export class AppContainerComponent {
  dailySchedule$: Observable<Game[]>;
  players$: Observable<Player[]>;
  teams$: Observable<Teams>;
  schedules$: Observable<TeamSchedule[]>;
  boxScores$: Observable<TeamSchedule[]>;
  picks$: Observable<Picks>;

  constructor(private activatedRoute: ActivatedRoute) {
    this.teams$ = this.activatedRoute.data.pipe(map((data: Data) => data['teams']));
    this.dailySchedule$ = this.activatedRoute.data.pipe(map((data: Data) => data['dailySchedule']));
    this.players$ = this.activatedRoute.data.pipe(map((data: Data) => data['players']));
    this.schedules$ = this.activatedRoute.data.pipe(map((data: Data) => data['schedules']));
    this.boxScores$ = this.activatedRoute.data.pipe(map((data: Data) => data['boxScores']));
    this.picks$ = this.activatedRoute.data.pipe(map((data: Data) => data['picks']));
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(): void {
    const { dailySchedule }: any = this.activatedRoute.snapshot.data;

    if (dailySchedule) {
      localStorage.setItem('daily-schedule', JSON.stringify(dailySchedule));
    }

    localStorage.setItem('lastUpdated', JSON.stringify(new Date().setHours(0, 0, 0, 0)));
  }

  convertToSlate(picks: Picks): Slate {
    return new Slate(picks);
  }
}
