import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationDialogComponent } from '../../../shared/components/application-dialog/application-dialog.component';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="team-detail-container">
      @if (loading) {
        <div class="loading">Cargando...</div>
      } @else if (team) {
        <mat-card class="team-header-card">
          <mat-card-header>
            <mat-card-title>{{team.name}}</mat-card-title>
            <mat-card-subtitle>{{team.areaName}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="description">{{team.description}}</p>
            <div class="team-meta">
              <span><mat-icon>email</mat-icon> {{team.teamEmail}}</span>
              @if (team.coordinatorName) {
                <span><mat-icon>person</mat-icon> Coordinador: {{team.coordinatorName}}</span>
              }
            </div>
            @if (authService.isAuthenticated() && authService.hasRole('ESTUDIANTE')) {
              <button mat-raised-button color="primary" (click)="openApplicationDialog()" class="apply-button">
                <mat-icon>how_to_reg</mat-icon>
                Solicitar Vinculación
              </button>
            }
          </mat-card-content>
        </mat-card>

        <div class="projects-section">
          <h2>Proyectos de Investigación</h2>
          @if (projects && projects.length > 0) {
            <div class="projects-grid">
              @for (project of projects; track project.investigationProjectId) {
                <mat-card class="project-card">
                  <mat-card-header>
                    <mat-card-title>{{project.title}}</mat-card-title>
                    <mat-card-subtitle>
                      Estado: {{getStateLabel(project.state)}}
                    </mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{project.resume}}</p>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          } @else {
            <p class="no-projects">No hay proyectos registrados</p>
          }
        </div>
      } @else {
        <div class="error">Grupo no encontrado</div>
      }
    </div>
  `,
  styles: [`
    .team-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .loading, .error {
      text-align: center;
      padding: 48px;
      font-size: 1.2rem;
    }
    
    .team-header-card {
      margin-bottom: 32px;
    }
    
    .description {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 16px;
      color: #333;
    }
    
    .team-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
      color: #666;
    }
    
    .team-meta mat-icon {
      vertical-align: middle;
      margin-right: 4px;
    }
    
    .apply-button {
      margin-top: 16px;
    }
    
    .projects-section {
      margin-top: 32px;
    }
    
    .projects-section h2 {
      margin-bottom: 24px;
      color: var(--primary-black);
    }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .project-card {
      height: 100%;
    }
    
    .no-projects {
      text-align: center;
      padding: 32px;
      color: #666;
    }
  `]
})
export class TeamDetailComponent implements OnInit {
  team: any = null;
  projects: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (teamId) {
      this.loadTeam(Number(teamId));
      this.loadProjects(Number(teamId));
    }
  }

  loadTeam(id: number): void {
    this.apiService.getTeamById(id).subscribe({
      next: (team) => {
        this.team = team;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading team:', error);
        this.loading = false;
      }
    });
  }

  loadProjects(teamId: number): void {
    this.apiService.getProjectsByTeam(teamId).subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  getStateLabel(state: number): string {
    const states: { [key: number]: string } = {
      1: 'Activo',
      2: 'En desarrollo',
      3: 'Finalizado',
      4: 'Cancelado'
    };
    return states[state] || 'Desconocido';
  }

  openApplicationDialog(): void {
    const dialogRef = this.dialog.open(ApplicationDialogComponent, {
      width: '500px',
      data: { teamId: this.team.investigationTeamId, teamName: this.team.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar o mostrar mensaje de éxito
      }
    });
  }
}

