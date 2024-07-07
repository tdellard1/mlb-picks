import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {NgSelectModule} from "@ng-select/ng-select";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(),
    DatePipe,
    BrowserAnimationsModule,
    NgSelectModule
    ]
};
