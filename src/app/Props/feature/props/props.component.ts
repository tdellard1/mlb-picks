import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {map} from "rxjs/operators";
import {Game} from "../../../common/model/game.interface";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component";
import {StateService} from "../../../common/services/state.service";
import {RosterPlayer} from "../../../common/model/roster.interface";
import {MatDivider} from "@angular/material/divider";
import {convertArrayToMap} from "../../../common/utils/general.utils";

@Component({
  selector: 'props',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    JsonPipe,
    MatDivider
  ],
  templateUrl: './props.component.html',
  styleUrl: './props.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropsComponent extends SubscriptionHolder implements OnDestroy, OnInit {
  dailySchedule: Game[] = [];
  players: Map<string, RosterPlayer> = new Map<string, RosterPlayer>();
  pitchersMap: Map<string, RosterPlayer> = new Map<string, RosterPlayer>();

  constructor(activatedRoute: ActivatedRoute,
              private stateService: StateService) {
    super();
    this.subscriptions.push(
      activatedRoute.data.pipe(
        map((data: Data) => data['dailySchedule'] as Game[])
      ).subscribe((games: Game[]) => this.dailySchedule = games));
  }



  ngOnDestroy(): void {
    this.unsubscribe();
    // this.stateService.saveState();
  }

  ngOnInit(): void {
    this.players = this.stateService.allPlayers;
  }

  get24NRFI(rosterPlayer: RosterPlayer): string {
    return this.stateService.getPitcherNRFIRecord(rosterPlayer);
  }

  getNRFIStreak(rosterPlayer: RosterPlayer): string {
    return this.stateService.getNRFIStreak(rosterPlayer);
  }
}
