import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Teams} from "../common/model/team.interface";
import {ActivatedRoute, Data, RouterLink, RouterOutlet} from "@angular/router";
import {MatTab, MatTabContent, MatTabGroup} from "@angular/material/tabs";
import {AnalysisContainerComponent} from "../Analysis/feature/analysis-container/analysis-container.component";
import {Observable} from "rxjs";
import {Game} from "../common/model/game.interface";
import {map} from "rxjs/operators";
import {AsyncPipe, NgIf, NgStyle, NgSwitch, NgSwitchCase} from "@angular/common";
import {SlateContainerComponent} from "../Slate/feature/slate-container/slate-container.component";
import {Slates} from "../Slate/data-access/slate.model";
import {MLBTeamSchedule} from "../Analysis/data-access/mlb-team-schedule.model";
import {PropsComponent} from "../Props/feature/props/props.component";
import {MatchUpsComponent} from "../Props/feature/match-ups/match-ups.component";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatListItem, MatListModule, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    RouterLink,
    AnalysisContainerComponent,
    RouterOutlet,
    MatTabGroup,
    MatTab,
    AsyncPipe,
    MatTabContent,
    SlateContainerComponent,
    NgStyle,
    PropsComponent,
    MatchUpsComponent,
    MatIcon,
    MatIconButton,
    MatToolbar,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    NgIf,
    NgSwitch,
    NgSwitchCase
  ],
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.css'
})
export class AppContainerComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  teams$: Observable<Teams>;
  dailySchedule$: Observable<Game[]>;
  mlbSchedules$: Observable<MLBTeamSchedule[]>;
  slates$: Observable<Slates>;

  isMobile= true;
  isCollapsed = true;
  selectedPage: Pages = Pages.NRFI;
  Pages = Pages;

  constructor(private activatedRoute: ActivatedRoute, private observer: BreakpointObserver) {
    this.teams$ = this.activatedRoute.data.pipe(map((data: Data) => data['teams']));
    this.dailySchedule$ = this.activatedRoute.data.pipe(map((data: Data) => data['dailySchedule']));
    this.mlbSchedules$ = this.activatedRoute.data.pipe(map((data: Data) => data['mlbSchedules']));
    this.slates$ = this.activatedRoute.data.pipe(map((data: Data) => data['slates']));
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(): void {
    const { dailySchedule }: any = this.activatedRoute.snapshot.data;

    if (dailySchedule) {
      localStorage.setItem('daily-schedule', JSON.stringify(dailySchedule));
    }

    localStorage.setItem('lastUpdated', JSON.stringify(new Date().setHours(0, 0, 0, 0)));
  }

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      this.isMobile = screenSize.matches;
    });
  }

  toggleMenu() {
    if(this.isMobile){
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed;
    }
  }

  switchPage(page: Pages) {
    this.selectedPage = page;
    this.sidenav.toggle();
  }
}

export enum Pages {
  NRFI,
  PROPS,
  SLATE
}
