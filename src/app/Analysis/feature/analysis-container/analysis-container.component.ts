import {Component, Input, OnInit} from '@angular/core';
import {AnalysisViewComponent} from "../analysis-view/analysis-view.component";
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {TeamAnalytics, TeamSchedule} from "../../../common/model/team-schedule.interface";
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgForOf, NgOptimizedImage} from "@angular/common";
import {BehaviorSubject, Observable} from "rxjs";
import {AnalysisGameSelectorComponent} from "../../ui/analysis-game-selector/analysis-game-selector.component";

@Component({
  selector: 'analysis-container-component',
  standalone: true,
  imports: [
    AnalysisViewComponent,
    MatCard,
    NgForOf,
    NgOptimizedImage,
    AsyncPipe,
    AnalysisGameSelectorComponent
  ],
  templateUrl: './analysis-container.component.html',
  styleUrl: './analysis-container.component.css'
})
export class AnalysisContainerComponent implements OnInit {
  @Input() games: Game[] = [];
  @Input() teams: Teams = {} as Teams;
  @Input() teamSchedules: TeamSchedule[] = [];
  @Input() boxScoreSchedule: TeamSchedule[] = [];

  teamAnalytics: TeamAnalytics[] = [];
  teamAnalyticsMap: Map<string, TeamAnalytics> = new Map();
  gamesMap: Map<string, Game> = new Map();

  private gameSubject: BehaviorSubject<Game> = new BehaviorSubject<Game>({} as Game);
  private homeTeamAnalyticsSubject: BehaviorSubject<TeamAnalytics> = new BehaviorSubject<TeamAnalytics>({} as TeamAnalytics);
  private awayTeamAnalyticsSubject: BehaviorSubject<TeamAnalytics> = new BehaviorSubject<TeamAnalytics>({} as TeamAnalytics);

  protected game$: Observable<Game> = this.gameSubject.asObservable();
  protected homeTeamAnalytics$: Observable<TeamAnalytics> = this.homeTeamAnalyticsSubject.asObservable();
  protected awayTeamAnalytics$: Observable<TeamAnalytics> = this.awayTeamAnalyticsSubject.asObservable();

  ngOnInit(): void {
    console.log('boxScoreSchedule', this.boxScoreSchedule);
    this.boxScoreSchedule.forEach(({team, schedule}: TeamSchedule) => {
      this.teamAnalytics.push(new TeamAnalytics(team, schedule));
      this.teamAnalyticsMap.set(team, new TeamAnalytics(team, schedule));
    });

    this.gamesMap = this.games.reduce((previousValue: Map<string, Game>, game: Game) => {
      previousValue.set(game.gameID, game);
      return previousValue;
    }, new Map<string, Game>());
  }

  selectGame({gameID, away, home}: Game) {
    this.gameSubject.next(this.gamesMap.get(gameID)!);
    this.homeTeamAnalyticsSubject.next(this.teamAnalyticsMap.get(home)!);
    this.awayTeamAnalyticsSubject.next(this.teamAnalyticsMap.get(away)!);
  }
}

