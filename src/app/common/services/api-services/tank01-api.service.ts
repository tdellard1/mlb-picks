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

@Injectable({
  providedIn: 'root'
})
export class Tank01ApiService {
  private readonly tank01_Url: string = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/';
  private readonly GET_TEAM_SCHEDULE_URL: string = 'getMLBTeamSchedule';
  private readonly GET_TEAM_ROSTER_URL: string = 'getMLBTeamRoster';
  private readonly GET_DAILY_SCHEDULE_URL: string = 'getMLBGamesForDate';
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

  getAllPlayers(): Observable<Array<Player>> {
    const players: Array<Player> | null = JSON.parse(localStorage.getItem('players') || '[]');

    if (players?.length) {
      return of(players);
    } else {
      return this.get<{ body: Player[] }>(this.GET_ALL_PLAYERS_URL)
        .pipe(map((value: { body: Player[] }) => value.body || []));
    }
  }

  getDailySchedule(outdated: boolean): Observable<Array<Game>> {
    const gameDate: string = this.datePipe.transform(new Date(), 'yyyyMMdd')!;
    const games: Array<Game> = ensure(JSON.parse(localStorage.getItem('daily-schedule') || '[]'));


    return (outdated || games.length < 1) ? this.get<{ body: Game[] }>(this.GET_DAILY_SCHEDULE_URL, {gameDate})
      .pipe(map((value: { body: Game[] }) => value.body || [])) : of(games);
  }

  getAllSchedules(): TeamSchedule[] {
    const schedules: Array<TeamSchedule> = JSON.parse(localStorage.getItem('schedules') || '[]');

    if (schedules?.length) {
      return schedules;
    }

    return [];
  }

  getTeamCachedSchedule(teamAbv: string, season: string = '2024'): Observable<TeamSchedule> {
    const schedules: Array<TeamSchedule> = ensure(JSON.parse(localStorage.getItem('schedules') || '[]'));

    if (schedules?.length) {
      const teamSchedule: TeamSchedule | undefined = schedules.find(({team}: TeamSchedule) => team === teamAbv);

      if (teamSchedule) {
        return of(teamSchedule);
      }
    }

    return this.get<{ body: Game[] }>(
      this.GET_TEAM_SCHEDULE_URL, {teamAbv, season})
      .pipe(map((value: { body: { team: string, schedule: Game[]} }) => value.body || []));
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

  getBoxScoreForSchedule({schedule}: TeamSchedule): Observable<BoxScore[]> {
    return of(schedule).pipe(
      mergeAll(),
      mergeMap((game: Game) => this.getBoxScoreForGame(game.gameID).pipe(take(1))),
      toArray(),
    )
  }

  getSchedulesWithBoxScoresIncluded(): TeamSchedule[] {
    const teamScheduleWithBoxScores: Array<TeamSchedule> = ensure(JSON.parse(localStorage.getItem('teamScheduleWithBoxScores') || '[]'));

    if (teamScheduleWithBoxScores?.length === 30) {
        return teamScheduleWithBoxScores;
    }

    return [];
  }

  getValidScheduleForBoxScore(): TeamSchedule[] | undefined {
    const schedulesOne: TeamSchedule[] = this.getSchedulesWithBoxScoresIncluded();

    if (schedulesOne && this.scheduleMeetsCriteria(schedulesOne)) {
      return schedulesOne;
    }

    const schedulesTwo: TeamSchedule[] = this.getAllSchedules();

    if (schedulesTwo && this.scheduleMeetsCriteria(schedulesTwo)) {
      return schedulesTwo;
    }

    return undefined;

  }

  scheduleMeetsCriteria(schedules: TeamSchedule[]): boolean {
    /**
     * In order to be a valid schedule with Box Scores, the schedule must:
     * 1. Be truthy
     * 2. Have 30 schedules (for 30 teams)
     * 3. Have 15 of the most recent games for each team's schedule
     */
    const truthy: boolean = schedules !== undefined && schedules !== null;
    const validLength: boolean = schedules.length === 30;
    const validGameAmount: boolean = schedules.every(({schedule}: TeamSchedule) => schedule.length > 14);

    return truthy && validLength && validGameAmount;
  }



  getRoster(teamAbv: string, getStats: boolean = true): Observable<any> {
    return this.get<{ body: Game[] }>(
      this.GET_TEAM_ROSTER_URL, {teamAbv, getStats})
      .pipe(map((value: { body: { team: string, roster: any[]} }) => value.body || []));
  }

}
