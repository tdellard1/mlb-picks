import {Component, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {NgIf} from "@angular/common";
import {RosterPlayer} from "../../../common/model/roster.interface.js";
import {ActivatedRoute, Params} from "@angular/router";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component.js";
import {sortByGameDate} from "../../../common/utils/state-builder.utils.js";
import {PlayerPitchingStats, PlayerStats} from "../../../common/model/player-stats.interface.js";
import {BackendApiService} from "../../../common/services/backend-api/backend-api.service.js";
import {switchMap} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'pitcher-view',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
    MatHeaderCellDef
  ],
  templateUrl: './pitcher-view.component.html',
  styleUrl: './pitcher-view.component.css'
})
export class PitcherViewComponent extends SubscriptionHolder implements OnInit {
  displayedColumns: string[] = ['Date', 'IP', 'H', 'R', 'ER', 'HR', 'BB', 'SO', 'Start'];
  dataSource: PitcherStatsElements[] = [];
  selectedPitcher: RosterPlayer;

  constructor(private backendApiService: BackendApiService,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.pipe(
        map((params: Params) => params['playerID'] as string),
        switchMap((playerId: string) => this.backendApiService.getPlayer(playerId))
      ).subscribe((rosterPlayer: RosterPlayer) => {
        this.selectedPitcher = rosterPlayer;
        this.selectPitcher();
      })
    );
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