import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from "../../../../common/model/game.interface";
import {Team} from "../../../../common/model/team.interface";
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
  constructor(private activatedRoute: ActivatedRoute) {
    super();
  }

  game!: Game;
  home!: Team;
  away!: Team;

  getDate({gameTime_epoch}: Game): Date {
    return new Date(Number(gameTime_epoch) * 1000);
  }

  get hasDataToDisplaySelectedGame() {
    return this.game.gameID && this.game.gameTime_epoch
      && this.away && this.hasTeamRequiredFields(this.away)
      && this.home && this.hasTeamRequiredFields(this.home);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.data.subscribe((data: Data) => {
      const gameID: string = this.activatedRoute.snapshot.params['gameId'];
      const games: Game[] = data['dailySchedule'];
      const {away, home} = data['matchUp'];

      this.game = games.find(game => game.gameID === gameID)!;
      this.home = home.team;
      this.away = away.team;
    }))
  }

  hasTeamRequiredFields({espnLogo1, wins, loss}: Team) {
    const hasLogo: boolean = !!espnLogo1;
    const hasWins: boolean = !!wins;
    const hasLoss: boolean = !!loss;
    return hasLogo && hasWins && hasLoss;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
