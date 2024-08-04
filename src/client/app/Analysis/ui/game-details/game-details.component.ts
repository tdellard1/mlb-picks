import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {GameSelectorService} from "../../data-access/services/game-selector.service";
import {StateService} from "../../../common/services/state.service";
import {RosterPlayer} from "../../../common/model/roster.interface";
import {BaseGameSelectorComponent} from "../../../common/components/base-game-selector/base-game-selector.component";
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'game-details',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    RouterLink
  ],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameDetailsComponent extends BaseGameSelectorComponent implements OnInit {
  playersMap: Map<string, RosterPlayer> = new Map();
  away: Team;
  home: Team;

  constructor(private stateService: StateService,
              gameSelectorService: GameSelectorService,
              changeDetectionRef: ChangeDetectorRef) {
    super(gameSelectorService,
      changeDetectionRef);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.game$.subscribe((game: Game) => {
        if (game && game.home && game.away) {
          this.away = this.stateService.allTeams.get(game.away)!;
          this.home = this.stateService.allTeams.get(game.home)!;
        }
      })
    )
    this.playersMap = this.stateService.allPlayers;
  }

  get hasDataToDisplayPitchers() {
    return this.game.gameID && (this.game.probableStartingPitchers.away || this.game.probableStartingPitchers.home);
  }
}
