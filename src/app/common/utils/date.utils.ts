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

export class Tank01DateTime {
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

export class Tank01Date {
  _date: Date

  constructor(yyyyMMdd: string) {
    const formattedDate = yyyyMMdd.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');

    this._date = new Date(formattedDate);
  }

  get timeStamp() {
    return this._date.getTime();
  }
}
