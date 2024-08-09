import { ResolveFn } from '@angular/router';
import {BackendApiService} from "../../../../core/services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";
import {RosterPlayer} from "../../../../common/model/roster.interface.js";
import {Observable} from "rxjs";

export const playersResolver: ResolveFn<Observable<RosterPlayer[]>> = () => {
  const backendApiService: BackendApiService = inject(BackendApiService);
  return backendApiService.getPlayers();
};
