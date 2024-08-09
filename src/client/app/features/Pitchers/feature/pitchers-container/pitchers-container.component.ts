import {Component} from '@angular/core';
import {ActivatedRoute, Data, Router, RouterOutlet} from "@angular/router";
import {Game, Games} from "../../../../common/model/game.interface";
import {SubscriptionHolder} from "../../../../shared/components/subscription-holder.component";
import {RosterPlayer} from "../../../../common/model/roster.interface";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";

@Component({
  selector: 'pitchers-container',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    NgIf,
    MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatHeaderCellDef, RouterOutlet
  ],
  templateUrl: './pitchers-container.component.html',
  styleUrl: './pitchers-container.component.css'
})
export class PitchersContainerComponent extends SubscriptionHolder {
  pitchersArray: RosterPlayer[] = [];
  selectedPitcher: RosterPlayer;



  constructor(private route: ActivatedRoute,
              private router: Router) {
    super();

    this.subscriptions.push(
      this.route.data
        .subscribe((data: Data) => {
          const players: RosterPlayer[] = data['players'] as RosterPlayer[];
          const games: Game[] = data['dailySchedule'] as Game[];

          if (games.length > 1) {
            this.pitchersArray = new Games(games).sortedGames
              .map(({probableStartingPitchers}: Game) => [probableStartingPitchers.away, probableStartingPitchers.home])
              .flat()
              .filter(Boolean)
              .map((pitcherID) => players.find((player: RosterPlayer) => player.playerID === pitcherID)!)
              .filter(Boolean);

            const playerID: string = this.route.snapshot.children[0] && this.route.snapshot.children[0].params['playerID'];
            const selectedPlayer: RosterPlayer | undefined = this.pitchersArray.find((pitcher: RosterPlayer) => pitcher.playerID === playerID);
            this.selectedPitcher = selectedPlayer || this.pitchersArray[0];
            this.changePitcher();
          }
        })
    )
  }

  changePitcher() {
    this.router.navigate([`pitchers/${this.selectedPitcher.playerID}`], {onSameUrlNavigation: "reload"});
  }
}
