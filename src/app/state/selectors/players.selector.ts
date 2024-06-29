import {createFeatureSelector} from "@ngrx/store";
import {Player} from "../../common/model/players.interface";

export const selectPlayers = createFeatureSelector<ReadonlyArray<Player>>('players');
