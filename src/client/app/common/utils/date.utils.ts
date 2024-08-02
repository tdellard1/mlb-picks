export function getDateObject(dateGiven: string): Date {
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
