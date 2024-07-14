import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AnalysisContainerComponent} from "./feature/analysis-container/analysis-container.component";
import {mlbSchedulesResolver} from "../common/resolvers/mlb-schedules.resolver";
import {AnalysisViewComponent} from "./feature/analysis-view/analysis-view.component";
import {analysisViewResolver} from "./data-access/analysis-view.resolver";

export const routes: Routes = [
  {
    path: '',
    component: AnalysisContainerComponent,
    resolve: {
      mlbSchedules: mlbSchedulesResolver,
    },
    children: [
      {
        path: ':gameId',
        component: AnalysisViewComponent,
        resolve: {
          data: analysisViewResolver
        }
      }
    ]
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class AnalysisRoutesModule {}
