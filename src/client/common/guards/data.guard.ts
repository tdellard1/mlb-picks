import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {firstValueFrom, switchMap} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {Team, Teams} from "../model/team.interface";
import {RosterPlayer} from "../model/roster.interface";
import {TeamSchedule} from "../model/team-schedule.interface";
import {db, IBoxScore} from "../../../../db";
import {liveQuery} from "dexie";
import {Player} from "../model/players.interface";
import {UpdateStateService} from "../services/update-state-slice.service";
import {map} from "rxjs/operators";
import {BoxScore} from "../model/box-score.interface";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const stateService: StateService = inject(StateService);
  const backendApiService: BackendApiService = inject(BackendApiService);
  const updateStateService: UpdateStateService = inject(UpdateStateService);


  const boxScoreCountFromRedis: { count: number } = await firstValueFrom(backendApiService.getBoxScoresCount());
  const teamsCountFromRedis: { count: number } = await firstValueFrom(backendApiService.getTeamsCount());
  const rosterPlayersCountFromRedis: { count: number } = await firstValueFrom(backendApiService.getRosterPlayersCount());
  const playersCountFromRedis: { count: number } = await firstValueFrom(backendApiService.getPlayerCount());
  const schedulesCountFromRedis: { count: number } = await firstValueFrom(backendApiService.getSchedulesCount());

  const boxScores$: any = liveQuery<IBoxScore[]>(() => db.boxScores.toArray());
  const rosterPlayers$: any = liveQuery<RosterPlayer[]>(() => db.rosterPlayers.toArray());
  const teams$: any = liveQuery<Team[]>(() => db.teams.toArray());
  const schedules$: any = liveQuery<TeamSchedule[]>(() => db.schedules.toArray());
  const allPlayers$: any = liveQuery<Player[]>(() => db.allPlayers.toArray());

  let boxScores: IBoxScore[] = await firstValueFrom(boxScores$);
  let rosterPlayers: RosterPlayer[] = await firstValueFrom(rosterPlayers$);
  let schedules: TeamSchedule[] = await firstValueFrom(schedules$);
  let players: RosterPlayer[] = await firstValueFrom(allPlayers$);
  let teamList: Team[] = await firstValueFrom(teams$);

  checkForBoxScoreUpdateNeeds(boxScores);

  if (needsUpdate(boxScoreCountFromRedis, boxScores)) {
    console.log('need to add boxScores to indexedDB...');
    boxScores = await firstValueFrom(backendApiService.getBoxScores());
    await db.boxScores.clear();
    await db.boxScores.bulkAdd(boxScores);
  }

  if (needsUpdate(rosterPlayersCountFromRedis, rosterPlayers)) {
    console.log('need to add rosterPlayers to indexedDB...')
    rosterPlayers = await firstValueFrom(backendApiService.getRosters());
    await db.rosterPlayers.clear();
    await db.rosterPlayers.bulkAdd(rosterPlayers);
  }

  if (needsUpdate(teamsCountFromRedis, teamList)) {
    console.log('need to add teams to indexedDB...')
    const newTeams: Teams = await firstValueFrom(backendApiService.getTeams());
    teamList = newTeams.teams;
    await db.teams.clear();
    await db.teams.bulkAdd(teamList);
  }

  if (needsUpdate(schedulesCountFromRedis, schedules)) {
    console.log('need to add schedules to indexedDB...');
    schedules = await firstValueFrom(backendApiService.getSchedules());
    await db.schedules.clear();
    await db.schedules.bulkAdd(schedules);
  }

  if (needsUpdate(playersCountFromRedis, players)) {
    console.log('need to add players to indexedDB...')
    players = await firstValueFrom(backendApiService.getPlayers());
    await db.allPlayers.clear();
    await db.allPlayers.bulkAdd(players);
  }

  stateService.loadStateSlices(teamList, players, rosterPlayers, schedules, boxScores);
  return true;

  function needsUpdate({count}: {count: number}, valueFromIndexedDB: any[]): boolean {
    if (count === 0 || valueFromIndexedDB.length === 0) return true;
    return count !== valueFromIndexedDB.length;
  }

  function checkForBoxScoreUpdateNeeds(previousBoxScores: BoxScore[]) {
    const lastUpdatedString: string | null = localStorage.getItem('lastUpdated');
    let lastUpdated: number = 0;
    if (lastUpdatedString !== null) {
      lastUpdated = Number(lastUpdatedString);
    }

    const today = new Date().setHours(0, 0, 0, 0);

    // if (lastUpdated < today) {
    //   updateStateService.getBoxScoresForDate('20240714').pipe(
    //     map((boxScores: BoxScore[]) => {
    //       boxScores.push(...previousBoxScores);
    //       return boxScores;
    //     }),
    //     switchMap((boxScores: BoxScore[]) => {
    //       console.log(boxScores.length, previousBoxScores.length);
    //       return backendApiService.updateBoxScores(boxScores);
    //     })
    //   )
    //     .subscribe((value) => {
    //       console.log('updated boxScores', value);
    //     });
    // }
  }
};

