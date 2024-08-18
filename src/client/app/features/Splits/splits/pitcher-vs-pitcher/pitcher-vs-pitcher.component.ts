import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {Game} from "../../../../common/interfaces/game";
import {PitcherStats} from "../../../../common/model/pitcher-stats.model";
import {PlayerStats} from "../../../../common/interfaces/player-stats";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {StatsSource} from "../splits.component";
import {FormsModule} from "@angular/forms";
import {BoxScore} from "../../../../common/model/box.score.model";
import {ActivatedRoute} from "@angular/router";
import {BoxScoreUtils} from "../../../../common/utils/boxscore.utils";
import {RosterPlayer} from "../../../../common/interfaces/players";
import {Site} from "../../../../common/constants/site";

@Component({
  selector: 'pitcher-vs-pitcher',
  standalone: true,
  imports: [
    NgIf,
    MatButtonToggle,
    MatButtonToggleGroup,
    FormsModule
  ],
  templateUrl: './pitcher-vs-pitcher.component.html',
  styleUrl: './pitcher-vs-pitcher.component.css'
})
export class PitcherVsPitcherComponent implements OnChanges, OnInit {
  protected readonly players: Map<string, RosterPlayer> = new Map((this.activatedRoute.snapshot.data['players'] as RosterPlayer[]).map((rosterPlayer: RosterPlayer) => [rosterPlayer.playerID, rosterPlayer]));
  private readonly boxScores: Map<string, BoxScore> = new Map((this.activatedRoute.snapshot.data['boxScores'] as BoxScore[]).map((boxScore: BoxScore) => [boxScore.gameID, boxScore]));

  homePitcherStats: PitcherStats = new PitcherStats();
  awayPitcherStats: PitcherStats = new PitcherStats();
  @Input() game!: Game;

  statsSource: StatsSource = StatsSource.Season;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.awayPitcherStats = this.getPitcherStats(this.game.probableStartingPitchers.away, Site.AWAY);
    this.homePitcherStats = this.getPitcherStats(this.game.probableStartingPitchers.home, Site.HOME);
  }

  getPitcherStats(pitcherID: string, site: Site): PitcherStats {
    let pitcherStats: PitcherStats;

    const boxScores: BoxScore[] = [];
    this.boxScores.forEach((boxScore: BoxScore) => {
      const hasPlayer: boolean = boxScore.playerStats.some(({playerID}) => playerID === pitcherID);
      if (hasPlayer) {
        boxScores.push(boxScore);
      }
    });

    const sortedBoxScores: BoxScore[] = boxScores.sort(BoxScoreUtils.sortChronologically).reverse();

    switch (this.statsSource) {
      case StatsSource.Season:
        pitcherStats = this.aggregateStats(sortedBoxScores, pitcherID);
        break;
      case StatsSource.Split:
        const siteBoxScores: BoxScore[] = sortedBoxScores.filter((boxScore: BoxScore) => boxScore[site] === this.game[site]);
        pitcherStats = this.aggregateStats(siteBoxScores, pitcherID);
        break;
      case StatsSource.Teams:
        const sameTeamsBoxScores: BoxScore[] = sortedBoxScores.filter((boxScore: BoxScore) =>
          [boxScore.away, boxScore.home].some((teamAbv: string) => teamAbv === this.game.away) &&
          [boxScore.away, boxScore.home].some((teamAbv: string) => teamAbv === this.game.home));

        pitcherStats = this.aggregateStats(sameTeamsBoxScores, pitcherID);
        break;
    }

    return pitcherStats;
  }

  private aggregateStats(boxScores: BoxScore[], pitcherID: string) {
    const pitcherStats: PitcherStats = new PitcherStats();
    const gamesPlayed: PlayerStats[] = boxScores.map(({playerStats}) => playerStats.find(({playerID}) => playerID === pitcherID)!);

    gamesPlayed.forEach(({Pitching}) => pitcherStats.add(Pitching));
    pitcherStats.finalize(gamesPlayed.length);

    return pitcherStats;
  }

  ngOnChanges(): void {
    this.selectSplits();
  }

  protected readonly StatsSource = StatsSource;

  selectSplits() {
    this.awayPitcherStats = this.getPitcherStats(this.game.probableStartingPitchers.away, Site.AWAY);
    this.homePitcherStats = this.getPitcherStats(this.game.probableStartingPitchers.home, Site.HOME);
  }
}
