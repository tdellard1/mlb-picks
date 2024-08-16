import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {BackendApiService} from "../services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";
import {StatsSource} from "../../features/Splits/splits/splits.component.js";
import {Hitting} from "../../common/interfaces/hitting";

export const splitsResolver: ResolveFn<Hitting> = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const source: string = activatedRouteSnapshot.queryParams['source'];

  const backendApiService: BackendApiService = inject(BackendApiService);
  const yyyyMMdd_AWAY_HOME: string = activatedRouteSnapshot.params['gameId'];
  const teams: string[] = yyyyMMdd_AWAY_HOME.split('_')[1].split('@');

  if (source) {
    return backendApiService.getTeamStatsForTeams(teams, source)
  } else {
    return backendApiService.getTeamStatsForTeams(teams, StatsSource.Season)
  }
};
