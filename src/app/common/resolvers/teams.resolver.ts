import {ResolveFn} from '@angular/router';
import {Teams} from "../model/team.interface";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {BackendApiService} from "../services/backend-api/backend-api.service";

export const teamsResolver: ResolveFn<Teams> = (): Observable<Teams> => {
  return inject(BackendApiService).getTeams()
};

