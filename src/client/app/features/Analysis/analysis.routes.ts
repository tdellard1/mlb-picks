import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AnalysisViewComponent} from "./feature/analysis-view/analysis-view.component";
import {gameResolver} from "./data-access/resolvers/game-resolver.resolver.js";
import {GameSelectorComponent} from "../../shared/components/game-selector/game-selector.component.js";

export const routes: Routes = [
  {
    path: '',
    component: GameSelectorComponent,
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
  imports: [RouterModule.forChild(routes)]
})
export class AnalysisRoutesModule {}
