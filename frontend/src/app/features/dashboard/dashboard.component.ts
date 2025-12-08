import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bienvenido, {{user?.name}}</p>
      </div>

      <div class="dashboard-cards">
        @if (user?.role === 'ESTUDIANTE' || user?.role === 'DOCENTE') {
          <mat-card class="dashboard-card" routerLink="/dashboard/applications">
            <mat-card-content>
              <mat-icon>how_to_reg</mat-icon>
              <h3>Mis Solicitudes</h3>
              <p>Consulta el estado de tus solicitudes de vinculación</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="dashboard-card" routerLink="/dashboard/my-teams-student">
            <mat-card-content>
              <mat-icon>groups</mat-icon>
              <h3>Mis Grupos</h3>
              <p>Consulta los grupos a los que perteneces y sus proyectos</p>
            </mat-card-content>
          </mat-card>

          @if (user?.role === 'DOCENTE') {
            <mat-card class="dashboard-card" routerLink="/dashboard/projects">
              <mat-card-content>
                <mat-icon>science</mat-icon>
                <h3>Proyectos</h3>
                <p>Consulta los proyectos de investigación</p>
              </mat-card-content>
            </mat-card>
          }
        }

        @if (user?.role === 'COORDINADOR' || user?.role === 'ADMINISTRADOR') {
          <mat-card class="dashboard-card" routerLink="/dashboard/my-teams">
            <mat-card-content>
              <mat-icon>groups</mat-icon>
              @if (user?.role === 'ADMINISTRADOR') {
                <h3>Grupos</h3>
                <p>Consulta y gestiona los grupos de investigación</p>
              } @else {
                <h3>Mis Grupos</h3>
                <p>Gestiona tus grupos de investigación</p>
              }
            </mat-card-content>
          </mat-card>

          <mat-card class="dashboard-card" routerLink="/dashboard/projects">
            <mat-card-content>
              <mat-icon>science</mat-icon>
              <h3>Proyectos</h3>
              <p>Administra los proyectos de investigación</p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .dashboard-header {
      margin-bottom: 32px;
    }
    
    .dashboard-header h1 {
      color: var(--primary-black);
      margin-bottom: 8px;
    }
    
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }
    
    .dashboard-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .dashboard-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--primary-blue);
      margin-bottom: 16px;
    }
    
    .dashboard-card h3 {
      color: var(--primary-black);
      margin-bottom: 8px;
    }
    
    .dashboard-card p {
      color: #666;
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: any = null;

  constructor(
    public authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
}

