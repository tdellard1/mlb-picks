import {Pitching} from "../interfaces/pitching";

export class TeamStatsHitting {
  private readonly _D: string;
  private readonly _T: string;
  private readonly _AB: string;
  private readonly _BB: string;
  private readonly _GIDP: string;
  private readonly _H: string;
  private readonly _HBP: string;
  private readonly _HR: string;
  private readonly _IBB: string;
  private readonly _R: string;
  private readonly _RBI: string;
  private readonly _SAC: string;
  private readonly _SF: string;
  private readonly _SO: string;
  private readonly _TB: string;
  private readonly _avg: string;

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

export class TeamStatsPitching {
  private readonly _Pitches: string;
  private readonly _Strikes: string;
  private readonly _H: string;
  private readonly _HR: string;
  private readonly _BB: string;
  private readonly _ER: string;
  private readonly _R: string;
  private readonly _HBP: string;
  private readonly _SO: string;
  private readonly _InningsPitched: string;

  constructor(data: Pitching) {
    this._Pitches = this.assignIfValid(data.Pitches, 'Pitches');
    this._Strikes = this.assignIfValid(data.Strikes, 'Strikes');
    this._H = this.assignIfValid(data.H, 'H');
    this._HR = this.assignIfValid(data.BB, 'HR');
    this._BB = this.assignIfValid(data.BB, 'BB');
    this._ER = this.assignIfValid(data.H, 'ER');
    this._R = this.assignIfValid(data.HBP, 'R');
    this._HBP = this.assignIfValid(data.HR, 'HBP');
    this._SO = this.assignIfValid(data.SO, 'SO');
    this._InningsPitched = this.assignIfValid(data.R, 'InningsPitched');
  }


  get Pitches(): number {
    return Number(this._Pitches);
  }

  get Strikes(): number {
    return Number(this._Strikes);
  }

  get H(): number {
    return Number(this._H);
  }

  get HR(): number {
    return Number(this._HR);
  }

  get BB(): number {
    return Number(this._BB);
  }

  get ER(): number {
    return Number(this._ER);
  }

  get R(): number {
    return Number(this._R);
  }

  get HBP(): number {
    return Number(this._HBP);
  }

  get SO(): number {
    return Number(this._SO);
  }

  get InningsPitched(): number {
    return Number(this._InningsPitched);
  }

  assignIfValid(value: any, key: string): any {
    if (value === undefined) {
      throw new Error(`${key} is undefined`);
    }

    return value;
  }
}