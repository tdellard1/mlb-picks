import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {GameSelectorComponent} from "../../shared/components/game-selector/game-selector.component.js";
import {SplitsComponent} from "./splits/splits.component.js";
import {splitsResolver} from "../../core/resolvers/splits.resolver.js";

export const routes: Routes = [
  {
    path: '',
    component: GameSelectorComponent,
    children: [
      {
        path: ':gameId',
        component: SplitsComponent,
        resolve: {
          splits: splitsResolver,
        }
      }
    ]
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class SplitsRoutesModule { }
