import { ResolveFn } from '@angular/router';
import {BackendApiService, TeamsNRFIPercentage} from "../../../common/services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";
import {Observable} from "rxjs";

export const teamNrfiResolver: () => Observable<TeamsNRFIPercentage> = () => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  return backendApiService.getTeamsNRFIData();
};
