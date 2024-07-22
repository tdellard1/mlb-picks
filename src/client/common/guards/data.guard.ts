import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {firstValueFrom, from, take} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {Team} from "../model/team.interface";
import {TeamSchedule} from "../model/team-schedule.interface";
import {db} from "../../../../db";
import {BoxScore} from "../model/box-score.interface";
import {MetaData} from "../../../server-ts/singletons/redis";
import {RosterPlayer} from "../model/roster.interface";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const stateService: StateService = inject(StateService);
  const backendApiService: BackendApiService = inject(BackendApiService);

  const lastUpdatedString: string | null = localStorage.getItem("lastUpdated");

  let lastUpdated: number = lastUpdatedString !== null ? Number(lastUpdatedString) : 0;

  const metaData: { [key: string]: MetaData } = await firstValueFrom(backendApiService.getMetaData());

  console.log('lastUpdated', lastUpdated);
  console.log('metaData', metaData);

  const playersLastUpdated: number = metaData['players'].lastUpdated;
  const playersDexieCount: Number = await db.allPlayers.count();
  if (playersLastUpdated > lastUpdated || playersDexieCount === 0) {
    const players: RosterPlayer[] = await firstValueFrom(backendApiService.getPlayers());
    db.allPlayers.clear().then(async () => {
      await db.allPlayers.bulkAdd(players);
      if (playersLastUpdated > lastUpdated) {
        lastUpdated = playersLastUpdated;
      }
    });
  }

  const rosterPlayersLastUpdated: number = metaData['rosters'].lastUpdated;
  const rosterPlayersDexieCount: number = await db.rosterPlayers.count();
  if (rosterPlayersLastUpdated > lastUpdated || rosterPlayersDexieCount === 0) {
    const rosterPlayers: RosterPlayer[] = await firstValueFrom(backendApiService.getRosters());
    db.rosterPlayers.clear().then(async () => {
      await db.rosterPlayers.bulkAdd(rosterPlayers);
      if (rosterPlayersLastUpdated > lastUpdated) {
        lastUpdated = rosterPlayersLastUpdated;
      }
    });
  }

  const boxScoresLastUpdated: number = metaData['boxScores'].lastUpdated;
  const boxScoresDexieCount: number = await db.boxScores.count();
  if (boxScoresLastUpdated > lastUpdated || boxScoresDexieCount === 0) {
    const boxScores: BoxScore[] = await firstValueFrom(backendApiService.getBoxScores());
    db.boxScores.clear().then(async () => {
      await db.boxScores.bulkAdd(boxScores);
      if (boxScoresLastUpdated > lastUpdated) {
        lastUpdated = boxScoresLastUpdated;
      }
    });
  }

  const teamsLastUpdated: number = metaData['teams'].lastUpdated;
  const teamsDexieCount: number = await db.teams.count();
  if (teamsLastUpdated > lastUpdated || teamsDexieCount === 0) {
    const teams: Team[] = await firstValueFrom<Team[]>(backendApiService.getTeamsArray());
    db.teams.clear().then(async () => {
      await db.teams.bulkAdd(teams);
      if (teamsLastUpdated > lastUpdated) {
        lastUpdated = teamsLastUpdated;
      }
    });
  }

  const schedulesLastUpdated: number = metaData['schedules'].lastUpdated;
  const schedulesDexieCount: number = await db.schedules.count();
  if (schedulesLastUpdated > lastUpdated || schedulesDexieCount === 0) {
    const teamSchedules: TeamSchedule[] = await firstValueFrom<TeamSchedule[]>(backendApiService.getSchedules());
    db.schedules.clear().then(async () => {
      await db.schedules.bulkAdd(teamSchedules);
      if (schedulesLastUpdated > lastUpdated) {
        lastUpdated = schedulesLastUpdated;
      }
    });
  }

  localStorage.setItem("lastUpdated", JSON.stringify(lastUpdated));
  return true;
};

export interface Count {
  count: number
}
