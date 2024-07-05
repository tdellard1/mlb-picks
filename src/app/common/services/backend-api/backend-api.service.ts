import {Injectable, isDevMode} from '@angular/core';
import {ApiService} from "../api-services/api.service";
import {TeamSchedule} from "../../model/team-schedule.interface";
import {map} from "rxjs/operators";
import {first, Observable} from "rxjs";
import {Slates} from "../../../Slate/data-access/slate.model";
import {Player} from "../../model/players.interface";
import {Team, Teams} from "../../model/team.interface";

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  serverUrl: string = isDevMode() ? 'http://localhost:3000/' : 'https://mlb-picks-9d2945b4c1f1.herokuapp.com/';
  constructor(private apiService: ApiService) {}

  getSchedules(): Observable<TeamSchedule[]> {
    return this.apiService.get<{schedules: TeamSchedule[]}>(this.serverUrl + 'api/schedules')
      .pipe(
        map(({schedules}: {schedules: TeamSchedule[]}) => schedules),
      );
  }

  getBoxScores(): Observable<TeamSchedule[]> {
    return this.apiService.get<{boxScore: TeamSchedule[]}>(this.serverUrl + 'api/boxScore')
      .pipe(map(({boxScore}: {boxScore: TeamSchedule[]}) => boxScore));
  }

  getPlayers(): Observable<Player[]> {
    return this.apiService.get<{players: Player[]}>(this.serverUrl + 'api/players')
      .pipe(map(({players}: {players: Player[]}) => players));
  }

  getTeams(): Observable<Teams> {
    return this.apiService.get<{teams: Team[]}>(this.serverUrl + 'api/teams')
      .pipe(map(({teams}: {teams: Team[]}) => new Teams(teams)));
  }

  updateBoxScore(boxScore: TeamSchedule[]) {
    return this.apiService.post(this.serverUrl + 'api/boxScore', boxScore);
  }

  getSlates() {
    return this.apiService.get<{slates: Slates}>(this.serverUrl + 'api/slates')
      .pipe(
        map(({slates}: {slates: Slates}) => slates),
      );
  }

  addSchedules(schedules: TeamSchedule[]) {
    this.apiService
      .post(this.serverUrl + 'api/schedules', schedules)
      .pipe(first())
      .subscribe(value => {
      console.log('addSchedules: ', value);
    });
  }

  updateSlates(slates: Slates) {
    return this.apiService.post('api/slates', slates).pipe(first());
  }
}
