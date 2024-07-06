import {Component, Input} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {DatePipe, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'game-selected',
  standalone: true,
  imports: [
    DatePipe,
    NgOptimizedImage
  ],
  templateUrl: './game-selected.component.html',
  styleUrl: './game-selected.component.css'
})
export class GameSelectedComponent {
  @Input() game!: Game;
  @Input() home!: Team;
  @Input() away!: Team;

  getDate({gameTime_epoch}: Game): Date {
    return new Date(Number(gameTime_epoch) * 1000);
  }
}
