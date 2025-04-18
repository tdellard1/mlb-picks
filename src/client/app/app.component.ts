import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {AsyncPipe, NgIf} from "@angular/common";
import {BreakpointObserver} from "@angular/cdk/layout";
import {HomeSpinnerService} from "./core/services/home-spinner.service";
import {Observable} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

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
    NgIf,
    MatProgressSpinner,
    AsyncPipe
  ],
  templateUrl: 'app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  showSpinner$: Observable<boolean>;

  isMobile: boolean = true;
  isCollapsed: boolean = true;
  selectedPage: string = '';

  constructor(private router: Router,
              spinnerService: HomeSpinnerService,
              private observer: BreakpointObserver) {
    this.showSpinner$ = spinnerService.showSpinner$;
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
        case RouterPages.PITCHERS:
          void this.router.navigate(['pitchers']);
          break;
        case RouterPages.SPLITS:
          void this.router.navigate(['splits']);
          break;
        case RouterPages.STREAKS:
          void this.router.navigate(['streaks']);
          break;
      }
    });
  }

  protected readonly RouterPages = RouterPages;
}

export const RouterPages = {
  NO_RUNS_FIRST_INNING: 'No Runs First Inning',
  ANALYSIS: 'Game Analysis',
  PITCHERS: 'Pitcher Stats',
  SPLITS: 'Splits',
  STREAKS: 'Streaks'
}

