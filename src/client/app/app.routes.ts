import { Routes } from '@angular/router';
import {dailyScheduleResolver} from "./core/resolvers/daily-schedule.resolver";
import {AppComponent} from "./app.component.js";
import {teamsResolver} from "./core/resolvers/teams.resolver.js";
import {playersResolver} from "./features/Pitchers/data-access/resolvers/players.resolver.js";
import {dataGuard} from "./core/guards/data.guard.js";
import {boxScoresResolver} from "./core/resolvers/box-scores.resolver";
import {schedulesResolver} from "./core/resolvers/schedules.resolver";

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [dataGuard],
    resolve: {
      dailySchedule: dailyScheduleResolver,
      schedules: schedulesResolver,
      boxScores: boxScoresResolver,
      players: playersResolver,
      teams: teamsResolver,
    },
    children: [
      {
        path: 'nrfi',
        loadChildren: () => import('./features/Props/props.module').then(m => m.PropsModule),
      },
      {
        path: 'analysis',
        loadChildren: () => import('./features/Analysis/analysis.module').then(m => m.AnalysisModule),
      },
      {
        path: 'pitchers',
        loadChildren: () => import('./features/Pitchers/pitchers.module').then(m => m.PitchersModule),
      },
      {
        path: 'splits',
        loadChildren: () => import('./features/Splits/splits.module').then(m => m.SplitsModule),
      },
      {
        path: 'streaks',
        loadChildren: () => import('./features/Streaks/streaks.module').then(m => m.StreaksModule),
      }
    ]
  }
];
