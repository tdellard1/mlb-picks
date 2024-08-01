import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PitchersContainerComponent} from "./feature/pitchers-container/pitchers-container.component";

export const routes: Routes = [
  {
    path: '',
    component: PitchersContainerComponent,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class PitchersRoutesModule {}
