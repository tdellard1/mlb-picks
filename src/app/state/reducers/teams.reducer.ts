import {createReducer, on} from "@ngrx/store";
import {TeamsActions} from "../actions/teams.actions";
import {Team} from "../../common/model/team.interface";

export const initialState: ReadonlyArray<Team> = [];

export const teamsReducer = createReducer(
  initialState,
  on(TeamsActions.retrievedAllTeams, (_state, { teams }) => teams)
);

