import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {BackendApiService} from "../../common/services/backend-api/backend-api.service";
import {inject} from "@angular/core";
import {UpdateStateService} from "../../common/services/update-state-slice.service";

export const analysisViewResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  /*
  {
    away: {
      runs: [],
      battingAverage: [],
      onBasePercentage: [],
      hittingStrikeouts: [],
      sluggingPercentage: [],
      onBasePlusSlugging: [],
    },
    home: {
      runs: [],
      battingAverage: [],
      onBasePercentage: [],
      hittingStrikeouts: [],
      sluggingPercentage: [],
      onBasePlusSlugging: [],
    }
  }
*/
  return backendApiService.getGameAnalysis(route.params['gameId']);
};
