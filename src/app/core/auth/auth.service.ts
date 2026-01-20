import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../../../environments/environment';
import { ApiResponse } from './models/api-response';
import { AuthResponse } from './models/auth-response';
import { MeDto } from './models/me.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<MeDto | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private authReadySubject = new BehaviorSubject<boolean>(false);
  authReady$ = this.authReadySubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // --------------------
  // SAFE STORAGE ACCESS (SSR-SAFE)
  // --------------------
  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  // --------------------
  // REGISTER
  // --------------------
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // --------------------
  // LOGIN
  // --------------------
  login(email: string, password: string) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          this.storage?.setItem('token', res.data!.accessToken);
          this.storage?.setItem('refreshToken', res.data!.refreshToken);
        })
      );
  }

  // --------------------
  // LOAD CURRENT USER (/me)
  // --------------------
loadMe(): void {
  const token = this.storage?.getItem('token');

  if (!token) {
    this.authReadySubject.next(true);
    return;
  }

  this.http.get<MeDto>(`${this.apiUrl}/me`).subscribe({
    next: user => {
      this.currentUserSubject.next(user);
      this.authReadySubject.next(true);
    },
    error: () => {
      this.logout();
      this.authReadySubject.next(true);
    }
  });
}

  // --------------------
  // LOGOUT
  // --------------------
  logout(): void {
    this.storage?.removeItem('token');
    this.storage?.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // --------------------
  // HELPERS
  // --------------------
  get token(): string | null {
    return this.storage?.getItem('token') ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}
