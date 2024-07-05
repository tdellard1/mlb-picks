import {ResolveFn} from '@angular/router';
import {Player} from "../model/players.interface";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {BackendApiService} from "../services/backend-api/backend-api.service";

export const playersResolver: ResolveFn<Player[]> = (): Observable<Player[]> => {
  return inject(BackendApiService).getPlayers()
};
