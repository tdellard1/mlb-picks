import { Injectable } from '@angular/core';
import {ApiService} from "../api-services/api.service";
import {TeamSchedule} from "../../model/team-schedule.interface";
import {map} from "rxjs/operators";
import {first} from "rxjs";
import {Slates} from "../../../Slate/data-access/slate.model";

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  constructor(private apiService: ApiService) {}

  getSchedules() {
    return this.apiService.get<{schedules: TeamSchedule[]}>('http://localhost:3000/api/schedules')
      // .pipe(
      //   map(({schedules}: {schedules: TeamSchedule[]}) => schedules),
      // );
  }

  getSlates() {
    return this.apiService.get<{slates: Slates}>('http://localhost:3000/api/slates')
      .pipe(
        map(({slates}: {slates: Slates}) => slates),
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

  updateSlates(slates: Slates) {
    return this.apiService.post('http://localhost:3000/api/slates', slates).pipe(first());
  }
}
