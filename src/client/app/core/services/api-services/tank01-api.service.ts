import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpOptions} from "../../../common/model/http-options.model.js";
import {ApiService} from "./api.service.js";
import {map} from "rxjs/operators";
import {Game} from "../../../common/model/game.interface.js";
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class Tank01ApiService {
  private readonly tank01_Url: string = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/';
  private readonly GET_DAILY_SCHEDULE_URL: string = 'getMLBGamesForDate';

  private defaultHeaders: HttpHeaders = new HttpHeaders({
    'X-RapidAPI-Key': 'e22845af99mshf6b3ec01f4d7666p1c7ce7jsne4ce7518ae06',
    'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
  });

  constructor(private apiService: ApiService,
              private datePipe: DatePipe) {}

  getDailySchedule(yyyyMMdd?: string): Observable<Array<Game>> {
    const gameDate: string = yyyyMMdd || this.datePipe.transform(new Date(), 'yyyyMMdd')!;

    return this.get<{ body: Game[] }>(this.GET_DAILY_SCHEDULE_URL, {gameDate})
      .pipe(map((value: { body: Game[] }) => value.body || []));
  }

  private get<T>(url: string, params?: any): Observable<any> {
    const options: HttpOptions = {
      headers: this.defaultHeaders,
      params: params
    };

    return this.apiService.get<T>(this.tank01_Url + url, options);
  };
}
