import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import {provideHttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {gamesReducer} from "./state/reducers/games.reducer";
import {teamsReducer} from "./state/reducers/teams.reducer";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {playersReducer} from "./state/reducers/players.reducer";
import {NgSelectModule} from "@ng-select/ng-select";

export const appConfig: ApplicationConfig = {
  providers: [
        provideAnimations(),
        provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore({ games: gamesReducer, teams: teamsReducer, players: playersReducer }),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(),
    DatePipe,
    BrowserAnimationsModule,
    NgSelectModule
    ]
};
