import {createFeatureSelector} from "@ngrx/store";
import {Odds} from "../../common/model/odds.interface";

export const selectOdds = createFeatureSelector<ReadonlyArray<Odds>>('odds');
