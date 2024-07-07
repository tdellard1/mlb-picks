export class RunsFirstInning {
  private _noRunsFirstInning: number;
  private _yesNoRunsFirstInning: number;
  private _homeNRFI: number;
  private _awayNRFI: number;
  private _homeYRFI: number;
  private _awayYRFI: number;

  constructor() {
    this._noRunsFirstInning = 0;
    this._yesNoRunsFirstInning = 0;
    this._homeNRFI = 0;
    this._awayNRFI = 0;
    this._homeYRFI = 0;
    this._awayYRFI = 0;
  }

  addHomeNRFI() {
    this._homeNRFI++;
  }

  addAwayNRFI() {
    this._awayNRFI++;
  }

  addHomeYRFI() {
    this._homeYRFI++;
  }

  addAwayYRFI() {
    this._awayYRFI++;
  }

  get homeNoRunsFirstInningPct() {
    return Number((this._homeNRFI / (this._homeNRFI + this._homeYRFI) * 100).toFixed(2));
  }

  get homeYesRunsFirstInningPct() {
    return Number((this._homeYRFI / (this._homeNRFI + this._homeYRFI) * 100).toFixed(2));
  }

  get awayNoRunsFirstInningPct() {
    return Number((this._awayNRFI / (this._awayNRFI + this._awayYRFI) * 100).toFixed(2));
  }

  get awayYesRunsFirstInningPct() {
    return Number((this._awayYRFI / (this._awayNRFI + this._awayYRFI) * 100).toFixed(2));
  }
}
