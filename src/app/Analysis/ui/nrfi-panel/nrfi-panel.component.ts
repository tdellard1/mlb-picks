import {Component, Input, ViewEncapsulation} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {MLBTeamSchedule} from "../../data-access/mlb-team-schedule.model";
import {NgIf} from "@angular/common";

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
export class NrfiPanelComponent {
  @Input() away!: MLBTeamSchedule;
  @Input() home!: MLBTeamSchedule;
  handsetPortrait: boolean = false;

  constructor(private breakpoint: BreakpointObserver) {
    this.breakpoint.observe(Breakpoints.HandsetPortrait)
      .subscribe((bpState: BreakpointState) => {
        this.handsetPortrait = bpState.matches;
      });
  }
}
