import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from './auth.service';

export const AdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authReady$.pipe(
    // ⏳ Wait until /me has finished loading
    filter(ready => ready),
    take(1),
    map(() => {
      if (auth.isAdmin) {
        return true;
      }

      // 🚫 Logged in but not admin
      router.navigate(['/home']);
      return false;
    })
  );
};
