import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(routes)
  ]
};
