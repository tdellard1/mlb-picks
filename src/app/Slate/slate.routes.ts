import {RouterModule, Routes} from "@angular/router";
import {SlateContainerComponent} from "./feature/slate-container/slate-container.component";
import {NgModule} from "@angular/core";
import {teamsResolver} from "../common/resolvers/teams.resolver";
import {slatesResolver} from "../common/resolvers/slates.resolver";

export const routes: Routes = [
  {
    path: '',
    component: SlateContainerComponent,
    resolve: {
      teams: teamsResolver,
      slates: slatesResolver
    }
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class SlateRoutesModule {}
