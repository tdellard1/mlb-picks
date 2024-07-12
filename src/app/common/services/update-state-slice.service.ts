import {Injectable} from '@angular/core';
import {firstValueFrom, mergeAll, mergeMap, Observable, toArray} from "rxjs";
import {map} from "rxjs/operators";
import {Tank01ApiService} from "./api-services/tank01-api.service";
import {BackendApiService} from "./backend-api/backend-api.service";
import {BoxScore} from "../model/box-score.interface";
import {DatePipe} from "@angular/common";
import {Game} from "../model/game.interface";
import {RosterPlayer} from "../model/roster.interface";

@Injectable({providedIn: 'root'})
export class UpdateStateService {
  constructor(private tank01ApiService: Tank01ApiService,
              private backendApiService: BackendApiService,
              private datePipe: DatePipe) {}

  async addPlayerToRosters(players: RosterPlayer[]) {
    const allRosters: RosterPlayer[] = await firstValueFrom(this.backendApiService.getRosters());

    allRosters.push(...players);

    this.backendApiService.updateRosters(allRosters).subscribe(console.log)
  }

  getYesterdaysBoxScores(previousBoxScores: BoxScore[]): Observable<BoxScore[]> {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1)
    const yyyyMMdd = this.datePipe.transform(yesterday, 'yyyyMMdd')!
    return this.tank01ApiService.getDailySchedule(yyyyMMdd)
      .pipe(
        map((games: Game[]) => games.map(({gameID}: Game) => gameID)),
        mergeAll(),
        mergeMap((gameID: string) => this.tank01ApiService.getBoxScoreForGame(gameID)),
        toArray()
      )
  }
}
