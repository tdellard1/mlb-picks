import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {RosterPlayer} from "../../../common/model/roster.interface";
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {ActivatedRoute, Data, RouterLink} from "@angular/router";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component.js";

@Component({
  selector: 'game-details',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    RouterLink
  ],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameDetailsComponent extends SubscriptionHolder implements OnInit, OnDestroy {
  playersMap: Map<string, RosterPlayer> = new Map();
  game: Game;
  away: Team;
  home: Team;

  constructor(private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.data.subscribe((data: Data) => {
        const gameID: string = this.activatedRoute.snapshot.params['gameId'];
        const games: Game[] = data['dailySchedule'];
        const players: RosterPlayer[] = data['players'] as RosterPlayer[];
        const {away, home} = data['matchUp'];

        const timestamp: number = JSON.parse(JSON.stringify(Date.now()));
        players.forEach((player: RosterPlayer) => {
          this.playersMap.set(player.playerID, player);
        });


        this.game = games.find(game => game.gameID === gameID)!;
        this.home = home.team;
        this.away = away.team;
      })
    )
  }

  get hasDataToDisplayPitchers() {
    return this.game.gameID && (this.game.probableStartingPitchers.away || this.game.probableStartingPitchers.home);
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
