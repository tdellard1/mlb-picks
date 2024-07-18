import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {Team, Teams} from "../model/team.interface";
import {RosterPlayer} from "../model/roster.interface";
import {TeamSchedule} from "../model/team-schedule.interface";
import {db, IBoxScore} from "../../../../db";
import {liveQuery} from "dexie";
import {Player} from "../model/players.interface";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const stateService: StateService = inject(StateService);
  const backendApiService: BackendApiService = inject(BackendApiService);

  const boxScores$: any = liveQuery<IBoxScore[]>(() => db.boxScores.toArray());
  const rosterPlayers$: any = liveQuery<RosterPlayer[]>(() => db.rosterPlayers.toArray());
  const teams$: any = liveQuery<Team[]>(() => db.teams.toArray());
  const schedules$: any = liveQuery<TeamSchedule[]>(() => db.schedules.toArray());
  const allPlayers$: any = liveQuery<Player[]>(() => db.allPlayers.toArray());
  let
    boxScores: IBoxScore[],
    rosterPlayers: RosterPlayer[],
    schedules: TeamSchedule[],
    players: RosterPlayer[],
    teamList: Team[],
    teams: Teams = {} as Teams;

  boxScores = await firstValueFrom(boxScores$);

  if (boxScores.length === 0) {
    console.log('need to add boxScores to indexedDB...')
    boxScores = await firstValueFrom(backendApiService.getBoxScores());
    db.boxScores.bulkAdd(boxScores);
  }

  rosterPlayers = await firstValueFrom(rosterPlayers$);

  if (rosterPlayers.length === 0) {
    console.log('need to add rosterPlayers to indexedDB...')
    rosterPlayers = await firstValueFrom(backendApiService.getRosters());
    db.rosterPlayers.bulkAdd(rosterPlayers);
  }

  teamList = await firstValueFrom(teams$);

  if (teamList.length === 0) {
    console.log('need to add teams to indexedDB...')
    teams = await firstValueFrom(backendApiService.getTeams());
    db.teams.bulkAdd(teams.teams);
  }

  schedules = await firstValueFrom(schedules$);
  console.log('schedules: ', schedules);

  if (schedules.length === 0) {
    console.log('need to add schedules to indexedDB...');
    schedules = await firstValueFrom(backendApiService.getSchedules());
    db.schedules.bulkAdd(schedules);
  }

  players = await firstValueFrom(allPlayers$);

  if (players.length === 0) {
    console.log('need to add players to indexedDB...')
    players = await firstValueFrom(backendApiService.getPlayers());
    db.allPlayers.bulkAdd(players);
  }

  stateService.loadStateSlices(teamList || teams.teams, players, rosterPlayers, schedules, boxScores);

  return true;
};
