import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PitchersContainerComponent} from "./feature/pitchers-container/pitchers-container.component";
import {PitcherViewComponent} from "./feature/pitcher-view/pitcher-view.component.js";

export const routes: Routes = [
  {
    path: '',
    component: PitchersContainerComponent,
    children: [
      {
        path: ':playerID',
        component: PitcherViewComponent
      },
    ]
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class PitchersRoutesModule {
}
