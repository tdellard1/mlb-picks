import {Component, Input} from '@angular/core';
import {getStartTimeString} from "../../../../common/utils/date.utils";
import {NgForOf, NgStyle} from "@angular/common";
import {Game} from "../../../../common/model/game.interface";
import {Teams} from "../../../../common/model/team.interface";

@Component({
  selector: 'app-game-run-down',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle
  ],
  templateUrl: './game-run-down.component.html',
  styleUrl: './game-run-down.component.css'
})
export class GameRunDownComponent {
  @Input() games: Game[] = [];
  @Input() teams: Teams = {} as Teams;

  public getStyles() {
    return {
      display: 'grid',
      'grid-template-columns': ` 100px min-content min-content 1fr`,
      'grid-template-rows': `repeat(${this.games.length + 1}, 36px)`,
      'grid-gap': '10px'
    };
  }

  getHomeTeam({home}: Game) {
    return this.teams.getTeamName(home);
  }

  getAwayTeam({away}: Game) {
    return this.teams.getTeamName(away);
  }

  protected readonly getStartTimeString = getStartTimeString;
}
