import { ResolveFn } from '@angular/router';
import {BackendApiService} from "../../../../core/services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";
import {Observable} from "rxjs";
import {RosterPlayer} from "../../../../common/interfaces/players";

export const playersResolver: ResolveFn<Observable<RosterPlayer[]>> = () => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  return backendApiService.getPlayers();
};
