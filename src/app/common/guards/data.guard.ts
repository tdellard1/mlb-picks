import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {firstValueFrom} from "rxjs";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {StateService} from "../services/state.service";
import {Team} from "../model/team.interface";
import {BoxScore} from "../model/box-score.interface";
import {RosterPlayer} from "../model/roster.interface";
import {UpdateStateService} from "../services/update-state-slice.service";
import {LastUpdatedService} from "../services/last-updated.service";
import {TeamSchedule} from "../model/team-schedule.interface";
import {LoggerService} from "../services/logger.service";

export const dataGuard: CanActivateFn = async (): Promise<boolean> => {
  const updateStateService: UpdateStateService = inject(UpdateStateService);
  const backendApiService: BackendApiService = inject(BackendApiService);
  const lastUpdatedService: LastUpdatedService = inject(LastUpdatedService);
  const stateService: StateService = inject(StateService);
  const logger: LoggerService = inject(LoggerService);

  const teams: Team[] = await firstValueFrom(backendApiService.getTeamsArray());
  const allPlayers: RosterPlayer[] = await firstValueFrom(backendApiService.getPlayers());
  const rosterPlayers: RosterPlayer[] = await firstValueFrom(backendApiService.getRosters());
  const schedules: TeamSchedule[] = await firstValueFrom(backendApiService.getSchedules());
  const boxScores: BoxScore[] = await firstValueFrom(backendApiService.getBoxScores());

  if (lastUpdatedService.refresh) {
    logger.info('Retrieving boxScores for Day Before...');
    updateStateService.getYesterdaysBoxScores(boxScores)
      .subscribe((newBoxScores: BoxScore[]) => {
      boxScores.push(...newBoxScores);
      backendApiService.updateBoxScores(boxScores).subscribe(console.log);
      stateService.loadStateSlices(teams, allPlayers, rosterPlayers, schedules, boxScores);
    });
  } else {
    stateService.loadStateSlices(teams, allPlayers, rosterPlayers, schedules, boxScores);
  }

  return true;
};
