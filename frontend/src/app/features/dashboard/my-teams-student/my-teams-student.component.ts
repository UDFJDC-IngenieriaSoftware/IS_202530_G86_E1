import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-my-teams-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule
  ],
  template: `
    <div class="my-teams-container">
      <div class="header">
        <h1>Mis Grupos de Investigación</h1>
      </div>

      @if (loading) {
        <mat-card>
          <p class="loading">Cargando grupos...</p>
        </mat-card>
      } @else if (teams.length > 0) {
        <div class="teams-list">
          @for (team of teams; track team.investigationTeamId) {
            <mat-card class="team-card">
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

                <mat-expansion-panel class="projects-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon>science</mat-icon>
                      Proyectos de Investigación
                      @if (teamProjects[team.investigationTeamId] && teamProjects[team.investigationTeamId].length > 0) {
                        <mat-chip class="count-chip">{{teamProjects[team.investigationTeamId].length}}</mat-chip>
                      }
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  
                  @if (teamProjects[team.investigationTeamId] && teamProjects[team.investigationTeamId].length > 0) {
                    <div class="projects-grid">
                      @for (project of teamProjects[team.investigationTeamId]; track project.investigationProjectId) {
                        <mat-card class="project-card">
                          <mat-card-header>
                            <mat-card-title>{{project.title}}</mat-card-title>
                            <mat-card-subtitle>
                              <mat-chip [class]="'state-' + getStateClass(project.state)">
                                {{getStateLabel(project.state)}}
                              </mat-chip>
                            </mat-card-subtitle>
                          </mat-card-header>
                          <mat-card-content>
                            <p>{{project.resume}}</p>
                          </mat-card-content>
                        </mat-card>
                      }
                    </div>
                  } @else {
                    <p class="no-projects">No hay proyectos registrados para este grupo</p>
                  }
                </mat-expansion-panel>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button [routerLink]="['/teams', team.investigationTeamId]">
                  <mat-icon>visibility</mat-icon>
                  Ver Detalles
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      } @else {
        <mat-card>
          <p class="no-teams">No perteneces a ningún grupo de investigación</p>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .my-teams-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .header {
      margin-bottom: 32px;
    }
    
    .header h1 {
      color: var(--primary-black);
    }
    
    .loading, .no-teams {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    
    .teams-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .team-card {
      width: 100%;
    }
    
    .description {
      font-size: 1rem;
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
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .projects-panel {
      margin-top: 16px;
    }
    
    .projects-panel mat-panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .count-chip {
      background-color: var(--primary-blue, #1976d2);
      color: white;
      font-size: 12px;
      height: 24px;
    }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    
    .project-card {
      height: 100%;
    }
    
    .no-projects {
      text-align: center;
      padding: 24px;
      color: #999;
      font-style: italic;
    }
    
    .state-1 {
      background-color: #4caf50;
      color: white;
    }
    
    .state-2 {
      background-color: #ff9800;
      color: white;
    }
    
    .state-3 {
      background-color: #2196f3;
      color: white;
    }
    
    .state-4 {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class MyTeamsStudentComponent implements OnInit {
  teams: any[] = [];
  teamProjects: { [key: number]: any[] } = {};
  loading = false;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.loading = true;
    this.apiService.getMyTeamsAsStudent().subscribe({
      next: (teams: any[]) => {
        this.teams = teams || [];
        this.loading = false;
        // Cargar proyectos para cada equipo
        teams.forEach((team: any) => {
          this.loadProjectsForTeam(team.investigationTeamId);
        });
      },
      error: (error: any) => {
        console.error('Error loading teams:', error);
        this.teams = [];
        this.loading = false;
      }
    });
  }

  loadProjectsForTeam(teamId: number): void {
    this.apiService.getProjectsByTeam(teamId).subscribe({
      next: (projects) => {
        this.teamProjects[teamId] = projects || [];
      },
      error: (error) => {
        console.error('Error loading projects for team:', error);
        this.teamProjects[teamId] = [];
      }
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

  getStateClass(state: number): string {
    return state.toString();
  }
}

