import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {Game} from "../../../common/model/game.interface";
import {Team, Teams} from "../../../common/model/team.interface";
import {MatDivider} from "@angular/material/divider";
import {Tank01ApiService} from "../../../common/services/api-services/tank01-api.service";
import {map, tap} from "rxjs/operators";
import {GameSelectorService} from "../../data-access/services/game-selector.service";

@Component({
  selector: 'game-selector',
  standalone: true,
  imports: [
    MatCard,
    NgOptimizedImage,
    MatDivider,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.css',
})
export class GameSelectorComponent {
  constructor(private tank01ApiService: Tank01ApiService,
              private gameSelectorService: GameSelectorService) {}

  dailySchedule = this.tank01ApiService.getDailySchedule(true).pipe(
    map((games: Game[]) => games.sort(this.dailyScheduleSorter)),
    tap((games: Game[]) => this.onGameSelected(games[0]))
  );

  selectedGame!: Game;
  @Input() teams!: Teams;

  onGameSelected(game: Game): void {
    this.selectedGame = game;
    const away: Team = this.teams.getTeam(game.away);
    const home: Team = this.teams.getTeam(game.home);
    this.gameSelectorService.gameSelected(game, home, away);
  }

  private dailyScheduleSorter = (a: Game, b: Game) => {
    const aGame: number = Number(a.gameTime_epoch);
    const bGame: number = Number(b.gameTime_epoch);

    return aGame - bGame;
  }
}
