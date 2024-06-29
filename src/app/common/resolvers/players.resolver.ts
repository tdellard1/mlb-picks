import {ResolveFn} from '@angular/router';
import {Player} from "../model/players.interface";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {ApiService} from "../services/api-services/api.service";
import {map} from "rxjs/operators";

export const playersResolver: ResolveFn<Player[]> = (): Observable<Player[]> => {
  return inject(ApiService).get<{players: Player[]}>('http://localhost:3000/api/players')
    .pipe(
      map(({players}: {players: Player[]}) => players)
    );
};
