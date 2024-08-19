import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {Game} from "../../../../common/interfaces/game";
import {Team} from "../../../../common/interfaces/team.interface";
import {ActivatedRoute, Data, RouterLink} from "@angular/router";
import {SubscriptionHolder} from "../../../../shared/components/subscription-holder.component.js";
import {RosterPlayer} from "../../../../common/interfaces/players";

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
  private readonly dailySchedule: Map<string, Game> = new Map((this.activatedRoute.snapshot.data['dailySchedule'] as Game[]).map((game: Game) => [game.gameID, game]));
  private readonly teams: Map<string, Team> = new Map((this.activatedRoute.snapshot.data['teams'] as Team[]).map((team: Team) => [team.teamAbv, team]));

  playersMap: Map<string, RosterPlayer> = new Map();
  game: Game;
  away: Team;
  home: Team;

  constructor(private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(({gameId}) => {
        const game: Game | undefined = this.dailySchedule.get(gameId);

        if (!game) throw new Error('No game exists!');
        this.game = game;

        const away: Team | undefined = this.teams.get(this.game.away);
        if (!away) throw new Error('Away team doesn\'t exist!');
        this.away = away;

        const home: Team | undefined = this.teams.get(this.game.home);
        if (!home) throw new Error('Home team doesn\'t exist!');
        this.home = home;
      }))
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
