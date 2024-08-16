import {Component} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {SubscriptionHolder} from "../../../shared/components/subscription-holder.component.js";
import {ActivatedRoute, Data, Event, NavigationEnd, NavigationStart, Params, Router, RouterLink} from "@angular/router";
import {Team} from "../../../common/interfaces/team.interface.js";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {TeamStatsHitting} from "../../../common/model/team-stats.model.js";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {OffensiveStats} from "../../../common/model/offensive-stats.modal.js";
import {Sites} from "../../../common/interfaces/sites";
import {Hitting} from "../../../common/interfaces/hitting";

export enum StatsSource {
  Season = 'season',
  Split = 'split',
  Teams = 'teams',
}

@Component({
  selector: 'splits',
  standalone: true,
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    MatRadioButton,
    MatRadioGroup,
    NgSelectModule,
    FormsModule,
    NgIf,
    MatTab,
    MatTabGroup,
    RouterLink,
    MatProgressSpinner,
    AsyncPipe
  ],
  templateUrl: './splits.component.html',
  styleUrl: './splits.component.css'
})
export class SplitsComponent extends SubscriptionHolder {
  private readonly teams: Map<string, Team> = new Map((this.activatedRoute.snapshot.data['teams'] as Team[]).map((team: Team) => [team.teamAbv, team]));

  statsSource: StatsSource = StatsSource.Split;

  home: Team;
  away: Team;

  homeBoxScores: Hitting[];
  awayBoxScores: Hitting[];

  private selectedGameId: string = '';

  _spinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get spinner$(): Observable<boolean> {
    return this._spinner.asObservable();
  }

  homeOffensiveStats: OffensiveStats = new OffensiveStats();
  awayOffensiveStats: OffensiveStats = new OffensiveStats();

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
    super();

    const selectedGameIDSubscription: Subscription = this.activatedRoute.params.subscribe((params: Params) => this.selectedGameId = params['gameId']);
    const setUpSplitsSubscription: Subscription = this.setUpSplitsSubscription(this.activatedRoute.data);
    const updateSpinnerSubscription: Subscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this._spinner.next(true);
      }

      if (event instanceof NavigationEnd) {
        this._spinner.next(false);
      }
    });

    this.subscriptions.push(
      updateSpinnerSubscription,
      selectedGameIDSubscription,
      setUpSplitsSubscription
    )
  }

  setUpSplitsSubscription(data: Observable<Data>): Subscription {
    return data.subscribe(({splits}: Data) => {
      const [awayName, homeName]: string[] = this.selectedGameId.split('_')[1].split('@');

      const source: StatsSource = this.activatedRoute.snapshot.queryParams['source'] as StatsSource;

      this.statsSource = !!source ? source : StatsSource.Season;

      this.home = this.teams.get(homeName)!;
      this.away = this.teams.get(awayName)!;

      const {home, away}: Sites<{name: string, stats: Hitting[]}> = splits as Sites<{name: string, stats: Hitting[]}>;

      this.homeBoxScores = home.stats;
      this.awayBoxScores = away.stats;

      this.selectSplits();
    });
  }

  selectSplits() {
    this.homeOffensiveStats = new OffensiveStats();
    this.awayOffensiveStats = new OffensiveStats();

    this.homeBoxScores.forEach((hitting: Hitting) => {
      const teamStatsHitting: TeamStatsHitting = new TeamStatsHitting(hitting);
      this.homeOffensiveStats.addTeamStatsHitting(teamStatsHitting);
    });

    this.awayBoxScores.forEach((hitting: Hitting) => {
      const teamStatsHitting: TeamStatsHitting = new TeamStatsHitting(hitting);
      this.awayOffensiveStats.addTeamStatsHitting(teamStatsHitting);
    });

    if (this.statsSource === StatsSource.Season) {
      this.awayOffensiveStats.finalize(117);
      this.homeOffensiveStats.finalize(117);
    } else {
      this.awayOffensiveStats.finalize(this.awayBoxScores.length);
      this.homeOffensiveStats.finalize(this.awayBoxScores.length);
    }
  }

  protected readonly StatsSource = StatsSource;

  navigate(source: StatsSource) {
    this.router.navigate(['.'], {relativeTo: this.activatedRoute, queryParams: {source}, onSameUrlNavigation: "reload"});
  }
}
