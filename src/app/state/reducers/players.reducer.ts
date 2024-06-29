import {createReducer, on} from "@ngrx/store";
import {Player} from "../../common/model/players.interface";
import {PlayersActions} from "../actions/players.actions";

export const initialState: ReadonlyArray<Player> = [];

export const playersReducer = createReducer(
  initialState,
  on(PlayersActions.retrievedAllPlayers, (_state, { players }) => players)
);

