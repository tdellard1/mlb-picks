import {ResolveFn} from '@angular/router';
import {mergeAll, Observable, toArray} from "rxjs";
import {TeamSchedule} from "../model/team-schedule.interface";
import {inject} from "@angular/core";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {map} from "rxjs/operators";
import {MLBTeamSchedule} from "../../Analysis/data-access/mlb-team-schedule.model";

export const mlbSchedulesResolver: ResolveFn<MLBTeamSchedule[]>  = (): Observable<MLBTeamSchedule[]> => {
  const backendApiService: BackendApiService = inject(BackendApiService);

  return backendApiService.getSchedules().pipe(
    mergeAll(),
    map((schedule: TeamSchedule) => new MLBTeamSchedule(schedule)),
    toArray()
  );
};
