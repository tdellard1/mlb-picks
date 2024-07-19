import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AnalysisContainerComponent} from "./feature/analysis-container/analysis-container.component";
import {AnalysisViewComponent} from "./feature/analysis-view/analysis-view.component";

export const routes: Routes = [
  {
    path: '',
    component: AnalysisContainerComponent,
    children: [
      {
        path: ':gameId',
        component: AnalysisViewComponent
      }
    ]
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class AnalysisRoutesModule {}
