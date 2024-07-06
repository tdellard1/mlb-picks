import {Component, Input, OnInit} from '@angular/core';
import {AnalysisViewComponent} from "../analysis-view/analysis-view.component";
import {Game} from "../../../common/model/game.interface";
import {Team, Teams} from "../../../common/model/team.interface";
import {TeamAnalytics, TeamSchedule} from "../../../common/model/team-schedule.interface";
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgForOf, NgOptimizedImage} from "@angular/common";
import {BehaviorSubject, Observable} from "rxjs";
import {MLBTeamSchedule} from "../../data-access/mlb-team-schedule.model";
import {GameSelectorComponent} from "../../ui/game-selector/game-selector.component";
import {GameSelectedComponent} from "../../ui/game-selected/game-selected.component";

@Component({
  selector: 'analysis-container-component',
  standalone: true,
  imports: [
    AnalysisViewComponent,
    MatCard,
    NgForOf,
    NgOptimizedImage,
    AsyncPipe,
    GameSelectorComponent,
    GameSelectedComponent
  ],
  templateUrl: './analysis-container.component.html',
  styleUrl: './analysis-container.component.css'
})
export class AnalysisContainerComponent implements OnInit {
  @Input() dailySchedule!: Game[];

  @Input() teams: Teams = {} as Teams;
  @Input() teamSchedules: TeamSchedule[] = [];
  @Input() boxScoreSchedule: TeamSchedule[] = [];
  @Input() mlbTeamSchedules!: MLBTeamSchedule[];

  teamAnalytics: TeamAnalytics[] = [];
  teamAnalyticsMap: Map<string, TeamAnalytics> = new Map();
  gamesMap: Map<string, Game> = new Map();

  private gameSubject: BehaviorSubject<Game> = new BehaviorSubject<Game>({} as Game);
  private homeTeamSubject: BehaviorSubject<Team> = new BehaviorSubject<Team>({} as Team);
  private awayTeamSubject: BehaviorSubject<Team> = new BehaviorSubject<Team>({} as Team);

  private homeTeamAnalyticsSubject: BehaviorSubject<TeamAnalytics> = new BehaviorSubject<TeamAnalytics>({} as TeamAnalytics);
  private awayTeamAnalyticsSubject: BehaviorSubject<TeamAnalytics> = new BehaviorSubject<TeamAnalytics>({} as TeamAnalytics);

  protected game$: Observable<Game> = this.gameSubject.asObservable();
  protected home$: Observable<Team> = this.homeTeamSubject.asObservable();
  protected away$: Observable<Team> = this.awayTeamSubject.asObservable();

  protected homeTeamAnalytics$: Observable<TeamAnalytics> = this.homeTeamAnalyticsSubject.asObservable();
  protected awayTeamAnalytics$: Observable<TeamAnalytics> = this.awayTeamAnalyticsSubject.asObservable();

  ngOnInit(): void {
    this.boxScoreSchedule.forEach(({team, schedule}: TeamSchedule) => {
      this.teamAnalytics.push(new TeamAnalytics(team, schedule));
      this.teamAnalyticsMap.set(team, new TeamAnalytics(team, schedule));
    });

    this.dailySchedule.forEach((game: Game) => {
      this.gamesMap.set(game.gameID, game)
    });

    this.selectGame(this.dailySchedule[0]);
  }

  selectGame({gameID, away, home}: Game) {
    this.gameSubject.next(this.gamesMap.get(gameID)!);
    this.homeTeamAnalyticsSubject.next(this.teamAnalyticsMap.get(home)!);
    this.awayTeamAnalyticsSubject.next(this.teamAnalyticsMap.get(away)!);
    this.homeTeamSubject.next(this.teams.getTeam(home));
    this.awayTeamSubject.next(this.teams.getTeam(away));
  }
}

