import {Component, HostListener, ViewChild} from '@angular/core';
import {ActivatedRoute, Data, Router, RouterOutlet} from '@angular/router';
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-root',
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
  templateUrl: 'app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  isMobile: boolean = true;
  isCollapsed: boolean = true;
  selectedPage: string = '';

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private observer: BreakpointObserver) {
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(): void {
    const {dailySchedule}: Data = this.activatedRoute.snapshot.data;

    console.log('load things up');

    if (dailySchedule) {
      localStorage.setItem('daily-schedule', JSON.stringify(dailySchedule));
    }
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
        case RouterPages.PITCHERS:
          void this.router.navigate(['pitchers']);
          break;
      }
    });
  }

  protected readonly RouterPages = RouterPages;
}

export const RouterPages = {
  NO_RUNS_FIRST_INNING: 'No Runs First Inning',
  ANALYSIS: 'Game Analysis',
  SLATE: 'Expert Picks',
  PITCHERS: 'Pitcher Stats'
}

