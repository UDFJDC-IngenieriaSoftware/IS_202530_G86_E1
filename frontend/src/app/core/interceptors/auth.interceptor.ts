import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
    tap((response) => {
      // Refrescar el usuario después de operaciones que puedan cambiar el rol
      // Solo para operaciones relacionadas con equipos o usuarios
      if (authService.getToken() && 
          !req.url.includes('/auth/login') && 
          !req.url.includes('/auth/register') &&
          (req.url.includes('/teams') || req.url.includes('/users'))) {
        if (req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE') {
          // Delay más largo para asegurar que el backend haya procesado el cambio completamente
          setTimeout(() => {
            authService.refreshUser();
          }, 1000);
        }
      }
    })
  );
};

