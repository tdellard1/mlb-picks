import {Game} from "../../common/model/game.interface";
import {createReducer, on} from "@ngrx/store";
import {GamesActions} from "../actions/games.actions";

export const initialState: ReadonlyArray<Game> = [];

export const gamesReducer = createReducer(
  initialState,
  on(GamesActions.retrievedDailySchedule, (_state, { games }) => games)
);
