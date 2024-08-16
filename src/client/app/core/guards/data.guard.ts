import { CanActivateFn } from '@angular/router';
import {BackendApiService} from "../services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {HomeSpinnerService} from "../services/home-spinner.service.js";
import {BoxScore} from "../../common/model/box.score.model";
import {db} from "../db";

export const dataGuard: CanActivateFn = async () => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  const homeSpinnerService: HomeSpinnerService = inject(HomeSpinnerService);

  const update: boolean = await firstValueFrom(backendApiService.getUpdateNeeded());
  const hasInternalBoxScores: boolean = await db.boxScores.count() > 0;

  if (hasInternalBoxScores && !update) {
    homeSpinnerService.hideTransparentBackground();
    homeSpinnerService.hideSpinner();
  } else {
    const boxScoresFromServer: BoxScore[] = await firstValueFrom(backendApiService.getBoxScores());

    db.boxScores.clear().then(() => {
      db.boxScores.bulkAdd(boxScoresFromServer).then(() => {
        homeSpinnerService.hideTransparentBackground();
        homeSpinnerService.hideSpinner();
      });
    });
  }

  return true;
};
