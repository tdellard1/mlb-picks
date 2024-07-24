import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {map} from "rxjs/operators";
import {Game} from "../../../common/model/game.interface";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component";
import {StateService} from "../../../common/services/state.service";
import {RosterPlayer} from "../../../common/model/roster.interface";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {PlayerPitchingStats, PlayerStats} from "../../../common/model/player-stats.interface";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {StateUtils} from "../../../common/utils/state.utils";
import {sortByGameDate} from "../../../common/utils/state-builder.utils";

@Component({
  selector: 'pitchers-container',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    NgIf,
    MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatHeaderCellDef
  ],
  templateUrl: './pitchers-container.component.html',
  styleUrl: './pitchers-container.component.css'
})
export class PitchersContainerComponent extends SubscriptionHolder {
  selectedPitcher: RosterPlayer;
  dataSource: PitcherStatsElements[] = [];
  pitchersArray: RosterPlayer[] = [];
  displayedColumns: string[] = ['Date', 'IP', 'H', 'R', 'ER', 'HR', 'BB', 'SO', 'Start'];

  constructor(private route: ActivatedRoute,
              private stateService: StateService) {
    super();
    this.subscriptions.push(
      this.route.data.pipe(map(({dailySchedule}: Data) => dailySchedule as Game[]))
        .subscribe((games: Game[]) => {
          if (games.length > 1) {
            this.pitchersArray = games
              .map(({probableStartingPitchers}: Game) => [probableStartingPitchers.away, probableStartingPitchers.home])
              .flat()
              .filter(Boolean)
              .map((pitcherID) => this.stateService.getPlayer(pitcherID))
              .filter(Boolean);

            this.selectedPitcher = this.pitchersArray[0];
            this.selectPitcher();
          }
        })
    )
  }


  selectPitcher() {
    this.dataSource = [];
    this.selectedPitcher.games?.sort(sortByGameDate()).reverse().forEach((playerStats: PlayerStats) => {
      const {InningsPitched, H, R, ER, HR, BB, SO}: PlayerPitchingStats = playerStats.Pitching;
      this.dataSource.push({
        Date: this.getGameDate(playerStats),
        IP: InningsPitched,
        H, R, ER, HR, BB, SO, Start: playerStats.started
      } as PitcherStatsElements);
    });

    console.log(this.pitchersArray);
  }

  getGameDate({gameID}: PlayerStats): string {
    const yyyyMMdd = gameID.split('_')[0];
    const formattedDate = yyyyMMdd.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
    const date: Date = new Date(formattedDate);

    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}

export interface PitcherStatsElements {
  IP: string;
  H: string;
  R: string;
  ER: string;
  HR: string;
  BB: string;
  SO: string;
  Start: string;
}
