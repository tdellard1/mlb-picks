import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {firstValueFrom, take} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {Team} from "../model/team.interface";
import {TeamSchedule} from "../model/team-schedule.interface";
import {db} from "../../../../db";
import {BoxScore} from "../model/box-score.interface";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const stateService: StateService = inject(StateService);

  const backendApiService: BackendApiService = inject(BackendApiService);

  /** FIXME: currently doesn't trigger when putting a log statement in */
  // forkJoin([backendApiService.getBoxScoresCount(),
  //   backendApiService.getRosterPlayersCount(),
  //   boxScores$,
  //   rosterPlayers$
  // ]).subscribe(async ([boxScoresCount, rosterPlayersCount, boxScoresFromDexie, rosterPlayersFromDexie]:
  //                       [Count, Count, BoxScore[], RosterPlayer[]]) => {
  //   if (rosterPlayersCount.count > rosterPlayersFromDexie.length) {
  //     const rosterPlayers: RosterPlayer[] = await firstValueFrom(backendApiService.getRosters());
  //     db.rosterPlayers.clear().then(async () => {
  //       await db.rosterPlayers.bulkAdd(rosterPlayers);
  //     });
  //   }
  // });


  /** Try to figure out why this doesn't work either */
  // backendApiService.getBoxScores().pipe(take(1)).subscribe((boxScores: BoxScore[]) => {
  //   db.boxScores.clear().then(async () => {
  //     await db.boxScores.bulkAdd(boxScores);
  //   });
  // });
  //
  // backendApiService.getTeamsArray().pipe(take(1)).subscribe((teams: Team[]) => {
  //   db.teams.clear().then(async () => {
  //     await db.teams.bulkAdd(teams);
  //   });
  // });
  //
  // backendApiService.getSchedules().pipe(take(1)).subscribe((teamSchedules: TeamSchedule[]) => {
  //   db.schedules.clear().then(async () => {
  //     await db.schedules.bulkAdd(teamSchedules);
  //   });
  // });


  const boxScores: BoxScore[] = await firstValueFrom(backendApiService.getBoxScores());
  db.boxScores.clear().then(async () => {
    await db.boxScores.bulkAdd(boxScores);
  });

  const teams: Team[] = await firstValueFrom<Team[]>(backendApiService.getTeamsArray());
  db.teams.clear().then(async () => {
    await db.teams.bulkAdd(teams);
  });

  const teamSchedules: TeamSchedule[] = await firstValueFrom<TeamSchedule[]>(backendApiService.getSchedules());
  db.schedules.clear().then(async () => {
    await db.schedules.bulkAdd(teamSchedules);
  });

  return true;
};

export interface Count {
  count: number
}
