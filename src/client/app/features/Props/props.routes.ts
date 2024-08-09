import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PropsComponent} from "./feature/props/props.component";
import {pitcherResolver} from "../Pitchers/data-access/resolvers/pitcher.resolver.js";
import {teamNrfiResolver} from "./data-access/resolvers/team-nrfi.resolver.js";

export const routes: Routes = [
  {
    path: '',
    component: PropsComponent,
    resolve: {
      pitchers: pitcherResolver,
      teamsNoRunsFirstInning: teamNrfiResolver,
    }
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class PropsRoutesModule {}
