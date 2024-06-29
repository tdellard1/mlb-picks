import {createActionGroup, props} from "@ngrx/store";
import {Odds} from "../../common/model/odds.interface";

export const OddsActions = createActionGroup({
  source: 'Odds API',
  events: {
    'Retrieved Daily Betting Odds': props<{ odds: ReadonlyArray<Odds> }>(),
  },
});
