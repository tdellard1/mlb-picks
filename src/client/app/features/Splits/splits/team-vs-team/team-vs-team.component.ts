import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {OffensiveStats} from "../../../../common/model/offensive-stats.modal";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'team-vs-team',
  standalone: true,
  imports: [
    NgIf,
    MatIcon
  ],
  templateUrl: './team-vs-team.component.html',
  styleUrl: './team-vs-team.component.css'
})
export class TeamVsTeamComponent {
  @Input() homeOffensiveStats: OffensiveStats;
  @Input() awayOffensiveStats: OffensiveStats;
  @Input() home: string;
  @Input() away: string;
}
