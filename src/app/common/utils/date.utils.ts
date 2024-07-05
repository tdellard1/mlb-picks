// ex: 20240425
import {Game} from "../model/game.interface";

export function getDateObject<T>(dateGiven: string): Date {
  const YEAR_START_INDEX = 0;
  const YEAR_END_INDEX = 4;

  const MONTH_START_INDEX = 4;
  const MONTH_END_INDEX = 6;

  const DAY_START_INDEX = 6;
  const DAY_END_INDEX = 8;

  const year: string = dateGiven.slice(YEAR_START_INDEX, YEAR_END_INDEX);
  const month: string = dateGiven.slice(MONTH_START_INDEX, MONTH_END_INDEX);
  const day: string = dateGiven.slice(DAY_START_INDEX, DAY_END_INDEX);

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export function getStartTimeString(time: string): string {
  const gameTimeData: string[] = time.split(':');

  const h: number = Number(gameTimeData[0]);
  const hour: string = (h - 1).toString();
  const minute: string = gameTimeData[1].slice(0, -1);
  const meridiem: string = gameTimeData[1].slice(-1);
  const readableMeridiem: string = meridiem === 'p' ? 'PM' : 'AM';


  return `${hour}:${minute} ${readableMeridiem}`;
}

export function getStartTimeDate(time: string) {
  const gameTimeData: string[] = time.split(':');
  const meridiem: string = gameTimeData[1].slice(-1);

  const h: number = Number(meridiem === 'p' ? Number(gameTimeData[0]) + 12 : gameTimeData[0]);
  const m: number = Number(gameTimeData[1].slice(0, -1));
  const d: Date = new Date();

  d.setHours(h);
  d.setMinutes(m);

  return d;
}

export function getStartTimeAsNumber({gameTime}: Game) {
  return getStartTimeDate(gameTime).getTime();
}

export function getDateString(yyyyMMdd: string): string {
  const year = yyyyMMdd.substring(0, 4);
  const month = yyyyMMdd.substring(4, 6);
  const day = yyyyMMdd.substring(6, 8);

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.toDateString();
}

export class Tank01Date {
  _date: Date

  constructor(yyyyMMdd: string, time: string) {
    const timeStringArray: string[] = time.split(':');
    const formattedDate = yyyyMMdd.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');

    const hour: string = timeStringArray.at(0)!;
    const minute: string = timeStringArray.at(1)!.slice(0, -1);
    const meridiem: string = timeStringArray.at(1)!.slice(2);

    const hourMeridiemAdjusted: number = meridiem === 'p' ? Number(hour) + 12 : Number(hour);

    this._date = new Date(formattedDate);
    this._date.setHours(hourMeridiemAdjusted, Number(minute));
  }

  get timeStamp() {
    return this._date.getTime();
  }
}
