import {Injectable, isDevMode} from '@angular/core';
import {ApiService} from "../api-services/api.service";
import {TeamSchedule} from "../../model/team-schedule.interface";
import {map, tap} from "rxjs/operators";
import {first, Observable} from "rxjs";
import {Slates} from "../../../Slate/data-access/slate.model";
import {Player} from "../../model/players.interface";
import {Team, Teams} from "../../model/team.interface";
import {BoxScore} from "../../model/box-score.interface";

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  serverUrl: string = isDevMode() ? 'http://localhost:3000/' : 'https://mlb-picks-9d2945b4c1f1.herokuapp.com/';
  constructor(private apiService: ApiService) {}

  getSchedules(): Observable<TeamSchedule[]> {
    return this.apiService.get<TeamSchedule[]>(this.serverUrl + 'api/schedules');
  }

  getRosters(): Observable<any> {
    return this.apiService.get<any>(this.serverUrl + 'api/rosters');
  }

  getBoxScores(): Observable<TeamSchedule[]> {
    return this.apiService.get<TeamSchedule[]>(this.serverUrl + 'api/boxScores');
  }

  getBoxScoresOnly(): Observable<BoxScore[]> {
    return this.apiService.get<BoxScore[]>(this.serverUrl + 'api/boxScores/only');
  }

  getPlayers(): Observable<Player[]> {
    return this.apiService.get<Player[]>(this.serverUrl + 'api/players');
  }

  getTeams(): Observable<Teams> {
    return this.apiService.get<Team[]>(this.serverUrl + 'api/teams')
      .pipe(map((teams: Team[]) => new Teams(teams)));
  }

  getSlates(): Observable<Slates> {
    return this.apiService.get<Slates>(this.serverUrl + 'api/slates');
  }

  addSchedules(schedules: TeamSchedule[]) {
    this.apiService
      .post(this.serverUrl + 'api/schedules', schedules)
      .pipe(first())
      .subscribe(value => {
      console.log('addSchedules: ', value);
    });
  }

  updateRosters(rosters: any []) {
    return this.apiService.post(this.serverUrl + 'api/rosters', rosters);
  }

  updateBoxScoresOnly(boxScores: BoxScore[]) {
    return this.apiService.post(this.serverUrl + 'api/boxScores/only', boxScores);
  }

  updateBoxScore(boxScore: TeamSchedule[]) {
    return this.apiService.post(this.serverUrl + 'api/boxScores', boxScore);
  }

  updateSlates(slates: Slates) {
    return this.apiService.post(this.serverUrl + 'api/slates', slates).pipe(first());
  }
}
