import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SituationalService } from '../../../services/situational.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SituationalCompleteGuard implements CanActivate {

  constructor(
    private situationalService: SituationalService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const moduleId = route.paramMap.get('id')!;

    return this.situationalService
      .hasCompletedByModule(moduleId)
      .pipe(
        map(completed => {
          // ✅ allow access if completed
          if (completed) {
            return true;
          }

          // ❌ not completed → redirect back
          this.router.navigate(
            ['/modules', 'situational', moduleId]
          );
          return false;
        }),
        // 🔥 CRITICAL: never block navigation on API error
        catchError(() => of(true))
      );
  }
}
