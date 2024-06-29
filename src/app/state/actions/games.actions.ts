import {createActionGroup, props} from "@ngrx/store";
import {Game} from "../../common/model/game.interface";

export const GamesActions = createActionGroup({
  source: 'Games API',
  events: {
    'Retrieved Daily Schedule': props<{ games: ReadonlyArray<Game> }>(),
  },
});
