import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {Game} from "../../../../common/model/game.interface.js";
import {BackendApiService} from "../../../../core/services/backend-api/backend-api.service.js";
import {inject} from "@angular/core";
import {NoRunsFirstInningElements} from "../../../Props/feature/props/props.component.js";

export const pitcherResolver: ResolveFn<NoRunsFirstInningElements[]> = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const backendApiService: BackendApiService = inject(BackendApiService);

  const dailySchedule: Game[] = activatedRouteSnapshot.parent!.data['dailySchedule'];
  const pitcherIds: string[] = dailySchedule.map(({probableStartingPitchers}) => {
    const playerIDs: string[] = [];
    if (probableStartingPitchers.away) {
      playerIDs.push(probableStartingPitchers.away);
    }

    if (probableStartingPitchers.home) {
      playerIDs.push(probableStartingPitchers.home);
    }

    return playerIDs;
  }).flat();

  return backendApiService.getPitcherNRFIData(pitcherIds);
};