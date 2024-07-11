import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {Tank01ApiService} from "../../services/api-services/tank01-api.service";
import {Game} from "../../model/game.interface";
import {firstValueFrom, lastValueFrom, mergeAll, mergeMap, Observable, of, toArray, zip} from "rxjs";
import {StateService} from "../../services/state.service";
import {RosterPlayer} from "../../model/roster.interface";
import {PlayerStats} from "../../model/player-stats.interface";
import {map} from "rxjs/operators";
import {LoggerService} from "../../services/logger.service";
import {compareTwoSchedules, getStartingPitchers} from "./daily-schedule.utils";

export const dailyScheduleResolver: ResolveFn<Game[]> = async (): Promise<Game[]> => {
  const logger: LoggerService = inject(LoggerService);
  const stateService: StateService = inject(StateService);
  const tank01ApiService: Tank01ApiService = inject(Tank01ApiService);

  const latestDailySchedule = await firstValueFrom(tank01ApiService.getDailySchedule());
  const olderDailySchedule = JSON.parse(localStorage.getItem('daily-schedule') || '') as Game[];

  const scheduleChanged: boolean = compareTwoSchedules(latestDailySchedule, olderDailySchedule);

  /** Injections */

  if (!scheduleChanged) {
    // logger.info('Schedules don\'t match, retrieving starting pitchers!');
    // const startingPitchers: string[] = getStartingPitchers(latestDailySchedule);
    //
    // const startingPitchersToRequest = startingPitchers.filter((playerID: string) => !stateService.hasPlayer(playerID));
    //
    // logger.info(`Retrieving the following players: ${startingPitchersToRequest}`);
    // const playerInfos$: Observable<RosterPlayer[]> = of(startingPitchersToRequest).pipe(
    //   mergeAll(),
    //   mergeMap((playerID: string) => tank01ApiService.getPlayerInfo(playerID)),
    //   toArray());
    //
    // const playerGameHistory$: Observable<{ [gameId: string]: PlayerStats }[]> = of(startingPitchersToRequest).pipe(
    //   mergeAll(),
    //   mergeMap((playerID: string) => tank01ApiService.getGamesForPlayer(playerID)),
    //   toArray());
    //
    // const rosterPlayers: Observable<RosterPlayer[]> = zip([playerInfos$, playerGameHistory$]).pipe(
    //   map(([players, games]) => {
    //     return players.map((rosterPlayer: RosterPlayer, index: number) => {
    //       rosterPlayer.games = Object.values(games[index]);
    //       return rosterPlayer;
    //     });
    //   }));
    //
    // /** Update */
    // const playersToAdd: RosterPlayer[] = await lastValueFrom(rosterPlayers);
    // // Error here if player has no team
    // stateService.addRosterPlayersAndTriggerUpwards(playersToAdd);
    // stateService.saveRosters().subscribe(console.log);
  }

  return latestDailySchedule;
};
