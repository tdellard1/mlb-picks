import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {Tank01ApiService} from "../../services/api-services/tank01-api.service";
import {Game} from "../../model/game.interface";
import {firstValueFrom, lastValueFrom, mergeAll, mergeMap, Observable, of, toArray, zip} from "rxjs";
import {StateService} from "../../services/state.service";
import {RosterPlayer} from "../../model/roster.interface";
import {LoggerService} from "../../services/logger.service";
import {compareTwoSchedules, getStartingPitchers} from "./daily-schedule.utils";
import {UpdateStateService} from "../../services/update-state-slice.service";

export const dailyScheduleResolver: ResolveFn<Game[]> = async (): Promise<Game[]> => {
  const logger: LoggerService = inject(LoggerService);
  const stateService: StateService = inject(StateService);
  const tank01ApiService: Tank01ApiService = inject(Tank01ApiService);
  const updateStateService: UpdateStateService = inject(UpdateStateService);

  const latestDailySchedule: Game[] = await firstValueFrom(tank01ApiService.getDailySchedule());
  const olderDailySchedule: Game[] = JSON.parse(localStorage.getItem('daily-schedule') || '') as Game[];

  const scheduleChanged: boolean = compareTwoSchedules(latestDailySchedule, olderDailySchedule);

  if (!scheduleChanged) {
    logger.info('Schedules don\'t match, retrieving starting pitchers!');
    const startingPitchers: string[] = getStartingPitchers(latestDailySchedule);

    if (stateService.containsPlayers(startingPitchers)) {
      const requestPlayers: string[] = stateService.filterNewPlayers(startingPitchers);
      logger.info(`Retrieving the following players: ${requestPlayers}`);
      const playerInfos$: Observable<RosterPlayer[]> = of(requestPlayers).pipe(
        mergeAll(),
        mergeMap((playerID: string) => tank01ApiService.getPlayerInfo(playerID)),
        toArray());

    const playersToAdd: RosterPlayer[] = await lastValueFrom(playerInfos$);

    await updateStateService.addPlayerToRosters(playersToAdd);
    }
  }

  return latestDailySchedule;
};
