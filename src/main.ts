import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withFetch,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthService } from './app/core/auth/auth.service';
import { AuthInterceptor } from './app/core/auth/auth.interceptor';

export function initAuth(authService: AuthService) {
  return () => authService.loadMe();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),

    // ✅ Enable HttpClient + interceptors
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),

    // ✅ REGISTER THE INTERCEPTOR (THIS WAS MISSING)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // ✅ Hydrate auth BEFORE routing
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true
    }
  ]
}).catch(err => console.error(err));
