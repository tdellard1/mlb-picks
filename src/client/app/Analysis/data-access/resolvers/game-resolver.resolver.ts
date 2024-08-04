import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {BackendApiService} from "../../../common/services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";

export const gameResolver: ResolveFn<boolean> = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  const gameId: string = activatedRouteSnapshot.params['gameId'];

  return backendApiService.getGameAnalysisData(gameId);
};
