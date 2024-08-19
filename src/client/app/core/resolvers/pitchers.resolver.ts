import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {Tank01ApiService} from "../services/api-services/tank01-api.service";

export const pitchersResolver: ResolveFn<any> = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const playerID: string = activatedRouteSnapshot.params['playerID'];
  return inject(Tank01ApiService).getGamesForPlayer(playerID);
};
