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
import {ActivatedRoute, Params} from "@angular/router";
import {SubscriptionHolder} from "../../../../shared/components/subscription-holder.component.js";
import {sortByGameDate} from "@common/utils/state-builder.utils.js";
import {PlayerStats} from "@common/interfaces/player-stats.js";
import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {Pitching} from "@common/interfaces/pitching";
import {RosterPlayer} from "@common/interfaces/players";
import {Tank01ApiService} from "../../../../core/services/api-services/tank01-api.service";

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

  constructor(private tank01ApiService: Tank01ApiService,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.pipe(
        map(({playerID}: Params) => playerID),
        switchMap((playerId: string) => this.tank01ApiService.getPlayer(playerId))
      ).subscribe((rosterPlayer: RosterPlayer) => {
        rosterPlayer.games = this.route.snapshot.data['pitcher'];
        this.selectPitcher(rosterPlayer);
      })
    );
  }

  selectPitcher(rosterPlayer: RosterPlayer) {
    this.selectedPitcher = rosterPlayer;
    this.dataSource = [];
    this.selectedPitcher.games
      ?.sort(sortByGameDate())
      .reverse()
      .forEach(({gameID, Pitching, started}: PlayerStats) => {
        const {InningsPitched, H, R, ER, HR, BB, SO}: Pitching = Pitching;
        this.dataSource.push({
          Date: this.getGameDate(gameID),
          IP: InningsPitched,
          H, R, ER, HR, BB, SO, Start: started
        } as PitcherStatsElements);
      });
  }


  getGameDate(gameID: string): string {
    const yyyyMMdd: string = gameID.split('_')[0];
    const formattedDate: string = yyyyMMdd.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
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