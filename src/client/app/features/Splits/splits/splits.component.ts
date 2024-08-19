import {Component} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {OffensiveStats} from "@common/model/offensive-stats.modal.js";
import {TeamVsTeamComponent} from "./team-vs-team/team-vs-team.component";
import {PitcherVsPitcherComponent} from "./pitcher-vs-pitcher/pitcher-vs-pitcher.component";
import {Schedule} from "@common/interfaces/team-schedule.interface";
import {Game} from "@common/interfaces/game";
import {GameUtils} from "@common/utils/game.utils";
import {BullpenComponent} from "./handed-splits/bullpen.component";
import {BoxScoreUtils} from "@common/utils/boxscore.utils";
import {Site} from "@common/constants/site";
import {StatsSupplierComponent} from "../../../shared/components/stats-supplier.component";
import {Hitting} from "@common/interfaces/hitting";

export enum SourceType {
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
    FormsModule,
    MatTab,
    MatTabGroup,
    TeamVsTeamComponent,
    PitcherVsPitcherComponent,
    BullpenComponent
  ],
  templateUrl: './splits.component.html',
  styleUrl: './splits.component.css'
})
export class SplitsComponent extends StatsSupplierComponent {
  protected selectedGame: Game;

  Away: string = '';
  Home: string = '';

  statsSource: SourceType = SourceType.Season;

  homeOffensiveStats: OffensiveStats = new OffensiveStats();
  awayOffensiveStats: OffensiveStats = new OffensiveStats();

  constructor(private route: ActivatedRoute) {
    super(route);

    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.setTeamsInfo(params['gameId']);
        this.selectSplits();
      })
    );
  }

  setTeamsInfo(gameID: string) {
    this.selectedGame = this.getGame(gameID);

    const [away, home]: string[] = gameID.split('_')[1].split('@');
    this.Away = away;
    this.Home = home;
  }

  selectSplits() {
    const home: string = this.selectedGame.home;
    const away: string = this.selectedGame.away;

    this.homeOffensiveStats = this.getOffensiveStats(home, away, Site.HOME);
    this.awayOffensiveStats = this.getOffensiveStats(away, home, Site.AWAY);
  }

  protected readonly StatsSource = SourceType;

  private getOffensiveStats(team: string, opposing: string, site: Site): OffensiveStats {
    const {schedule}: Schedule = this.getSchedule(team);

    const offensiveStats: OffensiveStats = new OffensiveStats();

    const HittingStats: Hitting[] = schedule
      .filter(GameUtils.gameCompleted)
      .map(({gameID}) => this.getBoxScore(gameID))
      .filter(BoxScoreUtils.basedOnSplits(team, opposing, this.statsSource, site))
      .map(BoxScoreUtils.getTeamStats(team));

    HittingStats.forEach(offensiveStats.add.bind(offensiveStats));

    offensiveStats.finalize(HittingStats.length);

    return offensiveStats;
  }
}
