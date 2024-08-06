import { Routes } from '@angular/router';
import {dailyScheduleResolver} from "./common/resolvers/daily-schedule/daily-schedule.resolver";
import {AppComponent} from "./app.component.js";

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    resolve: { dailySchedule: dailyScheduleResolver },
    children: [
      {
        path: 'slate',
        loadChildren: () => import('./Slate/slate.module').then(m => m.SlateModule),
      },
      {
        path: 'nrfi',
        loadChildren: () => import('./Props/props.module').then(m => m.PropsModule),
      },
      {
        path: 'analysis',
        loadChildren: () => import('./Analysis/analysis.module').then(m => m.AnalysisModule),
      },
      {
        path: 'pitchers',
        loadChildren: () => import('./Pitchers/pitchers.module').then(m => m.PitchersModule),
      }
    ]
  }
];
