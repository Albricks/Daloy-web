import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { combineLatest, filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([
    authService.authReady$,
    authService.currentUser$
  ]).pipe(
    // 🔥 DO NOT decide until auth is ready
    filter(([ready]) => ready === true),

    take(1),

    map(([_, user]) => {
      if (user) return true;

      router.navigate(['/login']);
      return false;
    })
  );
};
