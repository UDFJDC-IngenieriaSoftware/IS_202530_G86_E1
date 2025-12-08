import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = ['/home', '/teams', '/login', '/register'];
// Endpoints públicos que pueden fallar sin redirigir
const PUBLIC_ENDPOINTS = [
  '/public', 
  '/teams/public', 
  '/projects/public',
  '/investigation-areas',
  '/project-areas',
  '/product-types',
  '/auth/login',
  '/auth/register'
];

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
        // Verificar si la URL es un endpoint público
        const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
          req.url.includes(endpoint)
        );
        
        // Obtener la ruta actual
        let currentUrl = '';
        try {
          currentUrl = router.url || window.location.pathname;
        } catch (e) {
          currentUrl = window.location.pathname;
        }
        
        const isPublicRoute = PUBLIC_ROUTES.some(route => 
          currentUrl === route || currentUrl.startsWith(route + '/')
        );
        
        // Si es un endpoint público o estamos en una ruta pública, 
        // solo limpiar el token sin redirigir
        if (isPublicEndpoint || isPublicRoute || req.url.includes('/users/me')) {
          // Limpiar el estado pero no redirigir
          if (token) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            authService.logout();
          }
        } else {
          // Solo redirigir si no estamos en una ruta pública y no es un endpoint público
          authService.logout();
          router.navigate(['/login']);
        }
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

