import {Injectable, isDevMode} from '@angular/core';
import {ApiService} from "../api-services/api.service";
import {TeamSchedule} from "../../model/team-schedule.interface";
import {map, tap} from "rxjs/operators";
import {first, Observable} from "rxjs";
import {Slates} from "../../../Slate/data-access/slate.model";
import {Team, Teams} from "../../model/team.interface";
import {BoxScore} from "../../model/box-score.interface";
import {RosterPlayer} from "../../model/roster.interface";

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  serverUrl: string = isDevMode() ? 'http://localhost:3000/' : 'https://mlb-picks-9d2945b4c1f1.herokuapp.com/';
  constructor(private apiService: ApiService) {}

  getSchedules(): Observable<TeamSchedule[]> {
    return this.apiService.get<TeamSchedule[]>(this.serverUrl + 'api/schedules');
  }

  getRosters(): Observable<RosterPlayer[]> {
    return this.apiService.get<RosterPlayer[]>(this.serverUrl + 'api/rosters');
  }

  getBoxScores(): Observable<BoxScore[]> {
    return this.apiService.get<BoxScore[]>(this.serverUrl + 'api/boxScores');
  }

  getPlayers(): Observable<RosterPlayer[]> {
    return this.apiService.get<RosterPlayer[]>(this.serverUrl + 'api/players');
  }

  getTeamsArray(): Observable<Team[]> {
    return this.apiService.get<Team[]>(this.serverUrl + 'api/teams');
  }

  getTeams(): Observable<Teams> {
    return this.apiService.get<Team[]>(this.serverUrl + 'api/teams')
      .pipe(map((teams: Team[]) => new Teams(teams)));
  }

  getSlates(): Observable<Slates> {
    return this.apiService.get<Slates>(this.serverUrl + 'api/slates');
  }

  addSchedules(schedules: TeamSchedule[]): Observable<any> {
    return this.apiService
      .post(this.serverUrl + 'api/schedules', schedules)
      .pipe(first());
  }

  updateRosters(rosters: any []) {
    return this.apiService.post(this.serverUrl + 'api/rosters', rosters);
  }

  updateBoxScores(boxScore: BoxScore[]) {
    return this.apiService.post<BoxScore[]>(this.serverUrl + 'api/boxScores', boxScore);
  }

  updateSlates(slates: Slates) {
    return this.apiService.post(this.serverUrl + 'api/slates', slates).pipe(first());
  }

  updateState(schedules: TeamSchedule[]) {
    return this.apiService.post<TeamSchedule[]>(this.serverUrl + 'api/state', schedules).pipe(first());
  }
}
