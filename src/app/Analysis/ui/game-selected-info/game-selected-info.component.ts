import {Component, Input} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {DatePipe, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'game-selected-info',
  standalone: true,
  imports: [
    DatePipe,
    NgOptimizedImage
  ],
  templateUrl: './game-selected-info.component.html',
  styleUrl: './game-selected-info.component.css'
})
export class GameSelectedInfoComponent {
  @Input() game!: Game;
  @Input() home!: Team;
  @Input() away!: Team;


  getDate({gameTime_epoch}: Game): Date {
    return new Date(Number(gameTime_epoch) * 1000);
  }
}
