import { Routes } from '@angular/router';
import {dailyScheduleResolver} from "./core/resolvers/daily-schedule.resolver";
import {AppComponent} from "./app.component.js";
import {teamsResolver} from "./core/resolvers/teams.resolver.js";
import {playersResolver} from "./features/Pitchers/data-access/resolvers/players.resolver.js";
import {boxScoreGuard} from "./core/guards/boxScoreGuard.js";
import {boxScoresResolver} from "./core/resolvers/box-scores.resolver";
import {schedulesResolver} from "./core/resolvers/schedules.resolver";

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [boxScoreGuard],
    resolve: {
      teams: teamsResolver,
      players: playersResolver,
      schedules: schedulesResolver,
      boxScores: boxScoresResolver,
      dailySchedule: dailyScheduleResolver,
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
