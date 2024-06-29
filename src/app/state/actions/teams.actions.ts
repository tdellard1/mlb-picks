import {createActionGroup, props} from "@ngrx/store";
import {Team} from "../../common/model/team.interface";

export const TeamsActions = createActionGroup({
  source: 'Teams API',
  events: {
    'Retrieved All Teams': props<{ teams: ReadonlyArray<Team> }>(),
  },
});
