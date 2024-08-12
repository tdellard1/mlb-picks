import {Injectable, isDevMode} from '@angular/core';
import {ApiService} from "../api-services/api.service.js";
import {map, mergeAll, tap, toArray} from "rxjs/operators";
import {first, Observable} from "rxjs";
import {Slates} from "../../../features/Slate/data-access/slate.model.js";
import {Team} from "../../../common/model/team.interface.js";
import {Roster, RosterPlayer} from "../../../common/model/roster.interface.js";
import {HttpOptions} from "../../../common/model/http-options.model.js";
import {NoRunsFirstInningElements} from "../../../features/Props/feature/props/props.component.js";
import {Teams} from "../../../common/model/game.interface.js";
import {BoxScore} from "../../../common/model/box-score.interface.js";
import {Hitting} from "../../../common/model/team-stats.interface.js";

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

  getRosters(teams: string[]): Observable<Roster[]> {
    const options: HttpOptions = {params: {teams}};
    return this.apiService.get<Roster[]>(this.serverUrl + 'api/rosters/teams', options);
  }

  getPitcherNRFIData(playerIds: string[]): Observable<NoRunsFirstInningElements[]> {
    const options: HttpOptions = {params: {playerIds}};
    return this.apiService.get<NoRunsFirstInningElements[]>(this.serverUrl + 'api/players/pitchers', options);
  }

  getTeamsNRFIData(): Observable<TeamsNRFIPercentage> {
    return this.apiService.get<TeamsNRFIPercentage>(this.serverUrl + 'api/teams/nrfi');
  }

  getBoxScoreForTeams(teams: string[]): Observable<Teams<BoxScore[]>> {
    const options: HttpOptions = {params: {teams}};
    return this.apiService.get(this.serverUrl + 'api/boxScores/teams', options)
      .pipe(
        map(({away, home}: Teams<BoxScore[]>) => {
          const awayBoxScores: BoxScore[] = away.map((boxScore: any) => new BoxScore(boxScore));
          const homeBoxScores: BoxScore[] = home.map((boxScore: any) => new BoxScore(boxScore));

          return {away: awayBoxScores, home: homeBoxScores};
        })
      );
  }

  getTeamStatsForTeams(teams: string[], source: string): Observable<Hitting> {
    const options: HttpOptions = {params: {teams, source}};
    return this.apiService.get(this.serverUrl + 'api/boxScores/teamStats', options);
  }
}

export declare type TeamsNRFIPercentage = {[team: string]: string};