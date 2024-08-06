import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AnalysisContainerComponent} from "./feature/analysis-container/analysis-container.component";
import {AnalysisViewComponent} from "./feature/analysis-view/analysis-view.component";
import {gameResolver} from "./data-access/resolvers/game-resolver.resolver.js";
import {teamsResolver} from "../common/resolvers/teams.resolver.js";
import {playersResolver} from "../Pitchers/data-access/resolvers/players.resolver.js";

export const routes: Routes = [
  {
    path: '',
    component: AnalysisContainerComponent,
    resolve: {
      teams: teamsResolver,
      players: playersResolver
    },
    children: [
      {
        path: ':gameId',
        component: AnalysisViewComponent,
        resolve: {
          matchUp: gameResolver,
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
