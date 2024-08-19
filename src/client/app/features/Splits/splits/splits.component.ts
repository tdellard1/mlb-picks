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
import {Hitting} from "@common/interfaces/hitting";
import {SubscriptionHolder} from "../../../shared/components/subscription-holder.component";
import {BoxScore} from "@common/model/box.score.model";

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
export class SplitsComponent extends SubscriptionHolder {
  protected readonly boxScores: BoxScore[] = this.activatedRoute.snapshot.data['boxScores'] as BoxScore[];
  protected readonly schedules: Schedule[] = this.activatedRoute.snapshot.data['schedules'] as Schedule[];
  protected readonly dailySchedule: Game[] = this.activatedRoute.snapshot.data['dailySchedule'] as Game[];
  protected readonly boxScoresMap: Map<string, BoxScore> = new Map((this.boxScores).map((boxScore: BoxScore) => [boxScore.gameID, boxScore]));
  protected readonly schedulesMap: Map<string, Schedule> = new Map((this.schedules).map((schedule: Schedule) => [schedule.team, schedule]));
  protected readonly dailyScheduleMap: Map<string, Game> = new Map((this.dailySchedule).map((game: Game) => [game.gameID, game]));

  protected selectedGame: Game;

  Away: string = '';
  Home: string = '';

  statsSource: SourceType = SourceType.Season;

  homeOffensiveStats: OffensiveStats = new OffensiveStats();
  awayOffensiveStats: OffensiveStats = new OffensiveStats();

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params) => {
        this.setTeamsInfo(params['gameId']);
        this.selectSplits();
      })
    );
  }

  setTeamsInfo(gameID: string) {
    const game: Game | undefined = this.dailyScheduleMap.get(gameID);

    if (game) {
      this.selectedGame = game;
    } else {
      throw new Error(`Can't find resource for ${gameID}`);
    }

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
    const schedule: Schedule | undefined = this.schedulesMap.get(team);

    if (schedule) {
      const offensiveStats: OffensiveStats = new OffensiveStats();

      const HittingStats: Hitting[] = schedule.schedule
        .filter(GameUtils.gameCompleted)
        .map(({gameID}) => this.boxScoresMap.get(gameID)!)
        .filter(BoxScoreUtils.basedOnSplits(team, opposing, this.statsSource, site))
        .map(BoxScoreUtils.getTeamStats(team));

      HittingStats.forEach(offensiveStats.add.bind(offensiveStats));

      offensiveStats.finalize(HittingStats.length);

      return offensiveStats;
    } else {
      throw new Error(`Can't find resource for ${team}`);
    }
  }
}
