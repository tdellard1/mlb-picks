import { Routes } from '@angular/router';
import {teamsResolver} from "./common/resolvers/teams.resolver";
import {dailyScheduleResolver} from "./common/resolvers/daily-schedule/daily-schedule.resolver";
import {AppContainerComponent} from "./app-container/app-container.component";
import {dataGuard} from "./common/guards/data.guard";
import {slatesResolver} from "./common/resolvers/slates.resolver";
import {mlbSchedulesResolver} from "./common/resolvers/mlb-schedules.resolver";

export const routes: Routes = [
  { path: '',
    canActivate: [dataGuard],
    component: AppContainerComponent,
    resolve: {
      teams: teamsResolver,
      mlbSchedules: mlbSchedulesResolver,
      dailySchedule: dailyScheduleResolver,
      slates: slatesResolver
    }
  }
];
