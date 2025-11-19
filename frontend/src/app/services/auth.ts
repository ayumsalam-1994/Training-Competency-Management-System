import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface User {
  id: number;
  email: string;
  roleId: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000';
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());

  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkTokenValidity();
  }

  private getUserFromStorage(): User | null {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  }

  private checkTokenValidity(): void {
    const token = this.getToken();
    if (token) {
      // Verify token with backend
      this.http.get<{ user: User }>(`${this.apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }).pipe(
        catchError(() => {
          this.logout();
          return of(null);
        })
      ).subscribe();
    }
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.userSubject.next(response.user);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.userSubject.next(response.user);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('auth_user');
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }
}

