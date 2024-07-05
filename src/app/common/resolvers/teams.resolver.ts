import {ResolveFn} from '@angular/router';
import {Team, Teams} from "../model/team.interface";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {ApiService} from "../services/api-services/api.service";
import {map} from "rxjs/operators";
import {environment} from "../../../environments/environment";

export const teamsResolver: ResolveFn<Teams> = (): Observable<Teams> => {
  return inject(ApiService).get<{teams: Team[]}>(environment.apiUrl + 'api/teams')
    .pipe(
      map(({teams}: {teams: Team[]}) => new Teams(teams))
    );
};

