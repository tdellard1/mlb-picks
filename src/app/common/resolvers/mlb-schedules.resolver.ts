import {ResolveFn} from '@angular/router';
import {first, Observable} from "rxjs";
import {TeamSchedule} from "../model/team-schedule.interface";
import {inject} from "@angular/core";
import {BackendApiService} from "../services/backend-api/backend-api.service";
import {map} from "rxjs/operators";
import {combineLatest} from "rxjs";
import {MLBTeamSchedule} from "../../Analysis/data-access/mlb-team-schedule.model";
import {BoxScore} from "../model/box-score.interface";
import {Game} from "../model/game.interface";

export const mlbSchedulesResolver: ResolveFn<MLBTeamSchedule[]>  = (): Observable<MLBTeamSchedule[]> => {
  const backendApiService: BackendApiService = inject(BackendApiService);

  /**
   * Schedule Only with no Box Scores
   **/
  // return backendApiService.getSchedules().pipe(
  //   mergeAll(),
  //   map((schedule: TeamSchedule) => new MLBTeamSchedule(schedule)),
  //   toArray()
  // );

  const schedules$: Observable<TeamSchedule[]> = backendApiService.getSchedules();
  const boxScores$: Observable<BoxScore[]> = backendApiService.getSchedules()
    .pipe(
      map((teamSchedules: TeamSchedule[]) => {
        const allGames: Game[] = teamSchedules.map((teamSchedule: TeamSchedule) => teamSchedule.schedule).flat();
        const allBoxScores: any[] = allGames
          .filter((game: Game) => game.boxScore !== undefined)
          .map((game: Game) => game.boxScore);
        return allBoxScores.filter(Boolean);
      })
    );

  return combineLatest([schedules$, boxScores$]).pipe(
    first(),
    map(([teamSchedules, boxScores]: [TeamSchedule[], BoxScore[]]): TeamSchedule[] => {
      const listOfUniqueGameIDs: Set<string> = new Set(boxScores.map(({gameID}) => gameID));
      return teamSchedules.map((teamSchedule: TeamSchedule) => {
        teamSchedule.schedule = teamSchedule.schedule.map((game: Game) => {
          // We don't want the game to already have a box score
          if (listOfUniqueGameIDs.has(game.gameID) && !game.boxScore) {
            game.boxScore = boxScores.find(({gameID}) => gameID === game.gameID)!;
          }

          return game;
        });

        return teamSchedule;
      });
    }),
    map((teamSchedules: TeamSchedule[]) => teamSchedules.map((teamSchedule: TeamSchedule) => new MLBTeamSchedule(teamSchedule))),
  );
};
