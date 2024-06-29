import {createFeatureSelector} from "@ngrx/store";
import {Team} from "../../common/model/team.interface";

export const selectTeams = createFeatureSelector<ReadonlyArray<Team>>('teams');
