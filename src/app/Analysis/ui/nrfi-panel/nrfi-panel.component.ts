import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {MLBTeamSchedule} from "../../data-access/mlb-team-schedule.model";
import {NgIf} from "@angular/common";
import {TeamSchedule} from "../../../common/model/team-schedule.interface";
import {StateService} from "../../../common/services/state.service";
import {Team} from "../../../common/model/team.interface";

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
export class NrfiPanelComponent implements OnChanges, OnInit {
  @Input() away!: MLBTeamSchedule;
  @Input() home!: MLBTeamSchedule;

  awaySchedule: MLBTeamSchedule = {} as MLBTeamSchedule;
  homeSchedule: MLBTeamSchedule = {} as MLBTeamSchedule;
  scheduleMap: Map<string, TeamSchedule> = new Map();

  handsetPortrait: boolean = false;

  constructor(private breakpoint: BreakpointObserver, private stateService: StateService) {
    this.breakpoint.observe(Breakpoints.HandsetPortrait)
      .subscribe((bpState: BreakpointState) => {
        this.handsetPortrait = bpState.matches;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['home'].currentValue && changes['away'].currentValue) {
      const home: string = (changes['home'].currentValue as MLBTeamSchedule).team;
      const away: string = (changes['away'].currentValue as MLBTeamSchedule).team;

      this.awaySchedule = new MLBTeamSchedule(this.scheduleMap.get(away)!);
      this.homeSchedule = new MLBTeamSchedule(this.scheduleMap.get(home)!);
    }
  }

  ngOnInit(): void {
    this.scheduleMap = this.stateService.allSchedules;
  }
}
