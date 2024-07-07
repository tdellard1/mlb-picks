import {Component, Input} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {filter, Observable} from "rxjs";
import {Player} from "../../../common/model/players.interface";
import {map, tap} from "rxjs/operators";
import {ActivatedRoute, Data} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {GameSelectorService, GameSelectorState} from "../../data-access/services/game-selector.service";

@Component({
  selector: 'game-details',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent {
  constructor(private activatedRoute: ActivatedRoute, private gameSelectorService: GameSelectorService) {}

  gameSelected$: Observable<GameSelectorState> = this.gameSelectorService.selectedGameInfo.pipe(
    tap(({game, home, away}: GameSelectorState) => {
      this.game = game;
      this.away = away;
      this.home = home;
    })
  );

  game!: Game;
  home!: Team;
  away!: Team;

  playerFinderOne$: Observable<Player[]> = this.activatedRoute.data.pipe(
    map((data: Data) => data['players'] as Player[]),
    map((players: Player[]) => players.filter((player: Player) => player.playerID === this.game.probableStartingPitchers['away']))
  );

  playerFinderTwo$: Observable<Player[]> = this.activatedRoute.data.pipe(
    map((data: Data) => data['players'] as Player[]),
    map((players: Player[]) => players.filter((player: Player) => player.playerID === this.game.probableStartingPitchers['home']))
  );
}
