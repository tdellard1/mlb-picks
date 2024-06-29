import {createActionGroup, props} from "@ngrx/store";
import {Player} from "../../common/model/players.interface";

export const PlayersActions = createActionGroup({
  source: 'Players API',
  events: {
    'Retrieved All Players': props<{ players: ReadonlyArray<Player> }>(),
  },
});
