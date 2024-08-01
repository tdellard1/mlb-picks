import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PropsComponent} from "./feature/props/props.component";

export const routes: Routes = [
  {
    path: '',
    component: PropsComponent,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class PropsRoutesModule {}
