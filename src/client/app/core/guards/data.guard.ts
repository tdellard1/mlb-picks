import { CanActivateFn } from '@angular/router';
import {BackendApiService} from "../services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {HomeSpinnerService} from "../services/home-spinner.service.js";

export const dataGuard: CanActivateFn = async () => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  const homeSpinnerService: HomeSpinnerService = inject(HomeSpinnerService);


  const update: boolean = await firstValueFrom(backendApiService.getUpdateNeeded());
  const showSpinner: boolean = false;

  if (update) {

  } else {
    homeSpinnerService.hideSpinner();
  }
  return true;
};
