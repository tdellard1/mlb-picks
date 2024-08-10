import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {BackendApiService} from "../services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";
import {Roster} from "../../common/model/roster.interface.js";

export const rostersResolver: ResolveFn<Roster[]> = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  const yyyyMMdd_AWAY_HOME: string = activatedRouteSnapshot.params['gameId'];
  const teams: string[] = yyyyMMdd_AWAY_HOME.split('_')[1].split('@');

  return backendApiService.getRosters(teams);
};
