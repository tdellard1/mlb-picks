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
import {ActivatedRoute, Data, RouterOutlet} from "@angular/router";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component";

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
    MatDivider,
    RouterOutlet
  ],
  templateUrl: './analysis-container.component.html',
  styleUrl: './analysis-container.component.css'
})
export class AnalysisContainerComponent extends SubscriptionHolder implements OnInit {
  constructor(private route: ActivatedRoute) { super(); }

  dailySchedule: Game[];
  mlbTeamSchedules: MLBTeamSchedule[];

  teamScheduleMap: Map<string, MLBTeamSchedule> = new Map();
  gamesMap: Map<string, Game> = new Map();

  ngOnInit(): void {
    this.subscriptions.push(this.route.parent!.parent!.data.subscribe((data: Data) => this.dailySchedule = data['dailySchedule']));
    this.subscriptions.push(this.route.data.subscribe((data: Data) => this.mlbTeamSchedules = data['mlbSchedules']));

    this.dailySchedule.forEach((game: Game) => this.gamesMap.set(game.gameID, game));
    this.mlbTeamSchedules.forEach((mLBTeamSchedule: MLBTeamSchedule) => {
      const {team}: MLBTeamSchedule = mLBTeamSchedule;
      this.teamScheduleMap.set(team, mLBTeamSchedule);
    });
  }
}

