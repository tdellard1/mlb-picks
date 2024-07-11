import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {Tank01ApiService} from "../services/api-services/tank01-api.service";
import {Team, Teams} from "../model/team.interface";
import {map} from "rxjs/operators";
import {BoxScore} from "../model/box-score.interface";
import {Roster, RosterPlayer} from "../model/roster.interface";
import {UpdateStateSlice} from "../services/update-state-slice.service";
import {Player} from "../model/players.interface";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  // const updateStateSlice: UpdateStateSlice = inject(UpdateStateSlice);
  const backendApiService: BackendApiService = inject(BackendApiService);
  // const tank01ApiService: Tank01ApiService = inject(Tank01ApiService);
  const stateService: StateService = inject(StateService);

  const teams: Team[] = await firstValueFrom(backendApiService.getTeams().pipe(map(({teams}: Teams) => teams)));
  const players: RosterPlayer[] = await firstValueFrom(backendApiService.getPlayers());
  const rosters: Roster[] = await firstValueFrom(backendApiService.getRosters());
  const schedules = await firstValueFrom(backendApiService.getSchedules());
  const boxScores: BoxScore[] = await firstValueFrom(backendApiService.getBoxScoresOnly());

  // updateStateSlice.getYesterdaysBoxScores(boxScores);
  stateService.loadStateSlices(teams, players, rosters, schedules, boxScores);

  return true;
};
