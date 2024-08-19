import {getDateObject} from "./date.utils";
import {Game} from "../interfaces/game";
import {Schedule} from "../interfaces/team-schedule.interface";

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

export function getScheduleWithNMostRecentGames(schedule: Schedule, n: number): Schedule {
  schedule.schedule = getNMostRecentGames(schedule.schedule, n);
  return schedule;
}
