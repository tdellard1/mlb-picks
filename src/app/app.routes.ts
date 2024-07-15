import { Routes } from '@angular/router';
import {dailyScheduleResolver} from "./common/resolvers/daily-schedule/daily-schedule.resolver";
import {AppContainerComponent} from "./app-container/app-container.component";
import {dataGuard} from "./common/guards/data.guard";

export const routes: Routes = [
  {
    path: '',
    // canActivate: [dataGuard],
    component: AppContainerComponent,
    // resolve: { dailySchedule: dailyScheduleResolver },
    // children: [
    //   {
    //     path: 'slate',
    //     loadChildren: () => import('./Slate/slate.module').then(m => m.SlateModule),
    //   },
    //   {
    //     path: 'nrfi',
    //     loadChildren: () => import('./Props/props.module').then(m => m.PropsModule),
    //   },
    //   {
    //     path: 'analysis',
    //     loadChildren: () => import('./Analysis/analysis.module').then(m => m.AnalysisModule),
    //   }
    // ]
  }
];
