export class SlateDateDetails {
  private readonly _display: string;
  private readonly _timestamp: number;

  constructor(yyyyMMdd: string) {
    const year: string = yyyyMMdd.substring(0, 4);
    const month: string = yyyyMMdd.substring(4, 6);
    const day: string = yyyyMMdd.substring(6, 8);

    const date = new Date(Number(year), Number(month) - 1, Number(day));
    this._display = date.toDateString();
    this._timestamp = date.getTime();
  }


  get display(): string {
    return this._display;
  }

  get timestamp(): number {
    return this._timestamp;
  }
}
