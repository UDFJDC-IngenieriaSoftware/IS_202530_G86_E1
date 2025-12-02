import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <button mat-icon-button class="menu-button" (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      
      <a routerLink="/home" class="logo">
        <mat-icon>school</mat-icon>
        <span>Investigación UD</span>
      </a>
      
      <span class="spacer"></span>
      
      <nav class="nav-links desktop-nav">
        <a mat-button routerLink="/home" routerLinkActive="active">Inicio</a>
        <a mat-button routerLink="/teams" routerLinkActive="active">Grupos</a>
        
        @if (authService.isAuthenticated()) {
          <a mat-button routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          
          @if (authService.hasRole('ADMINISTRADOR')) {
            <a mat-button routerLink="/admin" routerLinkActive="active">Administración</a>
          }
          
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
            <span class="user-name">{{ authService.getCurrentUser()?.name }}</span>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        } @else {
          <a mat-button routerLink="/login">Iniciar Sesión</a>
          <a mat-raised-button color="accent" routerLink="/register">Registrarse</a>
        }
      </nav>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container mobile-only">
      <mat-sidenav #sidenav mode="over" class="mobile-sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/home" routerLinkActive="active" (click)="sidenav.close()">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Inicio</span>
          </a>
          <a mat-list-item routerLink="/teams" routerLinkActive="active" (click)="sidenav.close()">
            <mat-icon matListItemIcon>groups</mat-icon>
            <span matListItemTitle>Grupos</span>
          </a>
          
          @if (authService.isAuthenticated()) {
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active" (click)="sidenav.close()">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            
            @if (authService.hasRole('ADMINISTRADOR')) {
              <a mat-list-item routerLink="/admin" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
                <span matListItemTitle>Administración</span>
              </a>
            }
            
            <mat-divider></mat-divider>
            <div class="mobile-user-info">
              <mat-icon>account_circle</mat-icon>
              <span>{{ authService.getCurrentUser()?.name }}</span>
            </div>
            <button mat-list-item (click)="logout(); sidenav.close()">
              <mat-icon matListItemIcon>logout</mat-icon>
              <span matListItemTitle>Cerrar Sesión</span>
            </button>
          } @else {
            <mat-divider></mat-divider>
            <a mat-list-item routerLink="/login" (click)="sidenav.close()">
              <mat-icon matListItemIcon>login</mat-icon>
              <span matListItemTitle>Iniciar Sesión</span>
            </a>
            <a mat-list-item routerLink="/register" (click)="sidenav.close()">
              <mat-icon matListItemIcon>person_add</mat-icon>
              <span matListItemTitle>Registrarse</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <!-- Contenido principal -->
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .header-toolbar {
      background-color: var(--primary-blue) !important;
      color: var(--primary-white);
      padding: 0 32px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      height: 72px;
      position: relative;
      z-index: 1000;
    }
    
    .menu-button {
      display: none;
      margin-right: 16px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--primary-white);
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: 500;
      padding: 8px 0;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .nav-links {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .nav-links a {
      color: var(--primary-white);
      padding: 8px 16px;
    }
    
    .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    button[mat-button] {
      color: var(--primary-white);
      padding: 8px 16px;
    }

    .user-name {
      margin-left: 4px;
    }
    
    .sidenav-container {
      position: fixed;
      top: 72px;
      left: 0;
      right: 0;
      bottom: 0;
      height: calc(100vh - 72px);
      z-index: 999;
      pointer-events: none;
      visibility: hidden;
      opacity: 0;
    }

    .sidenav-container.mobile-only {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
      opacity: 0 !important;
    }

    .sidenav-container ::ng-deep .mat-drawer-content {
      display: none;
      pointer-events: none;
    }

    .sidenav-container ::ng-deep .mat-drawer {
      pointer-events: auto;
    }

    .sidenav-container ::ng-deep .mat-drawer-backdrop {
      pointer-events: auto;
    }

    .mobile-sidenav {
      width: 280px;
      background-color: var(--primary-white);
    }

    .mobile-user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background-color: #f5f5f5;
      color: var(--primary-black);
      font-weight: 500;
    }

    .mobile-user-info mat-icon {
      color: var(--primary-blue);
    }

    @media (max-width: 768px) {
      .menu-button {
        display: block;
      }

      .desktop-nav {
        display: none;
      }

      .header-toolbar {
        padding: 0 16px;
      }

      .sidenav-container.mobile-only {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    }
  `]
})
export class HeaderComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}

