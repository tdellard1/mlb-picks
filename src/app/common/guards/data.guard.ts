import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {Tank01ApiService} from "../services/api-services/tank01-api.service";
import {combineLatest, first, firstValueFrom, mergeAll, mergeMap, Observable, of, toArray} from "rxjs";
import {TeamSchedule} from "../model/team-schedule.interface";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {Player} from "../model/players.interface";
import {Team, Teams} from "../model/team.interface";
import {map} from "rxjs/operators";
import {Roster} from "../model/roster.interface";
import {BoxScore} from "../model/box-score.interface";
import {Game} from "../model/game.interface";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const tank01ApiService: Tank01ApiService = inject(Tank01ApiService);
  const backendApiService: BackendApiService = inject(BackendApiService);
  const stateService: StateService = inject(StateService);

  const players: Player[] = await firstValueFrom(backendApiService.getPlayers());
  const rosters: Roster[] = await firstValueFrom(backendApiService.getRosters());
  const schedules: TeamSchedule[] = await firstValueFrom(backendApiService.getSchedules());
  const teams: Teams = await firstValueFrom(backendApiService.getTeams());
  const boxScores: BoxScore[] = await firstValueFrom(backendApiService.getBoxScoresOnly());

  stateService
    .addBoxScores(boxScores)
    .addRosters(rosters)
    .addTeams(teams.teams)
    .addSchedules(schedules)
    .build();

  return true;
};
