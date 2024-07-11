import {Injectable} from '@angular/core';
import {mergeAll, mergeMap, toArray} from "rxjs";
import {map} from "rxjs/operators";
import {Tank01ApiService} from "./api-services/tank01-api.service";
import {BackendApiService} from "./backend-api/backend-api.service";
import {Team, Teams} from "../model/team.interface";
import {TeamSchedule} from "../model/team-schedule.interface";
import {BoxScore} from "../model/box-score.interface";
import {DatePipe} from "@angular/common";
import {Game} from "../model/game.interface";

@Injectable({providedIn: 'root'})
export class UpdateStateSlice {
  constructor(private tank01ApiService: Tank01ApiService,
              private backendApiService: BackendApiService,
              private datePipe: DatePipe) {}

  updateTeamSchedules() {
    this.backendApiService.getTeams()
      .pipe(
        map(({teams}: Teams) => teams),
        mergeAll(),
        mergeMap(({teamAbv}: Team) => this.tank01ApiService.getTeamSchedule(teamAbv)),
        toArray()
      )
      .subscribe((teamSchedule: TeamSchedule[]) => {
        this.backendApiService.addSchedules(teamSchedule).subscribe(console.log)
      });
  }

  getYesterdaysBoxScores(previousBoxScores: BoxScore[]) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1)
    const yyyyMMdd = this.datePipe.transform(yesterday, 'yyyyMMdd')!
    this.tank01ApiService.getDailySchedule(yyyyMMdd)
      .pipe(
        map((games: Game[]) => games.map(({gameID}: Game) => gameID)),
        mergeAll(),
        mergeMap((gameID: string) => this.tank01ApiService.getBoxScoreForGame(gameID)),
        toArray()
      )
      .subscribe((boxScores: BoxScore[]) => {
        previousBoxScores.push(...boxScores);
        this.backendApiService.updateBoxScoresOnly(previousBoxScores).subscribe(console.log)
      });
  }
}
