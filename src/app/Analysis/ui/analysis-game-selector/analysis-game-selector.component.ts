import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {Game} from "../../../common/model/game.interface";
import {Team, Teams} from "../../../common/model/team.interface";
import {GameSelectedInfoComponent} from "../game-selected-info/game-selected-info.component";

@Component({
  selector: 'analysis-game-selector',
  standalone: true,
  imports: [
    MatCard,
    NgForOf,
    NgOptimizedImage,
    GameSelectedInfoComponent
  ],
  templateUrl: './analysis-game-selector.component.html',
  styleUrl: './analysis-game-selector.component.css'
})
export class AnalysisGameSelectorComponent implements OnInit {
  @Input() dailySchedule!: Game[];
  @Input() teams!: Teams;
  @Output() gameSelected: EventEmitter<Game> = new EventEmitter();

  selectedGame: Game = {} as Game;
  home: Team = {} as Team;
  away: Team = {} as Team;

  ngOnInit(): void {
    this.onGameSelected(this.dailySchedule[0]);
  }

  onGameSelected(game: Game) {
    this.home = this.teams.getTeam(game.home);
    this.away = this.teams.getTeam(game.away);
    this.selectedGame = game;
    this.gameSelected.emit(game);
  }
}
