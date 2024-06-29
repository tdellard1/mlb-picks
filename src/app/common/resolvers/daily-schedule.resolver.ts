import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {Tank01ApiService} from "../services/api-services/tank01-api.service";
import {Game} from "../model/game.interface";
import {Observable} from "rxjs";

export const dailyScheduleResolver: ResolveFn<Game[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Game[]> => {
  const today: number = new Date().setHours(0, 0, 0, 0);
  const lastUpdated: number = parseInt(JSON.parse(localStorage.getItem('lastUpdated') || '0'));
  const outdated: boolean = lastUpdated !== today;

  return inject(Tank01ApiService).getDailySchedule(outdated);
};
