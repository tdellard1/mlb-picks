import {Component, Input} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {PlayerInfo} from "../../data-access/player-info.model";
import {filter, Observable} from "rxjs";
import {Player} from "../../../common/model/players.interface";
import {map} from "rxjs/operators";
import {ActivatedRoute, Data} from "@angular/router";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'game-details',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent {
  constructor(private activatedRoute: ActivatedRoute) {
  }

  @Input() game!: Game;
  @Input() home!: Team;
  @Input() away!: Team;
  // @Input() homePitcher!: PlayerInfo;

  playerFinderOne$: Observable<Player[]> = this.activatedRoute.data.pipe(
    map((data: Data) => data['players'] as Player[]),
    map((players: Player[]) => players.filter((player: Player) => player.playerID === this.game.probableStartingPitchers['away']))
  );

  playerFinderTwo$: Observable<Player[]> = this.activatedRoute.data.pipe(
    map((data: Data) => data['players'] as Player[]),
    map((players: Player[]) => players.filter((player: Player) => player.playerID === this.game.probableStartingPitchers['home']))
  );
}
