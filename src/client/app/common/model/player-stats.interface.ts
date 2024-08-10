import {TeamFieldingStats, TeamHittingStats, TeamPitchingStats} from "./team-stats.interface";

export class PlayerStats {
  gameID: string;
  Pitching: PlayerPitchingStats;
  allPositionsPlayed: string;
  note: string;
  Hitting: PlayerHittingStats;
  BaseRunning: BaseRunning;
  started: string;
  team: string;
  startingPosition: string;
  Fielding: PlayerFieldingStats;
  teamID: string;
  playerID: string;
  mlbID: string;


  constructor(data?: any) {
    this.gameID = data.gameID;
    this.Pitching = data.Pitching;
    this.allPositionsPlayed = data.allPositionsPlayed;
    this.note = data.note;
    this.Hitting = data.Hitting;
    this.BaseRunning = data.BaseRunning;
    this.started = data.started;
    this.team = data.team;
    this.startingPosition = data.startingPosition;
    this.Fielding = data.Fielding;
    this.teamID = data.teamID;
    this.playerID = data.playerID;
    this.mlbID = data.mlbID;
  }

  get hits(): number {
    return Number(this.Hitting.H);
  }

  get singles(): number {
    const doubles: number = Number(this.Hitting["2B"]);
    const triples: number = Number(this.Hitting["3B"]);
    const homeRuns: number = Number(this.Hitting.HR);
    return Number(this.Hitting.H) - (doubles + triples + homeRuns);
  }

  get doubles(): number {
    return Number(this.Hitting['2B']);
  }

  get triples(): number {
    return Number(this.Hitting["3B"]);
  }

  get homeRuns(): number {
    return Number(this.Hitting.HR);
  }

  get unintentionalWalk(): number {
    return Number(this.Hitting.BB);
  }

  get intentionalWalk(): number {
    return Number(this.Hitting.IBB);
  }

  get plateAppearance(): number {
    return Number(this.Pitching["Batters Faced"]);
  }
}

export interface PlayerPitchingStats extends TeamPitchingStats {
  BB: string;
  decision: string;
  H: string;
  HR: string;
  ER: string;
  R: string;
  pitchingOrder: string;
  ERA: string;
  InningsPitched: string;
  SO: string;
}



export interface PlayerHittingStats extends TeamHittingStats {
  AB: string;     // At Bats
  HR: string;     // Home Runs
  avg: string; // Batting Average
  SO: string;
}

export interface BaseRunning {
  CS: TotalPlayerObject;
  SB: TotalPlayerObject
  PO: TotalPlayerObject;
}

export interface PlayerFieldingStats extends TeamFieldingStats {
  E: string;
}

export interface TotalPlayerObject {
  total: string;
  playerID: string[];
}
