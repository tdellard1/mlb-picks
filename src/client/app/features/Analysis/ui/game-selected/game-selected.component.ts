import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from "../../../../common/interfaces/game";
import {Team} from "../../../../common/interfaces/team.interface";
import {AsyncPipe, DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Data} from "@angular/router";
import {SubscriptionHolder} from "../../../../shared/components/subscription-holder.component.js";

@Component({
  selector: 'game-selected',
  standalone: true,
  imports: [
    DatePipe,
    NgOptimizedImage,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './game-selected.component.html',
  styleUrl: './game-selected.component.css'
})
export class GameSelectedComponent extends SubscriptionHolder implements OnInit, OnDestroy {
  private readonly dailySchedule: Map<string, Game> = new Map((this.activatedRoute.snapshot.data['dailySchedule'] as Game[]).map((game: Game) => [game.gameID, game]));
  private readonly teams: Map<string, Team> = new Map((this.activatedRoute.snapshot.data['teams'] as Team[]).map((team: Team) => [team.teamAbv, team]));

  constructor(private activatedRoute: ActivatedRoute) {
    super();
  }

  game!: Game;
  home!: Team;
  away!: Team;

  getDate({gameTime_epoch}: Game): Date {
    return new Date(Number(gameTime_epoch) * 1000);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(({gameId}) => {
        const game: Game | undefined = this.dailySchedule.get(gameId);

        if (!game) throw new Error('No game exists!');
        this.game = game;
        const {away, home}: Game = this.game;

        let team: Team | undefined = this.teams.get(away);
        if (!team) throw new Error('Away team doesn\'t exist!');
        this.away = team;

        team = this.teams.get(home);
        if (!team) throw new Error('Home team doesn\'t exist!');
        this.home = team;
      }))
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
