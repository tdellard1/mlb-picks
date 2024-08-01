import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {combineLatest, firstValueFrom, from, Observable} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {TeamSchedule} from "../model/team-schedule.interface";
import {db, IBoxScore} from "../../db.js";
import {BoxScore} from "../model/box-score.interface";
import {Roster, RosterPlayer} from "../model/roster.interface";
import {Team} from "../model/team.interface";
import {liveQuery} from "dexie";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const stateService: StateService = inject(StateService);
  const backendApiService: BackendApiService = inject(BackendApiService);
  const then: number = Date.now();

  /*
  const teamsSource$: Observable<Team[]> = from(liveQuery<Team[]>(() => db.teams.toArray()));
  const boxScoresSource$: Observable<IBoxScore[]> = from(liveQuery<IBoxScore[]>(() => db.boxScores.toArray()));
  const schedulesSource$: Observable<TeamSchedule[]> = from(liveQuery<TeamSchedule[]>(() => db.schedules.toArray()));
  const rosterPlayersSource$: Observable<RosterPlayer[]> = from(liveQuery<RosterPlayer[]>(() => db.rosterPlayers.toArray()));
  */

  const schedules: TeamSchedule[] = await firstValueFrom(backendApiService.getSchedules());
  const teams: Team[] = await firstValueFrom(backendApiService.getTeamsArray());
  const rosters: Roster[] = await firstValueFrom(backendApiService.getRosters());
  const players: RosterPlayer[] = await firstValueFrom(backendApiService.getPlayers());
  const boxScores: BoxScore[] = await firstValueFrom(backendApiService.getBoxScores());

  if (boxScores.some(({gameStatus}) => gameStatus === 'Live - In Progress')) {
    throw new Error('BoxScore is from game in progress. All games should be complete.')
  }

  stateService.loadStateSlices(teams, players, rosters, schedules, boxScores);
  return true;
};
