import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  token?: string;
  profilePicture?: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.loadStoredUser();
    }
  }

  private loadStoredUser(): void {
    if (!this.isBrowser) return;

    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem('current_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Failed to parse stored user', e);
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    console.log('Attempting login to:', this.apiUrl);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (this.isBrowser) {
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(
              'current_user',
              JSON.stringify({
                id: response.id,
                username: response.username,
                email: response.email,
              })
            );
          }
          this.currentUserSubject.next({
            id: response.id,
            username: response.username,
            email: response.email,
          });
        }),
        map((response) => ({
          id: response.id,
          username: response.username,
          email: response.email,
        })),
        catchError((error) => {
          console.error('Login failed', error);
          return throwError(
            () => new Error('Login failed. Please check your credentials.')
          );
        })
      );
  }

  register(
    username: string,
    email: string,
    password: string
  ): Observable<User> {
    console.log('Attempting registration to:', this.apiUrl);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, {
        username,
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (this.isBrowser) {
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(
              'current_user',
              JSON.stringify({
                id: response.id,
                username: response.username,
                email: response.email,
              })
            );
          }
          this.currentUserSubject.next({
            id: response.id,
            username: response.username,
            email: response.email,
          });
        }),
        map((response) => ({
          id: response.id,
          username: response.username,
          email: response.email,
        })),
        catchError((error) => {
          console.error('Registration failed', error);
          return throwError(
            () => new Error('Registration failed. Please try again.')
          );
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('current_user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
