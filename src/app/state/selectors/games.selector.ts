import {createFeatureSelector} from "@ngrx/store";
import {Game} from "../../common/model/game.interface";

export const selectGames = createFeatureSelector<ReadonlyArray<Game>>('games');
