import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";

@Component({
  selector: 'analysis-game-selector',
  standalone: true,
  imports: [
    MatCard,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './analysis-game-selector.component.html',
  styleUrl: './analysis-game-selector.component.css'
})
export class AnalysisGameSelectorComponent implements OnInit {
  @Input() games!: Game[];
  @Input() teams!: Teams;
  @Output() gameSelected: EventEmitter<Game> = new EventEmitter();
  selectedGame: Game = {} as Game;

  onGameSelected(game: Game) {
    this.selectedGame = game;
    this.gameSelected.emit(game);
  }

  ngOnInit(): void {
    this.onGameSelected(this.games[0]);
  }
}
