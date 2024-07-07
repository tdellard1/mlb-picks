import { Injectable } from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {BehaviorSubject, distinctUntilChanged, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class GameSelectorService {
  private _state: BehaviorSubject<GameSelectorState>;
  constructor() {
    this._state = new BehaviorSubject<GameSelectorState>(initialState);
  }

  get state$(): Observable<GameSelectorState> {
    return this._state.asObservable();
  }

  select<T>(selector: (state: GameSelectorState) => T): Observable<T> {
    return this.state$.pipe(
      map(selector),
      distinctUntilChanged(),
    )
  }

  get selectedGameInfo(): Observable<GameSelectorState> {
    return this.select(state => state);
  }

  get away(): Observable<Team> {
    return this.select(state => state.away);
  }

  get home(): Observable<Team> {
    return this.select(state => state.home);
  }

  get game(): Observable<Game> {
    return this.select(state => state.game);
  }

  gameSelected(game: Game, home: Team, away: Team) {
    const newState: GameSelectorState = { game, away, home};
    this._state.next(newState);
  }
}

export interface GameSelectorState {
  game: Game;
  home: Team;
  away: Team;
}

export const initialState: GameSelectorState = {
  game: {} as Game,
  home: {} as Team,
  away: {} as Team,
}
