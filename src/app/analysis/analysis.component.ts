import {Component, Input} from '@angular/core';
import {AnalysisViewComponent} from "./view/analysis-view/analysis-view.component";
import {Game} from "../common/model/game.interface";
import {Teams} from "../common/model/team.interface";
import {TeamSchedule} from "../common/model/team-schedule.interface";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text?: string;
  html?: string;
  options?: string[];
}

@Component({
  selector: 'analysis-component',
  standalone: true,
  imports: [
    AnalysisViewComponent
  ],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent {
  @Input() games: Game[] = [];
  @Input() teams: Teams = {} as Teams;
  @Input() teamSchedules: TeamSchedule[] = [];

}

