import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {DatePipe} from "@angular/common";
import {ApiService} from "./api-services/api.service";
import {map} from "rxjs/operators";
import {Odds} from "../model/odds.interface";
import {ensure} from "../utils/array.utils";

@Injectable({providedIn: 'root'})
export class OddsService {
  private readonly GET_BETTING_ODDS_PATH: string = 'getMLBBettingOdds';

  constructor(private apiService: ApiService,
              private datePipe: DatePipe) {}

  getBettingOdds(): Observable<Array<Odds>> {
    const gameDate: string = ensure(this.datePipe.transform(new Date(), 'yyyyMMdd'));
    const playerProps: boolean = false;

    // const odds: Array<Odds> | null = JSON.parse(localStorage.getItem('odds') || '[]');
    const odds: Array<Odds> = [];

    return odds?.length ? of(odds) : this.apiService.get<{ body: Odds[] }>(this.GET_BETTING_ODDS_PATH, {
      params: {gameDate, playerProps}
    })
      .pipe(map((value: { body: Odds[] }) => {
        console.log('odds?: ', value);
        return value.body || [];
      }));
  }
}
