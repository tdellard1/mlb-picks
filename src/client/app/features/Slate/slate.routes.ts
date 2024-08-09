import {RouterModule, Routes} from "@angular/router";
import {SlateContainerComponent} from "./feature/slate-container/slate-container.component";
import {NgModule} from "@angular/core";
import {slatesResolver} from "../../core/resolvers/slates.resolver";

export const routes: Routes = [
  {
    path: '',
    component: SlateContainerComponent,
    resolve: {
      slates: slatesResolver
    }
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class SlateRoutesModule {}
