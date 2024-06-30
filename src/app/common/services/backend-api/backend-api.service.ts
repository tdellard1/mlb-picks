import { Injectable } from '@angular/core';
import {ApiService} from "../api-services/api.service";
import {TeamSchedule} from "../../model/team-schedule.interface";
import {map} from "rxjs/operators";
import {first} from "rxjs";
import {Picks, Slate} from "../../resolvers/picks.resolver";

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  constructor(private apiService: ApiService) {}

  getSchedules() {
    return this.apiService.get<{schedules: TeamSchedule[]}>('http://localhost:3000/api/schedules')
      .pipe(
        map(({schedules}: {schedules: TeamSchedule[]}) => schedules),
      );
  }

  addSchedules(schedules: TeamSchedule[]) {
    this.apiService
      .post('http://localhost:3000/api/schedules', schedules)
      .pipe(first())
      .subscribe(value => {
      console.log('addSchedules: ', value);
    });
  }

  updatePicks(picks: Picks) {
    return this.apiService.post('http://localhost:3000/api/picks', picks).pipe(first());
  }

  updateSlates(picks: Slate) {
    const convMap: any = {};

    for (const [date, experts] of picks.dates) {
      convMap[date] = experts;
    }

    // console.log('is this being hit', convMap);
    return this.apiService.post('http://localhost:3000/api/experts', convMap).pipe(first());
  }
}
