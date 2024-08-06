import {ResolveFn} from '@angular/router';
import {Team} from "../model/team.interface";
import {BackendApiService} from "../services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";

export const teamsResolver: ResolveFn<Team[]> = () => {
  const backendApiService: BackendApiService = inject(BackendApiService);

  return backendApiService.getTeamsArray();
};

