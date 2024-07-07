import {Component, Input} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {AsyncPipe, DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {GameSelectorService, GameSelectorState} from "../../data-access/services/game-selector.service";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

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
export class GameSelectedComponent {
  gameSelected: Observable<GameSelectorState> = this.gameSelectorService.selectedGameInfo.pipe(
    tap((gameSelected: GameSelectorState) => {
      this.game = gameSelected.game;
      this.away = gameSelected.away;
      this.home = gameSelected.home;
    })
  );

  constructor(private gameSelectorService: GameSelectorService) {}

  game!: Game;
  home!: Team;
  away!: Team;

  getDate({gameTime_epoch}: Game): Date {
    return new Date(Number(gameTime_epoch) * 1000);
  }
}
