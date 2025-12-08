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
          // Cargar el usuario completo después del registro
          // Usar un pequeño delay para asegurar que el backend haya procesado el registro
          setTimeout(() => {
            this.http.get<User>(`${this.apiUrl}/users/me`).subscribe({
              next: (fullUser) => {
                this.currentUserSubject.next(fullUser);
              },
              error: (error) => {
                console.error('Error loading user after registration:', error);
                // Si falla, usar los datos básicos del registro
                this.currentUserSubject.next({
                  userId: 0,
                  name: response.name,
                  email: response.email,
                  role: response.role
                } as User);
              }
            });
          }, 300);
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
    const token = this.getToken();
    if (userStr && token) {
      const user = JSON.parse(userStr);
      this.http.get<User>(`${this.apiUrl}/users/me`).subscribe({
        next: (fullUser) => {
          this.currentUserSubject.next(fullUser);
        },
        error: (error) => {
          console.error('Error loading user from storage:', error);
          // Solo hacer logout si es un error 401 (no autorizado)
          // No hacer logout en otros errores para evitar redirecciones innecesarias
          if (error.status === 401) {
            this.logout();
          } else {
            // Si hay un error pero no es 401, mantener el usuario del localStorage
            this.currentUserSubject.next(user as User);
          }
        }
      });
    }
  }

  refreshUser(): void {
    this.http.get<User>(`${this.apiUrl}/users/me`).subscribe({
      next: (fullUser) => {
        const currentUser = this.currentUserSubject.value;
        const roleChanged = currentUser && currentUser.role !== fullUser.role;
        
        this.currentUserSubject.next(fullUser);
        // Actualizar también el localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.role = fullUser.role;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Si el rol cambió, log para debugging
        if (roleChanged) {
          console.log('AuthService - Role changed from', currentUser?.role, 'to', fullUser.role);
        }
      },
      error: (error) => {
        console.error('Error refreshing user:', error);
      }
    });
  }
}

