import { Injectable } from '@angular/core';
import {ApiService} from "../api-services/api.service";
import {TeamSchedule} from "../../model/team-schedule.interface";
import {map} from "rxjs/operators";
import {first} from "rxjs";
import {Slates} from "../../../Slate/data-access/slate.model";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  private url: string = environment.apiUrl;
  constructor(private apiService: ApiService) {}

  getSchedules() {
    return this.apiService.get<{schedules: TeamSchedule[]}>(this.url + 'api/schedules')
      .pipe(
        map(({schedules}: {schedules: TeamSchedule[]}) => schedules),
      );
  }

  getSlates() {
    return this.apiService.get<{slates: Slates}>(this.url + 'api/slates')
      .pipe(
        map(({slates}: {slates: Slates}) => slates),
      );
  }

  addSchedules(schedules: TeamSchedule[]) {
    this.apiService
      .post(this.url + 'api/schedules', schedules)
      .pipe(first())
      .subscribe(value => {
      console.log('addSchedules: ', value);
    });
  }

  updateSlates(slates: Slates) {
    return this.apiService.post(this.url + 'api/slates', slates).pipe(first());
  }
}
