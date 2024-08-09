import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {BackendApiService} from "../services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";

export const splitsResolver: ResolveFn<boolean> = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  const yyyyMMdd_AWAY_HOME: string = activatedRouteSnapshot.params['gameId'];
  const teams: string[] = yyyyMMdd_AWAY_HOME.split('_')[1].split('@');

  return backendApiService.getBoxScoreForTeams(teams);
};
