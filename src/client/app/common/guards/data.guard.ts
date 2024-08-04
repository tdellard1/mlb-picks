import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {combineLatest, from, Observable, take} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {TeamSchedule} from "../model/team-schedule.interface";
import {db} from "../../db.js";
import {BoxScore} from "../model/box-score.interface";
import {Roster, RosterPlayer} from "../model/roster.interface";
import {areArraysEqual, Team} from "../model/team.interface";
import {map} from "rxjs/operators";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const stateService: StateService = inject(StateService);
  const backendApiService: BackendApiService = inject(BackendApiService);

  await stateService.init();

  const teamsFromServer$: Observable<Team[]> = backendApiService.getTeamsArray().pipe(take(1));
  const teamsFromDexie$: Observable<Team[]> = from(db.teams.toArray()).pipe(take(1));
  const team$: Observable<Team[]> = combineLatest([teamsFromServer$, teamsFromDexie$]).pipe(
    map(([server, dexie]: [Team[], Team[]]): Team[] => {
      if (!areArraysEqual(server, dexie, 'teamID')) {
        return server;
      } else {
        return [] as Team[];
      }
    }));


  const boxScoresFromServer$: Observable<BoxScore[]> = backendApiService.getBoxScores().pipe(take(1));
  const boxScoresFromDexie$: Observable<BoxScore[]> = from(db.boxScores.toArray()).pipe(take(1));
  const boxScore$: Observable<BoxScore[]> = combineLatest([boxScoresFromServer$, boxScoresFromDexie$]).pipe(
    map(([server, dexie]: [BoxScore[], BoxScore[]]) => {
      if (!areArraysEqual(server, dexie, 'gameID')) {
        return server;
      } else {
        return [] as BoxScore[];
      }
    }));

  const schedulesFromServer$: Observable<TeamSchedule[]> = backendApiService.getSchedules().pipe(take(1));
  const schedulesFromDexie$: Observable<TeamSchedule[]> = from(db.schedules.toArray()).pipe(take(1));
  const schedule$: Observable<TeamSchedule[]> = combineLatest([schedulesFromServer$, schedulesFromDexie$]).pipe(
    map(([server, dexie]: [TeamSchedule[], TeamSchedule[]]) => {
      if (!areArraysEqual(server, dexie, 'team')) {
        return server;
      } else {
        return [] as TeamSchedule[];
      }
    }));

  const playersFromServer$: Observable<RosterPlayer[]> = backendApiService.getPlayers().pipe(take(1));
  const playersFromDexie$: Observable<RosterPlayer[]> = from(db.players.toArray()).pipe(take(1));
  const player$: Observable<RosterPlayer[]> = combineLatest([playersFromServer$, playersFromDexie$]).pipe(
    map(([server, dexie]: [RosterPlayer[], RosterPlayer[]]) => {
      if (!areArraysEqual(server, dexie, 'playerID')) {
        return server;
      } else {
        return [] as RosterPlayer[];
      }
    }));

  const rostersFromServer$: Observable<Roster[]> = backendApiService.getRosters().pipe(take(1));
  const rostersFromDexie$: Observable<Roster[]> = from(db.rosters.toArray()).pipe(take(1));
  const roster$: Observable<Roster[]> = combineLatest([rostersFromServer$, rostersFromDexie$]).pipe(
    map(([server, dexie]: [Roster[], Roster[]]) => {
      if (!areArraysEqual(server, dexie, 'team')) {
        return server;
      } else {
        return [] as Roster[];
      }
    }));

  combineLatest([team$, boxScore$, schedule$, player$, roster$])
    .subscribe(([teams, boxScores, schedules, players, rosters]: [Team[], BoxScore[], TeamSchedule[], RosterPlayer[], Roster[]])  => {
      if (boxScores.some(({gameStatus}) => gameStatus === 'Live - In Progress')) {
        throw new Error('BoxScore is from game in progress. All games should be complete.')
      }

      stateService.update(teams, boxScores, schedules, players, rosters);
    });
  return true;
};