import {createReducer, on} from "@ngrx/store";
import {Odds} from "../../common/model/odds.interface";
import {OddsActions} from "../actions/odds.actions";

export const initialState: ReadonlyArray<Odds> = JSON.parse(localStorage.getItem('odds') || '[]');

export const oddsReducer = createReducer(
  initialState,
  on(OddsActions.retrievedDailyBettingOdds, (_state, { odds }) => odds)
);
