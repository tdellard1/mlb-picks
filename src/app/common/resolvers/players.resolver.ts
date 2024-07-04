import {ResolveFn} from '@angular/router';
import {Player} from "../model/players.interface";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {ApiService} from "../services/api-services/api.service";
import {map} from "rxjs/operators";

export const playersResolver: ResolveFn<Player[]> = (): Observable<Player[]> => {
  return inject(ApiService).get<{players: Player[]}>('https://dazzling-canyonlands-93084-106125d12a27.herokuapp.com/api/players')
    .pipe(
      map(({players}: {players: Player[]}) => players)
    );
};
