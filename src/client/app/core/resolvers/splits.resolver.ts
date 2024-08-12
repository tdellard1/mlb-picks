import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {BackendApiService} from "../services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";
import {Teams} from "../../common/model/game.interface.js";
import {BoxScore} from "../../common/model/box-score.interface.js";
import {StatsSource} from "../../features/Splits/splits/splits.component.js";

export const splitsResolver: ResolveFn<Teams<BoxScore[]>> = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const source: string = activatedRouteSnapshot.queryParams['source'];

  const backendApiService: BackendApiService = inject(BackendApiService);
  const yyyyMMdd_AWAY_HOME: string = activatedRouteSnapshot.params['gameId'];
  const teams: string[] = yyyyMMdd_AWAY_HOME.split('_')[1].split('@');

  if (source) {
    return backendApiService.getTeamStatsForTeams(teams, source)
  } else {
    return backendApiService.getTeamStatsForTeams(teams, StatsSource.Season)
  }

  // return backendApiService.getBoxScoreForTeams(teams);
};
