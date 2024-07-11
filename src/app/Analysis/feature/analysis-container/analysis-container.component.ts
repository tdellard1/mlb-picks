import {Component, Input, OnInit} from '@angular/core';
import {AnalysisViewComponent} from "../analysis-view/analysis-view.component";
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgForOf, NgOptimizedImage} from "@angular/common";
import {MLBTeamSchedule} from "../../data-access/mlb-team-schedule.model";
import {GameSelectorComponent} from "../../ui/game-selector/game-selector.component";
import {GameSelectedComponent} from "../../ui/game-selected/game-selected.component";
import {GameDetailsComponent} from "../../ui/game-details/game-details.component";
import {MatDivider} from "@angular/material/divider";
import {StateService} from "../../../common/services/state.service";
import {Tank01ApiService} from "../../../common/services/api-services/tank01-api.service";
import {BoxScore} from "../../../common/model/box-score.interface";
import {deepCopy} from "../../../common/utils/general.utils";

@Component({
  selector: 'analysis-container-component',
  standalone: true,
  imports: [
    AnalysisViewComponent,
    MatCard,
    NgForOf,
    NgOptimizedImage,
    AsyncPipe,
    GameSelectorComponent,
    GameSelectedComponent,
    GameDetailsComponent,
    MatDivider
  ],
  templateUrl: './analysis-container.component.html',
  styleUrl: './analysis-container.component.css'
})
export class AnalysisContainerComponent implements OnInit {
  @Input() teams!: Teams;
  @Input() dailySchedule!: Game[];
  @Input() mlbTeamSchedules!: MLBTeamSchedule[];

  teamScheduleMap: Map<string, MLBTeamSchedule> = new Map();
  gamesMap: Map<string, Game> = new Map();


  constructor(private stateService: StateService,
              private tank01ApiService: Tank01ApiService) {}

  ngOnInit(): void {
    this.dailySchedule.forEach((game: Game) => this.gamesMap.set(game.gameID, game));
    this.mlbTeamSchedules.forEach((mLBTeamSchedule: MLBTeamSchedule) => {
      const {team}: MLBTeamSchedule = mLBTeamSchedule;
      this.teamScheduleMap.set(team, mLBTeamSchedule);
    });
  }
}

