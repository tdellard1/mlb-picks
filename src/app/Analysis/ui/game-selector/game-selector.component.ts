import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {MatDivider} from "@angular/material/divider";
import {map, tap} from "rxjs/operators";
import {GameSelectorService} from "../../data-access/services/game-selector.service";
import {ActivatedRoute, Data} from "@angular/router";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component";
import {StateService} from "../../../common/services/state.service";

@Component({
  selector: 'game-selector',
  standalone: true,
  imports: [
    MatCard,
    NgOptimizedImage,
    MatDivider,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.css',
})
export class GameSelectorComponent extends SubscriptionHolder implements OnDestroy, OnInit {
  dailySchedule: Game[] = [];
  selectedGame!: Game;
  teams: Map<string, Team> = new Map();

  constructor(private gameSelectorService: GameSelectorService,
              private stateService: StateService,
              private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.teams = this.stateService.allTeams;

    this.subscriptions.push(
      this.activatedRoute.data.pipe(
        map((data: Data) => data['dailySchedule'] as Game[]),
        map((games: Game[]) => games.sort(this.dailyScheduleSorter)),
        tap((games: Game[]) => this.onGameSelected(games[0]))
      ).subscribe((games: Game[]) => {
        this.dailySchedule = games;
      }));

  }


  onGameSelected(game: Game): void {
    this.selectedGame = game;
    const away: Team = this.teams.get(game.away)!;
    const home: Team = this.teams.get(game.home)!;
    this.gameSelectorService.gameSelected(game, home, away);
  }

  private dailyScheduleSorter = (a: Game, b: Game) => {
    const aGame: number = Number(a.gameTime_epoch);
    const bGame: number = Number(b.gameTime_epoch);

    return aGame - bGame;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
