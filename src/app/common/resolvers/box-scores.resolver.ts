import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {map, tap} from "rxjs/operators";
import {TeamSchedule} from "../model/team-schedule.interface";
import {ApiService} from "../services/api-services/api.service";

export const boxScoresResolver: ResolveFn<TeamSchedule[]> = () => {
  return inject(ApiService).get<{boxScore: TeamSchedule[]}>('https://dazzling-canyonlands-93084-106125d12a27.herokuapp.com/api/boxScore')
    .pipe(
      map(({boxScore}: {boxScore: TeamSchedule[]}) => boxScore),
      // c
    );
};
