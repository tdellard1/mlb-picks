import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {NgIf} from "@angular/common";
import {TeamAnalytics} from "../../../common/model/team-schedule.interface";
import {StateService} from "../../../common/services/state.service";
import {Game} from "../../../common/model/game.interface";

@Component({
  selector: 'nrfi-panel',
  standalone: true,
  imports: [
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    NgIf
  ],
  templateUrl: './nrfi-panel.component.html',
  styleUrl: './nrfi-panel.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NrfiPanelComponent implements OnChanges {
  @Input() game!: Game;

  homeAnalytics: TeamAnalytics;
  awayAnalytics: TeamAnalytics;

  handsetPortrait: boolean = false;

  constructor(private breakpoint: BreakpointObserver, private stateService: StateService) {
    this.breakpoint.observe(Breakpoints.HandsetPortrait)
      .subscribe((bpState: BreakpointState) => {
        this.handsetPortrait = bpState.matches;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const game: Game = changes['game'].currentValue as Game;
    if (game) {
      this.homeAnalytics = this.stateService.getTeamAnalytics(game.home);
      this.awayAnalytics = this.stateService.getTeamAnalytics(game.away);
    }
  }
}
