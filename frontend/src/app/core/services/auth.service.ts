import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
  message: string;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  projectAreaId?: number;
  projectAreaName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({
              email: response.email,
              name: response.name,
              role: response.role
            }));
            this.loadUserFromStorage();
          }
        })
      );
  }

  register(name: string, email: string, password: string, role: string, projectAreaId?: number): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, {
      name,
      email,
      password,
      role,
      projectAreaId
    }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({
            email: response.email,
            name: response.name,
            role: response.role
          }));
          this.loadUserFromStorage();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/home']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.http.get<User>(`${this.apiUrl}/users/me`).subscribe(
        fullUser => this.currentUserSubject.next(fullUser),
        () => this.logout()
      );
    }
  }
}

