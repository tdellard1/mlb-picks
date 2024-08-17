import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {StreaksComponent} from "./streaks/streaks.component";

export const routes: Routes = [
  {
    path: '',
    component: StreaksComponent
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class StreaksRoutesModule { }
