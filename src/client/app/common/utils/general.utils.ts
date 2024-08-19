import {PlayerStats} from "../interfaces/player-stats";
import {TeamAnalytics, Schedule} from "../interfaces/team-schedule.interface";

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


