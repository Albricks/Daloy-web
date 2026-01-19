import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If logged in → allow
  if (authService.isLoggedIn) {
    return true;
  }

  // If not logged in → redirect to login
  router.navigate(['/login']);
  return false;
};
