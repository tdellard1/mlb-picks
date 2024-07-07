import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {Tank01ApiService} from "../services/api-services/tank01-api.service";
import {combineLatest, first, mergeAll, mergeMap, Observable, of, toArray} from "rxjs";
import {map} from "rxjs/operators";
import {TeamSchedule} from "../model/team-schedule.interface";
import {BoxScore} from "../model/box-score.interface";
import {Game} from "../model/game.interface";
import {
  addBoxScoresToSchedule,
  getGamesWithoutBoxScores,
  getScheduleWith15MostRecentGames,
} from "../utils/schedule.utils";
import {BackendApiService} from "../services/backend-api/backend-api.service";

export const dataGuard: CanActivateFn = (): boolean => {
  const tank01ApiService: Tank01ApiService = inject(Tank01ApiService);
  const backendApiService: BackendApiService = inject(BackendApiService);

  const getBoxScores: Observable<BoxScore[]> = backendApiService.getBoxScores()
    .pipe(
      map((teamSchedules: TeamSchedule[]) => {
        const allGames: Game[] = teamSchedules.map((teamSchedule: TeamSchedule) => teamSchedule.schedule).flat();
        const allBoxScores: any[] = allGames
          .filter((game: Game) => game.boxScore !== undefined)
          .map((game: Game) => game.boxScore);
        return allBoxScores.filter(Boolean);
      })
    );
  const getSchedule: Observable<TeamSchedule[]> = backendApiService.getSchedules();

  combineLatest([getSchedule, getBoxScores]).pipe(
    first()
  ).subscribe(([teamSchedules, boxScores]: [TeamSchedule[], BoxScore[]]) => {
    const gameStatuses: string[] = teamSchedules.map(teamSchedule => teamSchedule.schedule)!.flat().map(game => game.gameStatus!);
    const allStatuses = new Set(gameStatuses);
    // console.log('allStatuses: ', allStatuses);



    // Getting games that are before today, if it is a new day, then we get new games and throw away the 16th game.
    const scheduleWithMostRecentGames: TeamSchedule[] = teamSchedules.map(getScheduleWith15MostRecentGames);
    const scheduleWithMostRecentGamesAndSomeBoxScores: TeamSchedule[] = addBoxScoresToSchedule(scheduleWithMostRecentGames, boxScores);
    const gamesWithoutBoxScores: Set<string> = new Set(getGamesWithoutBoxScores(scheduleWithMostRecentGamesAndSomeBoxScores));

    console.log('gamesWithoutBoxScores: ', gamesWithoutBoxScores, gamesWithoutBoxScores.size);
    if (gamesWithoutBoxScores.size > 0) {
      of(gamesWithoutBoxScores).pipe(
        mergeAll(),
        mergeMap((gameID: string) => tank01ApiService.getBoxScoreForGame(gameID)),
        toArray()
      ).subscribe((newBoxScores: BoxScore[]) => {
        const scheduleWithMostRecentGamesAndAllBoxScores: TeamSchedule[] =
          addBoxScoresToSchedule(scheduleWithMostRecentGamesAndSomeBoxScores, newBoxScores);
        const gamesWithoutBoxScores: string[] = getGamesWithoutBoxScores(scheduleWithMostRecentGamesAndSomeBoxScores);

        console.log('gamesWithoutBoxScores: ', gamesWithoutBoxScores, gamesWithoutBoxScores.length);

        backendApiService.updateBoxScore(scheduleWithMostRecentGamesAndAllBoxScores).pipe(first()).subscribe(value => {
          console.log('returned value: ', value);
        });
      });
    }
  })

  return true;
};
