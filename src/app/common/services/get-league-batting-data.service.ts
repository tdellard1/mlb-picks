import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {DatePipe} from "@angular/common";
import {ApiService} from "./api-services/api.service";
import {Game} from "../model/game.interface";
import {map} from "rxjs/operators";
import {FanGraphsApiService} from "./api-services/fangraphs-api.service";

@Injectable({providedIn: 'root'})
export class GetLeagueBattingDataService {
  private readonly GET_DAILY_SCHEDULE: string = 'data';

  constructor(private fanGraphsApiService: FanGraphsApiService) {}

  getBattingStats(): Observable<Array<Game>> {
    return this.fanGraphsApiService.get<any>(this.GET_DAILY_SCHEDULE);
  }
}
