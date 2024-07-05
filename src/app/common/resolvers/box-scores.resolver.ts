import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {map, tap} from "rxjs/operators";
import {TeamSchedule} from "../model/team-schedule.interface";
import {ApiService} from "../services/api-services/api.service";
import {environment} from "../../../environments/environment";

export const boxScoresResolver: ResolveFn<TeamSchedule[]> = () => {
  return inject(ApiService).get<{boxScore: TeamSchedule[]}>(environment.apiUrl + 'api/boxScore')
    .pipe(
      map(({boxScore}: {boxScore: TeamSchedule[]}) => boxScore),
      // c
    );
};
