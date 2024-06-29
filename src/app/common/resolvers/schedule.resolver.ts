import {ResolveFn} from '@angular/router';
import {debounceTime, delay, first, mergeAll, mergeMap, Observable, of, switchMap, timer, toArray} from "rxjs";
import {TeamSchedule} from "../model/team-schedule.interface";
import {inject} from "@angular/core";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {Tank01ApiService} from "../services/api-services/tank01-api.service";
import {Team} from "../model/team.interface";
import {map, tap} from "rxjs/operators";

export const scheduleResolver: ResolveFn<TeamSchedule[]>  = (): Observable<TeamSchedule[]> => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  const tank01ApiService: Tank01ApiService = inject(Tank01ApiService);

  // tank01ApiService.getAllTeams().pipe(
  //   // mergeAll(),
  //   tap((teams: Team[]) => {
  //     const arr: string[] = [];
  //     teams.forEach((team: Team, index: number) => {
  //       setTimeout(() => {
  //         arr.push(team.teamAbv);
  //         console.log('value: ', team);
  //       }, index * 500);
  //     });
  //
  //     console.log('arr: ', arr, JSON.parse(JSON.stringify(arr)));
  //     console.log('end Of Tap()');
  //   }),
  // ).subscribe()



  const getSchedulesFromDatabase: Observable<TeamSchedule[]> = tank01ApiService.getAllTeams().pipe(
    mergeAll(),
    mergeMap(({teamAbv}: Team) => tank01ApiService.getTeamSchedule(teamAbv)),
    toArray(),
    tap((schedules: TeamSchedule[]) => {
      console.log('Had to retrieve schedules from Tank01');
      backendApiService.addSchedules(schedules);
    })
  );
  return backendApiService.getSchedules()
    .pipe(
      switchMap((schedules: TeamSchedule[]) => validateSchedule(schedules) ? of(schedules) : getSchedulesFromDatabase)
    );

  // return backendApiService.getSchedules();

  function validateSchedule(schedules: TeamSchedule[]): boolean {
    return schedules.length === 30;
  }
};
