import {PlayerStats} from "../model/player-stats.interface";
import {TeamAnalytics, TeamSchedule} from "../model/team-schedule.interface";

export function countKeys(t: any): any {
  switch (t?.constructor) {
    case Object:
      return Object
        .values(t)
        .reduce((r: any, v: any) => r + 1 + countKeys(v), 0)
    case Array:
      return t
        .reduce((r: any, v: any) => r + countKeys(v), 0)
    default:
      return 0
  }
}

export function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

export function roundToDecimalPlace(number: number, decimal: number): number {
  return Number(number.toFixed(decimal));
}

export function deepCopy<T>(value: any): any {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function convertMapToArray<T>(map: Map<string, T>): T[] {
  const returnArray: Array<T> = [];
  map.forEach((item) => returnArray.push(item));
  return returnArray;
}

export function convertArrayToMapFaster<T>(array: any[], prop: string): Map<string, T> {
  const returnMap: Map<string, T> = new Map();
  const arrayLength: number = array.length;

  for (let i: number = 0; i < arrayLength; i++) {
    returnMap.set(array[i][prop], array[i]);
  }

  return returnMap;
}

export function convertPlayerStatsArrayToMap(playerStats: PlayerStats[]): Map<string, PlayerStats> {
  const returnMap: Map<string, PlayerStats> = new Map();
  const playerStatsLength: number = playerStats.length;

  for (let i: number = 0; i < playerStatsLength; i++) {
    const playerStat: PlayerStats = playerStats[i];

    returnMap.set(`${playerStat.playerID}:${playerStat.gameID}`, playerStat);
  }

  return returnMap;
}

export function createAnalyticsFromSchedule(teamSchedules: Map<string, TeamSchedule>): Map<string, TeamAnalytics> {
  const returnMap: Map<string, TeamAnalytics> = new Map();

  for (const [team, {schedule}] of teamSchedules) {
    const teamAnalytics: TeamAnalytics = new TeamAnalytics(team, schedule);

    returnMap.set(team, teamAnalytics);
  }

  return returnMap;
}


