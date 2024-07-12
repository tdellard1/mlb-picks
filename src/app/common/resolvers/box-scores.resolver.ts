import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {TeamSchedule} from "../model/team-schedule.interface";
import {BackendApiService} from "../services/backend-api/backend-api.service";

export const boxScoresResolver: ResolveFn<TeamSchedule[]> = () => {
  return inject(BackendApiService).getSchedules()
};
