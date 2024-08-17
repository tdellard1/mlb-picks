import { ResolveFn } from '@angular/router';
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {inject} from "@angular/core";
import {Schedule} from "../../common/interfaces/team-schedule.interface";

export const schedulesResolver: ResolveFn<Schedule[]> = () => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  return backendApiService.getSchedules();
};
