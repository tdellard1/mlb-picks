import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {NgForOf, NgStyle} from "@angular/common";
import { getStartTimeString } from '../../../common/utils/date.utils';

@Component({
  selector: 'slate-details',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle
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

  protected readonly getStartTimeString = getStartTimeString;
}
