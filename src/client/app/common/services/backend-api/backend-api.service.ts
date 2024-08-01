import {Injectable, isDevMode} from '@angular/core';
import {ApiService} from "../api-services/api.service";
import {TeamSchedule} from "../../model/team-schedule.interface";
import {map} from "rxjs/operators";
import {first, Observable} from "rxjs";
import {Slates} from "../../../Slate/data-access/slate.model";
import {Team, Teams} from "../../model/team.interface";
import {BoxScore} from "../../model/box-score.interface";
import {Roster, RosterPlayer} from "../../model/roster.interface";
import {HttpOptions} from "../../model/http-options.model";

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  serverUrl: string = isDevMode() ? 'http://localhost:3000/' : 'https://mlb-picks-9d2945b4c1f1.herokuapp.com/';
  constructor(private apiService: ApiService) {}

  addSchedules(schedules: TeamSchedule[]): Observable<any> {
    return this.apiService
      .post(this.serverUrl + 'api/schedules', schedules)
      .pipe(first());
  }

  getGameAnalysis(gameId: string) {
    const options: HttpOptions = { params: {type: 'teams'}};
    return this.apiService.get(this.serverUrl + `api/game/${gameId}`);
  }

  // ---------------------------------------------------------------
  // --------------------- Post/Update Domain ----------------------
  // ---------------------------------------------------------------

  updateRosters(rosters: RosterPlayer[]) {
    const options: HttpOptions = { params: {type: 'rosters'}};
    return this.apiService.post<RosterPlayer[]>(this.serverUrl + 'api/domain', rosters, options);
  }

  updateBoxScores(boxScore: BoxScore[]) {
    const options: HttpOptions = { params: {type: 'boxScores'}};
    return this.apiService.post<BoxScore[]>(this.serverUrl + 'api/domain', boxScore, options);
  }

  updateSlates(slates: Slates) {
    const options: HttpOptions = { params: {type: 'slates'}};
    return this.apiService.post<Slates>(this.serverUrl + 'api/domain', slates, options).pipe(first());
  }

  // ---------------------------------------------------------------
  // ------------------------- Get Domain --------------------------
  // ---------------------------------------------------------------

  getTeams(): Observable<Teams> {
    const options: HttpOptions = { params: {type: 'teams'}};
    return this.apiService.get<Team[]>(this.serverUrl + 'api/domain', options)
      .pipe(map((teams: Team[]) => new Teams(teams)));
  }



  getSlates(): Observable<Slates> {
    const options: HttpOptions = { params: {type: 'slates'}};
    return this.apiService.get<Slates>(this.serverUrl + 'api/domain', options);
  }

  getPlayers(): Observable<RosterPlayer[]> {
    return this.apiService.get<RosterPlayer[]>(this.serverUrl + 'api/players');
  }

  getSchedules(): Observable<TeamSchedule[]> {
    return this.apiService.get<TeamSchedule[]>(this.serverUrl + 'api/schedules');
  }

  getRosters(): Observable<Roster[]> {
    return this.apiService.get<Roster[]>(this.serverUrl + 'api/rosters');
  }

  getBoxScores(): Observable<BoxScore[]> {
    return this.apiService.get<BoxScore[]>(this.serverUrl + 'api/boxScores');
  }

  getTeamsArray(): Observable<Team[]> {
    return this.apiService.get<Team[]>(this.serverUrl + 'api/teams');
  }
}
