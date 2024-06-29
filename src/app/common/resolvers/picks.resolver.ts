import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {map} from "rxjs/operators";
import {ApiService} from "../services/api-services/api.service";
import {AbstractControl, FormControl} from "@angular/forms";

export const picksResolver: ResolveFn<any> = () => {
  return inject(ApiService).get<{picks: Picks[]}>('http://localhost:3000/api/picks')
    .pipe(
      map(({picks}: {picks: Picks[]}) => picks),
      // c
    );
};

export interface Picks {
  [date: string]: Analysts;
}

export interface Analysts {
  analysts: Analyst[]
}

export interface Analyst {
  firstName: string;
  picks: GamePick[];
}

export interface GamePick {
  gameID: string;
  pick: string;
}

export interface Slate {
  [date: string]: Expert[];
}

export interface Expert {
  name: string;
  predictions: GamePick[];
}

export interface GamePick {
  gameID: string;
  prediction: string;
  correct: boolean;
}


