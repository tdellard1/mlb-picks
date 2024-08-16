export class TeamStatsHitting {
  private _D: string;
  private _T: string;
  private _AB: string;
  private _BB: string;
  private _GIDP: string;
  private _H: string;
  private _HBP: string;
  private _HR: string;
  private _IBB: string;
  private _R: string;
  private _RBI: string;
  private _SAC: string;
  private _SF: string;
  private _SO: string;
  private _TB: string;
  private _avg: string;

  constructor(data: any) {
    this._D = this.assignIfValid(data['2B'], '2B');
    this._T = this.assignIfValid(data['3B'], '3B');
    this._AB = this.assignIfValid(data.AB, 'AB');
    this._BB = this.assignIfValid(data.BB, 'BB');
    this._GIDP = this.assignIfValid(data.GIDP, 'GIDP');
    this._H = this.assignIfValid(data.H, 'H');
    this._HBP = this.assignIfValid(data.HBP, 'HBP');
    this._HR = this.assignIfValid(data.HR, 'HR');
    this._IBB = this.assignIfValid(data.IBB, 'IBB');
    this._R = this.assignIfValid(data.R, 'R');
    this._RBI = this.assignIfValid(data.RBI, 'RBI');
    this._SAC = this.assignIfValid(data.SAC, 'SAC');
    this._SF = this.assignIfValid(data.SF, 'SF');
    this._SO = this.assignIfValid(data.SO, 'SO');
    this._TB = this.assignIfValid(data.TB, 'TB');
    this._avg = data.avg;
  }

  get D(): number {
    return Number(this._D);
  }

  get T(): number {
    return Number(this._T);
  }

  get AB(): number {
    return Number(this._AB);
  }

  get BB(): number {
    return Number(this._BB);
  }

  get GIDP(): number {
    return Number(this._GIDP);
  }

  get H(): number {
    return Number(this._H);
  }

  get HBP(): number {
    return Number(this._HBP);
  }

  get HR(): number {
    return Number(this._HR);
  }

  get IBB(): number {
    return Number(this._IBB);
  }

  get R(): number {
    return Number(this._R);
  }

  get RBI(): number {
    return Number(this._RBI);
  }

  get SAC(): number {
    return Number(this._SAC);
  }

  get SF(): number {
    return Number(this._SF);
  }

  get SO(): number {
    return Number(this._SO);
  }

  get TB(): number {
    return Number(this._TB);
  }

  get avg(): number {
    return Number(this._avg);
  }

  assignIfValid(value: any, key: string): any {
    if (value === undefined) {
      throw new Error(`${key} is undefined`);
    }

    return value;
  }
}