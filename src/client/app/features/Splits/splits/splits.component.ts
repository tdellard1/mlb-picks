import {Component} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {SubscriptionHolder} from "../../../shared/components/subscription-holder.component.js";
import {ActivatedRoute, Data, Params} from "@angular/router";
import {Team} from "../../../common/model/team.interface.js";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Game, Site, Teams} from "../../../common/model/game.interface.js";
import {BoxScore} from "../../../common/model/box-score.interface.js";
import {WeightedFactors} from "../../../common/weighted-factors.constants.js";

export enum StatsSource {
  Both = 'both',
  Split = 'split',
}

export class OffensiveStats {
  AtBats: number;
  PlateAppearance: number;
  Hits: number;
  Singles: number;
  Doubles: number;
  Triples: number;
  HomeRuns: number;
  IntentionalWalks: number;
  Walks: number;
  HitByPitch: number;
  SacrificeFly: number;

  constructor() {
    this.AtBats = 0;
    this.PlateAppearance = 0;
    this.Hits = 0;
    this.Singles = 0;
    this.Doubles = 0;
    this.Triples = 0;
    this.HomeRuns = 0;
    this.IntentionalWalks = 0;
    this.Walks = 0;
    this.HitByPitch = 0;
    this.SacrificeFly = 0;
  }

  add(offensiveStats: OffensiveStats) {
    this.AtBats += offensiveStats.AtBats;
    this.PlateAppearance += offensiveStats.PlateAppearance;
    this.Hits += offensiveStats.Hits;
    this.Singles += offensiveStats.Singles;
    this.Doubles += offensiveStats.Doubles;
    this.Triples += offensiveStats.Triples;
    this.HomeRuns += offensiveStats.HomeRuns;
    this.IntentionalWalks += offensiveStats.IntentionalWalks;
    this.Walks += offensiveStats.Walks;
    this.HitByPitch += offensiveStats.HitByPitch;
    this.SacrificeFly += offensiveStats.SacrificeFly;
  }

  get BattingAverage(): string {
    const AVG: number = this.Hits / this.AtBats;
    return AVG.toFixed(3);
  }

  // OBP = (H + BB + HBP) / (AB + BB + HBP + SF)
  get OnBasePercentage() {
    const OBP: number = (this.Hits + this.Walks + this.HitByPitch) / (this.AtBats + this.Walks + this.HitByPitch + this.SacrificeFly);
    return OBP.toFixed(3);
  }

  // (1B + 2Bx2 + 3Bx3 + HRx4)/AB
  get Slugging() {
    const SLG: number = (this.Singles + (this.Doubles * 2) + (this.Triples * 3) + (this.HomeRuns * 4)) / this.AtBats;
    return SLG.toFixed(3);
  }

  get OnBasePlusSlugging() {
    const OBP: number = (this.Hits + this.Walks + this.HitByPitch) / (this.AtBats + this.Walks + this.HitByPitch + this.SacrificeFly);
    const SLG: number = (this.Singles + (this.Doubles * 2) + (this.Triples * 3) + (this.HomeRuns * 4)) / this.AtBats;
    const OPS: number = OBP + SLG;
    return OPS.toFixed(3);
  }

// wOBA = (0.690×uBB + 0.722×HBP + 0.888×1B + 1.271×2B + 1.616×3B +2.101×HR) / (AB + BB – IBB + SF + HBP)
  get weightedOnBaseAverage() {
    const weightedWalks: number = this.Walks * WeightedFactors.wBB;
    const weightedHitByPitch: number = this.HitByPitch * WeightedFactors.wHBP;
    const weightedSingles: number = this.Singles * WeightedFactors.w1B;
    const weightedDoubles: number = this.Doubles * WeightedFactors.w2B;
    const weightedTriples: number = this.Triples * WeightedFactors.w3B;
    const weightedHomeRuns: number = this.HomeRuns * WeightedFactors.wHR;


    const wOBA: number = (weightedWalks + weightedHitByPitch + weightedSingles + weightedDoubles + weightedTriples + weightedHomeRuns) /
      (this.AtBats + this.Walks - this.IntentionalWalks + this.SacrificeFly + this.HitByPitch);

    return wOBA.toFixed(3);
  }

  // wRC = (((wOBA – League wOBA/wOBA Scale) + (League R/PA)) * PA
  // get weightedRunsCreated() {
  //   const firstPart = this.weightedOnBaseAverage - (WeightedFactors.wOBA/WeightedFactors.wOBAScale);
  //   const secondPart = firstPart + WeightedFactors.RoPA;
  //
  //
  //   return secondPart * this.PlateAppearance;
  // }
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
    NgIf
  ],
  templateUrl: './splits.component.html',
  styleUrl: './splits.component.css'
})
export class SplitsComponent extends SubscriptionHolder {
  private readonly teams: Team[] = this.activatedRoute.snapshot.data['teams'] as Team[];
  private readonly dailySchedule: Game[] = this.activatedRoute.snapshot.data['dailySchedule'] as Game[];

  home: Team;
  homeBoxScores: BoxScore[];

  away: Team;
  awayBoxScores: BoxScore[];

  private selectedGameId: string = '';
  private selectedGame: Game = {} as Game;

  statsSource: StatsSource = StatsSource.Split;

  homeOffensiveStats: OffensiveStats = new OffensiveStats();
  awayOffensiveStats: OffensiveStats = new OffensiveStats();

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params: Params) => this.selectedGameId = params['gameId'])
    )

    this.activatedRoute.data.subscribe(({splits}: Data) => {
      const {home, away}: Teams<BoxScore[]> = splits as Teams<BoxScore[]>;
      this.selectedGame = this.dailySchedule.find(({gameID}) => gameID === this.selectedGameId)!;

      this.home = this.teams.find(({teamAbv}) => teamAbv === this.selectedGame.home)!;
      this.homeBoxScores = home;

      this.away = this.teams.find(({teamAbv}) => teamAbv === this.selectedGame.away)!;
      this.awayBoxScores = away;

      this.selectSplits();
    });
  }

  selectSplits() {
    this.homeOffensiveStats = new OffensiveStats();
    this.awayOffensiveStats = new OffensiveStats();

    this.homeBoxScores.forEach(BoxScore.addOffensiveStats(this.homeOffensiveStats, this.home.teamAbv, this.statsSource, Site.Home));
    this.awayBoxScores.forEach(BoxScore.addOffensiveStats(this.awayOffensiveStats, this.away.teamAbv, this.statsSource, Site.Away));


    console.log(this.home.teamAbv, ' homeOffensiveStats: ', this.homeOffensiveStats);
  }

  protected readonly StatsSource = StatsSource;
}
