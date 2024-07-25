import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {combineLatest, firstValueFrom, from, Observable} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {TeamSchedule} from "../model/team-schedule.interface";
import {db, IBoxScore} from "../../../../db";
import {BoxScore} from "../model/box-score.interface";
import {MetaData} from "../../../server/singletons/redis";
import {RosterPlayer} from "../model/roster.interface";
import {Team} from "../model/team.interface";
import {liveQuery} from "dexie";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const stateService: StateService = inject(StateService);
  const backendApiService: BackendApiService = inject(BackendApiService);

  const metaData: { [key: string]: MetaData } = await firstValueFrom(backendApiService.getMetaData());

  updateRosterPlayers(metaData['rosters'], backendApiService);
  updateBoxScores(metaData['boxScores'], backendApiService);
  updateSchedules(metaData['schedules'], backendApiService);
  updateTeams(metaData['teams'], backendApiService);

  const teamsSource$: Observable<Team[]> = from(liveQuery<Team[]>(() => db.teams.toArray()));
  const boxScoresSource$: Observable<IBoxScore[]> = from(liveQuery<IBoxScore[]>(() => db.boxScores.toArray()));
  const schedulesSource$: Observable<TeamSchedule[]> = from(liveQuery<TeamSchedule[]>(() => db.schedules.toArray()));
  const rosterPlayersSource$: Observable<RosterPlayer[]> = from(liveQuery<RosterPlayer[]>(() => db.rosterPlayers.toArray()));

  /** This gets only one value from Dexie and adds it to the state services, change this code so that we continuously retrieve all values from dexie, 
  and pass them through to the service loadStateSlices method. Probably will mena putting this in the constructor of the state object, adding an initialized method
  to the service, and doing a while loop, for while the service isn't initialized, or make the condition based on when we have enough data to load the app.
  */
  const [boxScores, teams, schedules, rosterPlayers]: [BoxScore[], Team[], TeamSchedule[], RosterPlayer[]] = await firstValueFrom(combineLatest([boxScoresSource$, teamsSource$, schedulesSource$, rosterPlayersSource$]))

  stateService.loadStateSlices(teams, rosterPlayers, schedules, boxScores);

  return true;
};


function updateSchedules({count, lastUpdated}: MetaData, backendApiService: BackendApiService) {
  db.schedules.count().then(async (dexieCount: number) => {
    const key: string = 'schedulesLastUpdated';
    const clientLastUpdated: number = Number(localStorage.getItem(key) || 0);

    const needToUpdate: boolean =
      clientLastUpdated < lastUpdated
      && count !== dexieCount
      && dexieCount !== 0;

    console.log('count', count !== dexieCount, lastUpdated, clientLastUpdated < lastUpdated);
    if (needToUpdate) {
      const schedules: TeamSchedule[] = await firstValueFrom(backendApiService.getSchedules());
      db.schedules.clear().then(async () => {
        const result = await db.schedules.bulkAdd(schedules);
        localStorage.setItem(key, JSON.stringify(Date.now()));
      });
    }
  });
}


function updateTeams({count, lastUpdated}: MetaData, backendApiService: BackendApiService) {
  db.teams.count().then(async (dexieCount: number) => {
    const key: string = 'teamsLastUpdated';
    const clientLastUpdated: number = Number(localStorage.getItem(key) || 0);

    const needToUpdate: boolean =
      clientLastUpdated < lastUpdated
      && count !== dexieCount
      && dexieCount !== 0;

    if (needToUpdate) {
      const teams: Team[] = await firstValueFrom(backendApiService.getTeamsArray());
      db.teams.clear().then(async () => {
        const result = await db.teams.bulkAdd(teams);
        localStorage.setItem(key, JSON.stringify(Date.now()));
      });
    }
  });
}


function updateRosterPlayers({count, lastUpdated}: MetaData, backendApiService: BackendApiService) {
  db.rosterPlayers.count().then(async (dexieCount: number) => {const key: string = 'rosterPlayersLastUpdated';
    const clientLastUpdated: number = Number(localStorage.getItem(key) || 0);

    const needToUpdate: boolean =
      clientLastUpdated < lastUpdated
      && count !== dexieCount
      && dexieCount !== 0;

    if (needToUpdate) {
      const rosterPlayers: RosterPlayer[] = await firstValueFrom(backendApiService.getRosters());
      db.rosterPlayers.clear().then(async () => {
        const result = await db.rosterPlayers.bulkAdd(rosterPlayers);
        localStorage.setItem(key, JSON.stringify(Date.now()));
      });
    }
  });
}

function updateBoxScores({count, lastUpdated}: MetaData, backendApiService: BackendApiService) {
  db.boxScores.count().then(async (dexieCount: number) => {
    const key: string = 'boxScoresLastUpdated';
    const clientLastUpdated: number = Number(localStorage.getItem(key) || 0);

    const needToUpdate: boolean =
      clientLastUpdated < lastUpdated
      && count !== dexieCount
      && dexieCount !== 0;

    if (needToUpdate) {
      const boxScores: BoxScore[] = await firstValueFrom(backendApiService.getBoxScores());

      /** TODO: This eliminates undefined and duplicates, move this logic to the backend */
      const fixedBoxScores: BoxScore[] = boxScores.filter(({gameID}) => !!gameID);
      const dups: BoxScore[] = [];
      const useBoxScores: BoxScore[] = [];
      const uniq: string[] = [];

      fixedBoxScores.forEach((boxScore: BoxScore) => {
        if (!uniq.includes(boxScore.gameID)) {
          uniq.push(boxScore.gameID);
          useBoxScores.push(boxScore);
        }
      });

      db.boxScores.clear().then(async () => {
        const result = await db.boxScores.bulkAdd(useBoxScores);
        localStorage.setItem(key, JSON.stringify(Date.now()));
      });
    }
  });
}

export interface Count {
  count: number
}
