import {ResolveFn} from '@angular/router';
import {Team} from "../../common/interfaces/team.interface.js";
import {BackendApiService} from "../services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";

export const teamsResolver: ResolveFn<Team[]> = () => {
  const backendApiService: BackendApiService = inject(BackendApiService);

  return backendApiService.getTeamsArray();
};

