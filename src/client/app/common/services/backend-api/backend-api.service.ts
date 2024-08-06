import {Injectable, isDevMode} from '@angular/core';
import {ApiService} from "../api-services/api.service";
import {map, mergeAll, toArray} from "rxjs/operators";
import {first, Observable} from "rxjs";
import {Slates} from "../../../Slate/data-access/slate.model";
import {Team} from "../../model/team.interface";
import {RosterPlayer} from "../../model/roster.interface";
import {HttpOptions} from "../../model/http-options.model";
import {NoRunsFirstInningElements} from "../../../Props/feature/props/props.component.js";

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  serverUrl: string = isDevMode() ? 'http://localhost:3000/' : 'https://mlb-picks-9d2945b4c1f1.herokuapp.com/';
  constructor(private apiService: ApiService) {}

  getGameAnalysisData(gameId: string): Observable<any> {
    return this.apiService.get(this.serverUrl + `api/analysis/${gameId}`);
  }

  updateSlates(slates: Slates) {
    return this.apiService.post<Slates>(this.serverUrl + 'api/slates', slates).pipe(first());
  }

  // ---------------------------------------------------------------
  // ------------------------- Get Domain --------------------------
  // ---------------------------------------------------------------

  getSlates(): Observable<Slates> {
    return this.apiService.get<Slates>(this.serverUrl + 'api/slates');
  }

  getPlayers(): Observable<RosterPlayer[]> {
    return this.apiService.get<RosterPlayer[]>(this.serverUrl + 'api/players');
  }

  getPlayer(playerId: string): Observable<RosterPlayer> {
    return this.apiService.get<RosterPlayer>(this.serverUrl + `api/players/${playerId}`);
  }

  getTeamsArray(): Observable<Team[]> {
    return this.apiService.get<Team[]>(this.serverUrl + 'api/teams')
      .pipe(
        mergeAll(),
        map((value) => new Team(value)),
        toArray()
      );
  }

  getPitcherNRFIData(playerIds: string[]): Observable<NoRunsFirstInningElements[]> {
    const options: HttpOptions = { params: {playerIds}};
    return this.apiService.get<NoRunsFirstInningElements[]>(this.serverUrl + 'api/players/pitchers', options);
  }

  getTeamsNRFIData(): Observable<TeamsNRFIPercentage> {
    return this.apiService.get<TeamsNRFIPercentage>(this.serverUrl + 'api/teams/nrfi');
  }
}

export declare type TeamsNRFIPercentage = {[team: string]: string};