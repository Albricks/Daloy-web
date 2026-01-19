import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiResponse } from './models/api-response';
import { AuthResponse } from './models/auth-response';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  birthDate: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName: string;
  birthDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ---------- REGISTER ----------
  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // ---------- LOGIN ----------
login(email: string, password: string) {
  return this.http
    .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, { email, password })
    .pipe(
      tap(res => {
        localStorage.setItem('token', res.data!.accessToken);
        localStorage.setItem('refreshToken', res.data!.refreshToken);
        this.currentUserSubject.next(res.data!.user);
      })
    );
}

  // ---------- LOAD CURRENT USER ----------
  loadCurrentUser() {
    return this.http
      .get<User>(`${this.apiUrl}/me`)
      .pipe(
        tap(user => this.currentUserSubject.next(user))
      );
  }

  // ---------- LOGOUT ----------
  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // ---------- HELPERS ----------
  get token(): string | null {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}
