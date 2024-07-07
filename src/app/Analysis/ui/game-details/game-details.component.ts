import {Component, Input} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {PlayerInfo} from "../../data-access/player-info.model";

@Component({
  selector: 'game-details',
  standalone: true,
  imports: [],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent {
  @Input() game!: Game;
  @Input() home!: Team;
  @Input() away!: Team;
  @Input() homePitcher!: PlayerInfo;
}
