import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {Tank01ApiService} from "../../services/api-services/tank01-api.service.js";
import {Game} from "../../../common/interfaces/game.js";
import {firstValueFrom} from "rxjs";

export const dailyScheduleResolver: ResolveFn<Game[]> = async (): Promise<Game[]> => {
  const tank01ApiService: Tank01ApiService = inject(Tank01ApiService);

  return await firstValueFrom(tank01ApiService.getDailySchedule());
};
