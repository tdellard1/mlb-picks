import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'client-container',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatListItem,
    MatNavList,
    MatIcon,
    MatIconButton,
    NgIf
  ],
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.css'
})
export class AppContainerComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  isMobile = true;
  isCollapsed = true;
  selectedPage: string = '';

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private observer: BreakpointObserver) {
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(): void {
    const {dailySchedule}: any = this.activatedRoute.snapshot.data;

    console.log('load things up');

    if (dailySchedule) {
      localStorage.setItem('daily-schedule', JSON.stringify(dailySchedule));
    }

    // localStorage.setItem('lastUpdated', JSON.stringify(new Date().setHours(0, 0, 0, 0)));
  }

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      this.isMobile = screenSize.matches;
    });
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      // this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed;
    }
  }

  navigate(url: string) {
    this.sidenav.toggle().then(() => {
      this.selectedPage = url;

      switch (url) {
        case RouterPages.NO_RUNS_FIRST_INNING:
          void this.router.navigate(['nrfi']);
          break;
        case RouterPages.ANALYSIS:
          void this.router.navigate(['analysis']);
          break;
        case RouterPages.SLATE:
          void this.router.navigate(['slate']);
          break;
      }
    });
  }

  protected readonly RouterPages = RouterPages;
}

export const RouterPages = {
  NO_RUNS_FIRST_INNING: 'No Runs First Inning',
  ANALYSIS: 'Game Analysis',
  SLATE: 'Expert Picks'
}

