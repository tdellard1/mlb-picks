import { Routes } from '@angular/router';
import {playersResolver} from "./common/resolvers/players.resolver";
import {teamsResolver} from "./common/resolvers/teams.resolver";
import {dailyScheduleResolver} from "./common/resolvers/daily-schedule/daily-schedule.resolver";
import {AppContainerComponent} from "./app-container/app-container.component";
import {dataGuard} from "./common/guards/data.guard";
import {boxScoresResolver} from "./common/resolvers/box-scores.resolver";
import {slatesResolver} from "./common/resolvers/slates.resolver";
import {mlbSchedulesResolver} from "./common/resolvers/mlb-schedules.resolver";

export const routes: Routes = [
  { path: '',
    canActivate: [dataGuard],
    component: AppContainerComponent,
    resolve: {
      teams: teamsResolver,
      players: playersResolver,
      mlbSchedules: mlbSchedulesResolver,
      dailySchedule: dailyScheduleResolver,
      boxScores: boxScoresResolver,
      slates: slatesResolver
    }
  }
];
