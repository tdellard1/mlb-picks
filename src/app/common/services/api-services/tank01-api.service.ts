import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {mergeAll, mergeMap, Observable, of, take, toArray} from "rxjs";
import {HttpOptions} from "../../model/http-options.model";
import {ApiService} from "./api.service";
import {Player} from "../../model/players.interface";
import {map} from "rxjs/operators";
import {Team} from "../../model/team.interface";
import {Teams} from "../../model/team.interface";
import {Game} from "../../model/game.interface";
import {DatePipe} from "@angular/common";
import {ensure} from "../../utils/array.utils";
import {TeamSchedule} from "../../model/team-schedule.interface";
import {BoxScore} from "../../model/box-score.interface";
import {PlayerStats} from "../../model/player-stats.interface";
import {RosterPlayer} from "../../model/roster.interface";

@Injectable({
  providedIn: 'root'
})
export class Tank01ApiService {
  private readonly tank01_Url: string = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/';
  private readonly GET_TEAM_SCHEDULE_URL: string = 'getMLBTeamSchedule';
  private readonly GET_TEAM_ROSTER_URL: string = 'getMLBTeamRoster';
  private readonly GET_DAILY_SCHEDULE_URL: string = 'getMLBGamesForDate';
  private readonly GET_GAMES_FOR_PLAYER: string = 'getMLBGamesForPlayer';
  private readonly GET_PLAYER_INFO: string = 'getMLBPlayerInfo';
  private readonly GET_ALL_PLAYERS_URL: string = 'getMLBPlayerList';
  private readonly GET_BOX_SCORE_URL: string = 'getMLBBoxScore';
  private readonly GET_ALL_TEAMS_URL: string = 'getMLBTeams';

  private defaultHeaders: HttpHeaders = new HttpHeaders({
    'X-RapidAPI-Key': 'e22845af99mshf6b3ec01f4d7666p1c7ce7jsne4ce7518ae06',
    'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
  });

  constructor(private apiService: ApiService,
              private datePipe: DatePipe) {}

  getAllTeams(): Observable<Array<Team>> {
      // Come back and try this as strings of boolean
      const teamStats: boolean = true;
      const topPerformers: boolean = true;

      return this.get<{ body: Team[] }>(
        this.GET_ALL_TEAMS_URL,{
          teamStats,
          topPerformers
        })
        .pipe(map((value: { body: Team[] }) => value.body || []));
  }

  getDailySchedule(yyyyMMdd?: string): Observable<Array<Game>> {
    const gameDate: string = yyyyMMdd || this.datePipe.transform(new Date(), 'yyyyMMdd')!;

    return this.get<{ body: Game[] }>(this.GET_DAILY_SCHEDULE_URL, {gameDate})
      .pipe(map((value: { body: Game[] }) => value.body || []));
  }

  getTeamSchedule(teamAbv: string, season: string = '2024'): Observable<TeamSchedule> {
    return this.get<{ body: Game[] }>(
      this.GET_TEAM_SCHEDULE_URL, {teamAbv, season})
      .pipe(map((value: { body: { team: string, schedule: Game[]} }) => value.body || []));
  }

  private get<T>(url: string, params?: any): Observable<any> {
    const options: HttpOptions = {
      headers: this.defaultHeaders,
      params: params
    };

    return this.apiService.get<T>(this.tank01_Url + url, options);
  };

  getBoxScoreForGame(gameID: string): Observable<BoxScore> {
    return this.get<{ body: BoxScore }>(
      this.GET_BOX_SCORE_URL, {gameID})
      .pipe(map((value: { body: BoxScore }) => value.body || []));
  }



  getRoster(teamAbv: string, getStats: boolean = true): Observable<any> {
    return this.get<{ body: Game[] }>(
      this.GET_TEAM_ROSTER_URL, {teamAbv, getStats})
      .pipe(map((value: { body: { team: string, roster: any[]} }) => value.body || []));
  }


  getGamesForPlayer(playerID: string, season: string = '2024'): Observable<{[gameId: string]: PlayerStats}> {
    return this.get<{ body: {[gameId: string]: PlayerStats} }>(
      this.GET_GAMES_FOR_PLAYER, {playerID, season})
      .pipe(map((value: { body: {[gameId: string]: PlayerStats} }) => value.body || []));
  }

  getPlayerInfo(playerID: string, getStats: boolean = true, season: string = '2024'): Observable<RosterPlayer> {
    return this.get<{ body: RosterPlayer }>(
      this.GET_PLAYER_INFO, {playerID, getStats, season})
      .pipe(map((value: { body: RosterPlayer} ) => value.body || []));
  }
}
