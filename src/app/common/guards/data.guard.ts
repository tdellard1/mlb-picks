import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {firstValueFrom, Observable} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {Team} from "../model/team.interface";
import {BoxScore} from "../model/box-score.interface";
import {RosterPlayer} from "../model/roster.interface";
import {UpdateStateService} from "../services/update-state-slice.service";
import {LastUpdatedService} from "../services/last-updated.service";
import {TeamSchedule} from "../model/team-schedule.interface";
import {LoggerService} from "../services/logger.service";
import {db, IBoxScore} from "../../../../db";
import {liveQuery} from "dexie";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const stateService: StateService = inject(StateService);
  const backendApiService: BackendApiService = inject(BackendApiService);
  const boxScores: BoxScore[] = await firstValueFrom(backendApiService.getBoxScores());

  const boxScores$: any = liveQuery<IBoxScore[]>(() => db.boxScores.toArray());
  const listOfBoxScores: IBoxScore[] = await firstValueFrom(boxScores$);
  const boxScoresInDB: string | null = localStorage.getItem('boxScoreSize');
  const updateBoxScoresInIndexedDB = boxScoresInDB !== null && Number(boxScoresInDB) !== listOfBoxScores.length;

  if (updateBoxScoresInIndexedDB) {
  //   const updateStateService: UpdateStateService = inject(UpdateStateService);
  //   const lastUpdatedService: LastUpdatedService = inject(LastUpdatedService);
  //   const logger: LoggerService = inject(LoggerService);
  //
  //   const teams: Team[] = await firstValueFrom(backendApiService.getTeamsArray());
  //   const allPlayers: RosterPlayer[] = await firstValueFrom(backendApiService.getPlayers());
  //   const rosterPlayers: RosterPlayer[] = await firstValueFrom(backendApiService.getRosters());
  //   const schedules: TeamSchedule[] = await firstValueFrom(backendApiService.getSchedules());
  // } else {

    // db.boxScores.bulkAdd(boxScores);
    // localStorage.setItem('boxScoreSize', JSON.stringify(boxScores.length));
  }
  const value = await navigator.storage.estimate();
  console.log('testing: ', listOfBoxScores.length, new Set(listOfBoxScores.map(value1 => value1.gameID)).size);


  // stateService.loadStateSlices(teams, allPlayers, rosterPlayers, schedules, boxScores);

  // if (lastUpdatedService.refresh) {
  //   logger.info('Retrieving boxScores for Day Before...');
  //   updateStateService.getYesterdaysBoxScores(boxScores)
  //     .subscribe((newBoxScores: BoxScore[]) => {
  //     boxScores.push(...newBoxScores);
  //     backendApiService.updateBoxScores(boxScores).subscribe(console.log);
  //     stateService.loadStateSlices(teams, allPlayers, rosterPlayers, schedules, boxScores);
  //   });
  // } else {
  // }

  return true;
};
