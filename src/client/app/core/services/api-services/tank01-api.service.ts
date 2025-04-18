import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpOptions} from "@common/interfaces/http-options.js";
import {ApiService} from "./api.service.js";
import {map} from "rxjs/operators";
import {Game} from "@common/interfaces/game.js";
import {DatePipe} from "@angular/common";
import {PlayerStats} from "@common/interfaces/player-stats";
import {RosterPlayer} from "@common/interfaces/players";

@Injectable({
  providedIn: 'root'
})
export class Tank01ApiService {
  private readonly tank01_Url: string = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/';
  private readonly GET_DAILY_SCHEDULE_URL: string = 'getMLBGamesForDate';
  private readonly GET_GAMES_FOR_PLAYER_URL: string = 'getMLBGamesForPlayer';
  private readonly GET_PLAYERS_URL: string = 'getMLBPlayerList';
  private readonly GET_PLAYER_URL: string = 'getMLBPlayerInfo';

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

  getGamesForPlayer(playerID: string, season: string = '2024'): Observable<Array<PlayerStats>> {
    return this.get<{ body: PlayerStats[] }>(this.GET_GAMES_FOR_PLAYER_URL, {playerID, season})
      .pipe(map((value: { body: PlayerStats[] }) => Object.values(value.body) || []));
  }

  getPlayers(): Observable<Array<RosterPlayer>> {
    return this.get<{ body: RosterPlayer[] }>(this.GET_PLAYERS_URL)
      .pipe(map((value: { body: RosterPlayer[] }) => Object.values(value.body) || []));
  }

  getPlayer(playerID: string, getStats: boolean = true): Observable<RosterPlayer> {
    return this.get<{ body: RosterPlayer }>(this.GET_PLAYER_URL, {playerID, getStats})
      .pipe(map((value: { body: RosterPlayer }) => value.body || {} as RosterPlayer));
  }

  private get<T>(url: string, params?: any): Observable<any> {
    const options: HttpOptions = {
      headers: this.defaultHeaders,
      params: params
    };

    return this.apiService.get<T>(this.tank01_Url + url, options);
  };
}
