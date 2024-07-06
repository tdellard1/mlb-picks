import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {Game} from "../../../common/model/game.interface";
import {Team, Teams} from "../../../common/model/team.interface";

@Component({
  selector: 'game-selector',
  standalone: true,
  imports: [
    MatCard,
    NgOptimizedImage
  ],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.css'
})
export class GameSelectorComponent {
  @Input() teams!: Teams;
  @Input('game') selectedGame!: Game;
  @Input('dailySchedule') _dailySchedule!: Game[];
  @Output() gameSelected: EventEmitter<Game> = new EventEmitter();

  onGameSelected(game: Game): void {
    this.selectedGame = game;
    this.gameSelected.emit(game);
  }

  get dailySchedule() {
    return this._dailySchedule.slice().sort((a, b) => {
      const aGame: number = Number(a.gameTime_epoch);
      const bGame: number = Number(b.gameTime_epoch);

      return aGame - bGame;
    });
  }
}
