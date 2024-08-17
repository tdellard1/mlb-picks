import {Game} from "../interfaces/game";

export function dailyScheduleStr(games: Game[]): string {
  const sortedSchedule = games.sort((game1, game2) =>
    Number(game1.gameTime_epoch) - Number(game2.gameTime_epoch));
  return JSON.stringify(sortedSchedule);
}

export function compareTwoSchedules(scheduleOne: Game[], scheduleTwo: Game[]): boolean {
  return dailyScheduleStr(scheduleOne) === dailyScheduleStr(scheduleTwo);
}

export function getStartingPitchers(schedule: Game[]): string[] {
  return schedule
    .map(({probableStartingPitchers}: Game) => {
      const {away, home} = probableStartingPitchers;

      return [away, home];
    }).flat().sort();
}
