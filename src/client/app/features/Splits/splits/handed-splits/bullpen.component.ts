import {Component, Input, OnChanges} from '@angular/core';
import {Game} from "@common/interfaces/game";
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {PitcherStats} from "@common/model/pitcher-stats.model";
import {Site} from "@common/constants/site";
import {BoxScore} from "@common/model/box.score.model";
import {BoxScoreUtils} from "@common/utils/boxscore.utils";
import {Schedule} from "@common/interfaces/team-schedule.interface";
import {GameUtils} from "@common/utils/game.utils";
import {Pitching} from "@common/interfaces/pitching";
import {StatsSupplierComponent} from "../../../../shared/components/stats-supplier.component";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {SourceType} from "../splits.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'bullpen-splits',
  standalone: true,
  imports: [
    NgIf,
    MatButtonToggle,
    MatButtonToggleGroup,
    FormsModule
  ],
  templateUrl: './bullpen.component.html',
  styleUrl: './bullpen.component.css'
})
export class BullpenComponent extends StatsSupplierComponent implements OnChanges {
  homePitcherStats: PitcherStats = new PitcherStats();
  awayPitcherStats: PitcherStats = new PitcherStats();
  @Input() game!: Game;

  statsSource: SourceType = SourceType.Season;

  constructor(route: ActivatedRoute) {
    super(route);
  }

  getPitcherStats(site: Site): PitcherStats {
    let pitcherStats: PitcherStats;

    const schedule: Schedule = this.getSchedule(this.game[site]);

    const boxScores: BoxScore[] = schedule.schedule
      .filter(GameUtils.gameCompleted)
      .map(({gameID}) => this.getBoxScore(gameID))
      .sort(BoxScoreUtils.sortChronologically);

    switch (this.statsSource) {
      case SourceType.Season:
        pitcherStats = this.aggregateStats(boxScores);
        break;
      case SourceType.Split:
        const siteBoxScores: BoxScore[] = boxScores.filter((boxScore: BoxScore) => boxScore[site] === this.game[site]);
        pitcherStats = this.aggregateStats(siteBoxScores);
        break;
      case SourceType.Teams:
        const sameTeamsBoxScores: BoxScore[] = boxScores.filter((boxScore: BoxScore) =>
          [boxScore.away, boxScore.home].some((teamAbv: string) => teamAbv === this.game.away) &&
          [boxScore.away, boxScore.home].some((teamAbv: string) => teamAbv === this.game.home));

        pitcherStats = this.aggregateStats(sameTeamsBoxScores);
        break;
    }

    return pitcherStats
  }



  private aggregateStats(boxScores: BoxScore[]): PitcherStats {
    const pitcherStats: PitcherStats = new PitcherStats();

    boxScores.forEach(({playerStats}) => {
      const bullpenStats: Pitching[] = playerStats
        .filter(({allPositionsPlayed, Pitching}) => allPositionsPlayed === 'P' && Pitching.pitchingOrder !== '1')
        .map(({Pitching}) => Pitching);

      bullpenStats.forEach(pitcherStats.add.bind(pitcherStats));
    });

    pitcherStats.finalize(boxScores.length);

    return pitcherStats;
  }

  protected readonly StatsSource = SourceType;

  selectSplits() {
    this.awayPitcherStats = this.getPitcherStats(Site.AWAY);
    this.homePitcherStats = this.getPitcherStats(Site.HOME);
  }

  ngOnChanges(): void {
    this.selectSplits();
  }
}
