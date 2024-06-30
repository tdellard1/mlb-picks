import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {map} from "rxjs/operators";
import {ApiService} from "../services/api-services/api.service";

export const picksResolver: ResolveFn<any> = () => {
  return inject(ApiService).get<{picks: Picks[]}>('http://localhost:3000/api/picks')
    .pipe(
      map(({picks}: {picks: Picks[]}) => picks),
    );
};

export interface Picks {
  [date: string]: Analysts;
}

export interface Analysts {
  analysts: Analyst[]
}

export interface Analyst {
  firstName: string;
  picks: AnalystGamePick[];
}

export interface AnalystGamePick {
  gameID: string;
  pick: string;
  winner: string;
}

export class Slate {
  dates: Map<string, Experts> = new Map<string, Experts>();

  constructor(picks: Picks) {
    for (const [date, {analysts}] of Object.entries(picks)) {
        const experts: Experts = analysts.map(({firstName, picks}: Analyst) => {
        const expert: Expert = {} as Expert;
        expert.name = firstName;
        expert.predictions = [];

        picks.forEach(({gameID, pick, winner}: AnalystGamePick) => {
          const expertGamePick: ExpertGamePick = { gameID, prediction: pick } as ExpertGamePick;
          expertGamePick.winner = winner;

          if (winner === 'right') expertGamePick.correct = true;
          if (winner === 'wrong') expertGamePick.correct = false;

          expert.predictions.push(expertGamePick);
        });

        return expert;
      });

      this.dates.set(date, experts);
    }
  }

  toPicksObject(): Picks {
    const picks: Picks = {} as Picks;
    for (const [date, experts] of Object.entries(this.dates)) {
      const analysts: Analyst[] = experts.map(({name, predictions}: Expert) => {
        const analyst: Analyst = {} as Analyst;
        analyst.firstName = name;

        predictions.forEach(({gameID, prediction}: ExpertGamePick) => {
          const picks: AnalystGamePick = {} as AnalystGamePick;
          picks.gameID = gameID;
          picks.pick = prediction;

          analyst.picks.push(picks)
        });

        return analyst;
      });

      picks[date] = { analysts } as Analysts;
    }

    return picks;
  }
}


export declare type Experts = Expert[]

export interface Expert {
  name: string;
  predictions: ExpertGamePick[];
}

export interface ExpertGamePick {
  gameID: string;
  prediction: string;
  options: string[];
  correct: boolean;
  winner: string;
}


