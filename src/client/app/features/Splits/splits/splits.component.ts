import {Component} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {SubscriptionHolder} from "../../../shared/components/subscription-holder.component.js";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Team} from "../../../common/interfaces/team.interface.js";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {TeamStatsHitting} from "../../../common/model/team-stats.model.js";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {OffensiveStats} from "../../../common/model/offensive-stats.modal.js";
import {Hitting} from "../../../common/interfaces/hitting";
import {BoxScore} from "../../../common/model/box.score.model";
import {TeamVsTeamComponent} from "./team-vs-team/team-vs-team.component";
import {PitcherVsPitcherComponent} from "./pitcher-vs-pitcher/pitcher-vs-pitcher.component";
import {Schedule} from "../../../common/interfaces/team-schedule.interface";
import {Game} from "../../../common/interfaces/game";
import {GameStatus} from "../../../common/constants/game-status";
import {GameUtils} from "../../../common/utils/game.utils";
import {StateUtils} from "../../../common/utils/state.utils";
import {RosterPlayer} from "../../../common/interfaces/players";

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
    AsyncPipe,
    TeamVsTeamComponent,
    PitcherVsPitcherComponent
  ],
  templateUrl: './splits.component.html',
  styleUrl: './splits.component.css'
})
export class SplitsComponent extends SubscriptionHolder {
  private readonly teams: Map<string, Team> = new Map((this.activatedRoute.snapshot.data['teams'] as Team[]).map((team: Team) => [team.teamAbv, team]));
  private readonly schedules: Map<string, Schedule> = new Map((this.activatedRoute.snapshot.data['schedules'] as Schedule[]).map((schedule: Schedule) => [schedule.team, schedule]));
  private readonly boxScoresMap: Map<string, BoxScore> = new Map((this.activatedRoute.snapshot.data['boxScores'] as BoxScore[]).map((boxScore: BoxScore) => [boxScore.gameID, boxScore]));

  private readonly dailySchedule: Map<string, Game> = new Map((this.activatedRoute.snapshot.data['dailySchedule'] as Game[]).map((game: Game) => [game.gameID, game]));

  private selectedGameId: string = '';
  protected selectedGame: Game;

  Away: { team: Team, schedule: Schedule, boxScores: BoxScore[] } = {} as any;
  Home: { team: Team, schedule: Schedule, boxScores: BoxScore[] } = {} as any;

  statsSource: StatsSource = StatsSource.Season;

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

  selectSplits() {
    const [awayName, homeName]: string[] = this.selectedGameId.split('_')[1].split('@');

    this.Away.boxScores = this.getAwayBoxScores(awayName, this.Away.schedule, this.statsSource, homeName);
    this.Home.boxScores = this.getHomeBoxScores(homeName, this.Home.schedule, this.statsSource, awayName);

    this.homeOffensiveStats = new OffensiveStats();
    this.awayOffensiveStats = new OffensiveStats();

    this.Home.boxScores.map(({teamStats}) => teamStats.home.Hitting).forEach((hitting: Hitting) => {
      const teamStatsHitting: TeamStatsHitting = new TeamStatsHitting(hitting);
      this.homeOffensiveStats.addTeamStatsHitting(teamStatsHitting);
    });

    this.Away.boxScores.map(({teamStats}) => teamStats.home.Hitting).forEach((hitting: Hitting) => {
      const teamStatsHitting: TeamStatsHitting = new TeamStatsHitting(hitting);
      this.awayOffensiveStats.addTeamStatsHitting(teamStatsHitting);
    });

    this.awayOffensiveStats.finalize(this.Away.boxScores.length);
    this.homeOffensiveStats.finalize(this.Home.boxScores.length);
  }


  setTeamsInfo(gameID: string) {
    this.selectedGameId = gameID;
    this.selectedGame = this.dailySchedule.get(this.selectedGameId)!;

    const [away, home]: string[] = this.selectedGameId.split('_')[1].split('@');
    this.Away.team = this.teams.get(away)!;
    this.Home.team = this.teams.get(home)!;
    this.Away.schedule = this.schedules.get(away)!;
    this.Home.schedule = this.schedules.get(home)!;
  }

  protected readonly StatsSource = StatsSource;

  private getAwayBoxScores(teamOfInterest: string, {schedule}: Schedule, statsSource: StatsSource, opposingTeam: string): BoxScore[] {
    const playedSchedule: Game[] = schedule
      .filter(({gameStatus}) => gameStatus === GameStatus.Completed)
      .sort(GameUtils.sortGames);
    const boxScores: BoxScore[] = playedSchedule.map(({gameID}) => this.boxScoresMap.get(gameID)!).filter(Boolean);

    if (statsSource === StatsSource.Split) {
      return boxScores.filter(({away}) => away === teamOfInterest);
    }

    if (statsSource === StatsSource.Teams) {
      return boxScores.filter(({away, home}) =>
        (away === teamOfInterest || home === teamOfInterest) && (away === opposingTeam || home === opposingTeam));
    }

    return boxScores;
  }

  private getHomeBoxScores(teamOfInterest: string, {schedule}: Schedule, statsSource: StatsSource, opposingTeam: string): BoxScore[] {
    const playedSchedule: Game[] = schedule
      .filter(({gameStatus}) => gameStatus === GameStatus.Completed)
      .sort(GameUtils.sortGames);
    const boxScores: BoxScore[] = playedSchedule.map(({gameID}) => this.boxScoresMap.get(gameID)!).filter(Boolean);

    if (statsSource === StatsSource.Split) {
      return boxScores.filter(({home}) => home === teamOfInterest);
    }

    if (statsSource === StatsSource.Teams) {
      return boxScores.filter(({
                                 away,
                                 home
                               }) => (away === teamOfInterest || home === teamOfInterest) && (away === opposingTeam || home === opposingTeam));
    }

    return boxScores;
  }
}
