import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {Observable} from "rxjs";
import {RosterPlayer} from "@common/interfaces/players";
import {Tank01ApiService} from "../../../../core/services/api-services/tank01-api.service";

export const playersResolver: ResolveFn<Observable<RosterPlayer[]>> = () => {
  const tank01ApiService: Tank01ApiService = inject(Tank01ApiService);
  return tank01ApiService.getPlayers();
};
