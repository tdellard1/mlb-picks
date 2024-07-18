import {Component, Input} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {DatePipe, NgForOf, NgStyle} from "@angular/common";

@Component({
  selector: 'slate-details',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle,
    DatePipe
  ],
  templateUrl: './slate-details.component.html',
  styleUrl: './slate-details.component.css'
})
export class SlateDetailsComponent {
  @Input() getTeamName!: boolean;
  @Input() games!: Game[];
  @Input() teams!: Teams;

  public getStyles() {
    return {
      display: 'grid',
      'grid-template-columns': ` 100px max-content max-content 1fr`,
      'grid-template-rows': `repeat(${this.games.length + 1}, 40px)`,
      'grid-gap': '10px'
    };
  }

  getDate(game: Game): Date {
    console.log('gameTime_epoch: ', game);
    return new Date(Number(game.gameTime_epoch) * 1000);
  }
}
