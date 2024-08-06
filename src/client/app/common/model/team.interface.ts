import {GameStats} from "./game-stats.interface";
import {Roster} from "./roster.interface";

export class Team {
  constructor(data?: any) {
    if (data) {
      this.DIFF = data.DIFF;
      this.RA = data.RA;
      this.RS = data.RS;
      this.conference = data.conference;
      this.conferenceAbv = data.conferenceAbv;
      this.division = data.division;
      this.espnLogo1 = data.espnLogo1;
      this.loss = data.loss;
      this.mlbLogo1 = data.mlbLogo1;
      this.teamAbv = data.teamAbv;
      this.teamCity = data.teamCity;
      this.teamID = data.teamID;
      this.teamName = data.teamName;
      this.teamStats = data.teamStats;
      this.topPerformers = data.topPerformers;
      this.wins = data.wins;
    }
  }

  DIFF: string;
  RA: string;
  RS: string;
  conference: string;
  conferenceAbv: string;
  division: string;
  espnLogo1: string;
  loss: string;
  mlbLogo1: string;
  teamAbv: string;
  teamCity: string;
  teamID: string;
  teamName: string;
  teamStats: GameStats;
  topPerformers: GameStats;
  wins: string;
  roster?: Roster;
}

export function areArraysEqual(a1: any[], a2: any[], uniqueIdentifier: string): boolean {
  function isObject(o: any): boolean {
    return o !== null && typeof o === 'object';
  }

  function areObjectsEqual(o1: any, o2: any): boolean {
    const o1Keys: string[] = Object.keys(o1);
    const o2Keys: string[] = Object.keys(o2);

    if (o1Keys.length !== o2Keys.length) return false;

    for (const o1Key in o1) {
      const o1Value = o1[o1Key];
      const o2Value = o2[o1Key];

      const isObjects: boolean = isObject(o1Value) && isObject(o2Value);

      if ((isObjects && !areObjectsEqual(o1Value, o2Value)) ||
        (!isObjects && o1Value !== o2Value)) {
        return false;
      }
    }

    return true;
  }

  if (a1.length !== a2.length) return false;

  for (const e1 of a1) {
    const hasElementFromArray2: boolean = a2.some((e2: any) => e1[uniqueIdentifier] === e2[uniqueIdentifier]);
    if (!hasElementFromArray2) return false;

    const e2: Team = a2.find((e2: any) => e2[uniqueIdentifier] === e1[uniqueIdentifier])!;

    const areTeamsEqual: boolean = areObjectsEqual(e1, e2);

    if (!areTeamsEqual) return areTeamsEqual;
  }

  return true;
}