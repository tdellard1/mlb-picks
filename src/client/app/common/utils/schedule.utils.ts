import {Game} from "../model/game.interface";
import {getDateObject} from "./date.utils";
import {TeamSchedule} from "../model/team-schedule.interface";
import {BoxScore} from "../model/box-score.interface";
import {ensure} from "./array.utils";

export function isGameBeforeToday(game: Game): boolean {
  const beginningOfToday: number = new Date().setHours(0, 0, 0, 0);
  const dateOfGame: number = getDateObject(game.gameDate).getTime();

  return dateOfGame < beginningOfToday;
}

export function nonSuspendedGames({gameStatus}: Game): boolean {
  return gameStatus !== 'Suspended';
}

export function nonPostponedGames({gameStatus}: Game): boolean {
  return gameStatus !== 'Postponed';
}

export function getGamesBeforeToday(games: Game[]): Game[] {
  return games.
  filter(nonPostponedGames).
  filter(nonSuspendedGames).
  filter(isGameBeforeToday);
}

export function getNMostRecentGames(games: Game[], n: number): Game[] {
  return getGamesBeforeToday(games).reverse().slice(0, n);
}

export function getScheduleWithNMostRecentGames(schedule: TeamSchedule, n: number): TeamSchedule {
  schedule.schedule = getNMostRecentGames(schedule.schedule, n);
  return schedule;
}

export function getScheduleWith15MostRecentGames(schedule: TeamSchedule): TeamSchedule {
  return getScheduleWithNMostRecentGames(schedule, 15);
}


export function addBoxScoresToSchedule(schedules: TeamSchedule[], boxScores: BoxScore[]): TeamSchedule[] {
  const gameIDsFromBoxScores: string[] = boxScores.map(({gameID}: BoxScore) => gameID);

  return schedules.map((schedule: TeamSchedule) => {
    schedule.schedule = schedule.schedule.map((game: Game) => {
      if (gameIDsFromBoxScores.includes(game.gameID)) {
        game.boxScore = ensure(boxScores.find(boxScore => boxScore.gameID === game.gameID));
      }

      return game;
    });
    return schedule;
  });
}

export function getGamesWithoutBoxScores(schedules: TeamSchedule[]): string[] {
  const allGames: Game[] = schedules.map((teamSchedule: TeamSchedule) => {
    return teamSchedule.schedule
  }).flat();

  return allGames
    .filter((game: Game) => game.boxScore === undefined)
    .map((game: Game) => game.gameID);
}
