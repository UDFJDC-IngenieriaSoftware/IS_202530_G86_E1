import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationResponseDialogComponent } from '../../../shared/components/application-response-dialog/application-response-dialog.component';
import { TeamDialogComponent } from '../../../shared/components/team-dialog/team-dialog.component';

@Component({
  selector: 'app-my-teams',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="my-teams-container">
      <div class="header">
        @if (authService.hasRole('ADMINISTRADOR')) {
          <h1>Grupos de Investigación</h1>
        } @else {
          <h1>Mis Grupos de Investigación</h1>
        }
        @if (authService.hasRole('ADMINISTRADOR') || authService.hasRole('COORDINADOR')) {
          <button mat-raised-button color="primary" (click)="createTeam()">
            <mat-icon>add</mat-icon>
            Crear Grupo
          </button>
        }
      </div>

      @if (teams.length > 0) {
        <div class="teams-list">
          @for (team of teams; track team.investigationTeamId) {
            <mat-card class="team-card">
              <mat-card-header>
                <mat-card-title>{{team.name}}</mat-card-title>
                <mat-card-subtitle>{{team.areaName}}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>{{team.description}}</p>
                
                @if (authService.hasRole('ADMINISTRADOR')) {
                  <div class="coordinator-info">
                    <mat-icon>person</mat-icon>
                    @if (team.coordinatorName) {
                      <span><strong>Coordinador:</strong> {{team.coordinatorName}} ({{team.coordinatorEmail}})</span>
                    } @else {
                      <span><strong>Coordinador:</strong> <em>Sin asignar</em></span>
                    }
                  </div>
                }
                
                <mat-expansion-panel class="applications-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon>inbox</mat-icon>
                      Solicitudes de Vinculación
                      @if (getPendingCount(team.investigationTeamId) > 0) {
                        <span class="badge">{{getPendingCount(team.investigationTeamId)}}</span>
                      }
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  
                  @if (teamApplications[team.investigationTeamId] && teamApplications[team.investigationTeamId].length > 0) {
                    <table mat-table [dataSource]="teamApplications[team.investigationTeamId]!" class="applications-table">
                      <ng-container matColumnDef="userName">
                        <th mat-header-cell *matHeaderCellDef>Nombre</th>
                        <td mat-cell *matCellDef="let app">{{app.userName}}</td>
                      </ng-container>

                      <ng-container matColumnDef="userRole">
                        <th mat-header-cell *matHeaderCellDef>Rol</th>
                        <td mat-cell *matCellDef="let app">
                          <mat-chip 
                            [class]="'role-' + (app.userRole || 'ESTUDIANTE').toLowerCase()"
                            [style.background-color]="getRoleColor(app.userRole || 'ESTUDIANTE')"
                            [style.color]="'white'">
                            {{getRoleLabel(app.userRole || 'ESTUDIANTE')}}
                          </mat-chip>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="userEmail">
                        <th mat-header-cell *matHeaderCellDef>Email</th>
                        <td mat-cell *matCellDef="let app">{{app.userEmail}}</td>
                      </ng-container>

                      <ng-container matColumnDef="applicationDate">
                        <th mat-header-cell *matHeaderCellDef>Fecha</th>
                        <td mat-cell *matCellDef="let app">{{app.applicationDate | date:'short'}}</td>
                      </ng-container>

                      <ng-container matColumnDef="state">
                        <th mat-header-cell *matHeaderCellDef>Estado</th>
                        <td mat-cell *matCellDef="let app">
                          <mat-chip [class]="'state-' + app.state.toLowerCase()">
                            {{getStateLabel(app.state)}}
                          </mat-chip>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="message">
                        <th mat-header-cell *matHeaderCellDef>Mensaje</th>
                        <td mat-cell *matCellDef="let app">{{app.applicationMessage}}</td>
                      </ng-container>

                      <ng-container matColumnDef="actions">
                        <th mat-header-cell *matHeaderCellDef>Acciones</th>
                        <td mat-cell *matCellDef="let app">
                          @if (!authService.hasRole('ADMINISTRADOR')) {
                            @if (app.state === 'PENDIENTE') {
                              <button mat-button color="primary" (click)="respondApplication(app, 'APROBADA')">
                                <mat-icon>check</mat-icon>
                                Aprobar
                              </button>
                              <button mat-button color="warn" (click)="respondApplication(app, 'RECHAZADA')">
                                <mat-icon>close</mat-icon>
                                Rechazar
                              </button>
                            } @else {
                              <span class="answer-info">
                                @if (app.answerMessage) {
                                  <mat-icon>info</mat-icon>
                                  Respondido: {{app.answerMessage}}
                                }
                              </span>
                            }
                          } @else {
                            <span class="answer-info">
                              @if (app.answerMessage) {
                                <mat-icon>info</mat-icon>
                                Respondido: {{app.answerMessage}}
                              } @else {
                                <span class="no-answer">Solo lectura</span>
                              }
                            </span>
                          }
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                    </table>
                  } @else {
                    <p class="no-applications">No hay solicitudes para este equipo</p>
                  }
                </mat-expansion-panel>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button [routerLink]="['/teams', team.investigationTeamId]">Ver Detalles</button>
                @if (authService.hasRole('ADMINISTRADOR')) {
                  <button mat-button (click)="editTeam(team)">Editar</button>
                } @else {
                  <button mat-button (click)="editTeam(team)">Editar</button>
                }
              </mat-card-actions>
            </mat-card>
          }
        </div>
      } @else {
        <mat-card>
          @if (authService.hasRole('ADMINISTRADOR')) {
            <p class="no-teams">No hay grupos registrados</p>
          } @else {
            <p class="no-teams">No tienes grupos registrados</p>
          }
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    
    .teams-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .team-card {
      width: 100%;
    }
    
    .applications-panel {
      margin-top: 16px;
    }
    
    .applications-panel mat-panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .badge {
      background-color: #ff9800;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .applications-table {
      width: 100%;
      margin-top: 16px;
    }
    
    .state-pendiente {
      background-color: #ff9800;
      color: white;
    }
    
    .state-aprobada {
      background-color: #4caf50;
      color: white;
    }
    
    .state-rechazada {
      background-color: #f44336;
      color: white;
    }
    
    .no-applications {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    
    .no-teams {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    
    .answer-info {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 0.9rem;
    }
    
    .no-answer {
      color: #999;
      font-style: italic;
      font-size: 0.9rem;
    }
    
    .role-estudiante {
      background-color: #4caf50 !important;
      color: white !important;
    }
    
    .role-docente {
      background-color: #2196f3 !important;
      color: white !important;
    }
    
    .role-coordinador {
      background-color: #ff9800 !important;
      color: white !important;
    }
    
    .role-administrador {
      background-color: #9c27b0 !important;
      color: white !important;
    }
    
    ::ng-deep .role-estudiante {
      background-color: #4caf50 !important;
      color: white !important;
    }
    
    ::ng-deep .role-docente {
      background-color: #2196f3 !important;
      color: white !important;
    }
    
    ::ng-deep .role-coordinador {
      background-color: #ff9800 !important;
      color: white !important;
    }
    
    ::ng-deep .role-administrador {
      background-color: #9c27b0 !important;
      color: white !important;
    }
    
    .coordinator-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    
    .coordinator-info mat-icon {
      color: var(--primary-blue);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .coordinator-info strong {
      color: var(--primary-black);
    }
  `]
})
export class MyTeamsComponent implements OnInit {
  teams: any[] = [];
  teamApplications: { [key: number]: any[] } = {};
  displayedColumns: string[] = ['userName', 'userRole', 'userEmail', 'applicationDate', 'state', 'message', 'actions'];
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    console.log('MyTeamsComponent - Loading teams...');
    // Si es administrador, cargar todos los grupos; si no, cargar solo los que coordina
    const teamsObservable = this.authService.hasRole('ADMINISTRADOR') 
      ? this.apiService.getTeams() 
      : this.apiService.getMyTeams();
    
    teamsObservable.subscribe({
      next: (teams: any[]) => {
        console.log('MyTeamsComponent - Teams received:', teams);
        console.log('MyTeamsComponent - Teams count:', teams.length);
        this.teams = teams || [];
        
        // Cargar solicitudes para cada equipo (solo si no es administrador o si el equipo tiene coordinador)
        teams.forEach((team: any) => {
          // Los administradores pueden ver las solicitudes pero no responderlas
          if (!this.authService.hasRole('ADMINISTRADOR') || team.coordinatorId) {
            this.loadApplicationsForTeam(team.investigationTeamId);
          }
        });
      },
      error: (error: any) => {
        console.error('MyTeamsComponent - Error loading teams:', error);
        console.error('MyTeamsComponent - Error status:', error.status);
        console.error('MyTeamsComponent - Error message:', error.message);
        this.teams = [];
      }
    });
  }

  loadApplicationsForTeam(teamId: number): void {
    this.apiService.getApplicationsByTeam(teamId).subscribe({
      next: (applications) => {
        this.teamApplications[teamId] = applications;
      },
      error: (error) => {
        console.error('Error loading applications for team:', error);
        this.teamApplications[teamId] = [];
      }
    });
  }

  getPendingCount(teamId: number): number {
    const apps = this.teamApplications[teamId] || [];
    return apps.filter(app => app.state === 'PENDIENTE').length;
  }

  getStateLabel(state: string): string {
    const labels: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'APROBADA': 'Aprobada',
      'RECHAZADA': 'Rechazada'
    };
    return labels[state] || state;
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ESTUDIANTE': 'Estudiante',
      'DOCENTE': 'Docente',
      'COORDINADOR': 'Coordinador',
      'ADMINISTRADOR': 'Administrador'
    };
    return labels[role] || role;
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'ESTUDIANTE': '#4caf50',
      'DOCENTE': '#2196f3',
      'COORDINADOR': '#ff9800',
      'ADMINISTRADOR': '#9c27b0'
    };
    return colors[role] || '#757575';
  }

  respondApplication(application: any, newState: string): void {
    const dialogRef = this.dialog.open(ApplicationResponseDialogComponent, {
      width: '500px',
      data: { 
        application, 
        state: newState 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updateApplicationStatus(
          application.applicationId, 
          newState, 
          result.message
        ).subscribe({
          next: () => {
            this.snackBar.open(
              `Solicitud ${newState === 'APROBADA' ? 'aprobada' : 'rechazada'} exitosamente`, 
              'Cerrar', 
              { duration: 3000 }
            );
            // Recargar solicitudes del equipo
            this.loadApplicationsForTeam(application.investigationTeamId);
          },
          error: (error) => {
            console.error('Error updating application:', error);
            this.snackBar.open('Error al actualizar la solicitud', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  createTeam(): void {
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.createTeam(result).subscribe({
          next: () => {
            this.snackBar.open('Grupo creado exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadTeams(); // Recargar la lista
            // Refrescar el usuario por si cambió su rol (si el admin asignó un docente como coordinador)
            // Delay para asegurar que el backend haya procesado el cambio
            setTimeout(() => {
              this.authService.refreshUser();
            }, 1000);
          },
          error: (error) => {
            console.error('Error creating team:', error);
            const errorMessage = error.error?.message || 'Error al crear el grupo';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  editTeam(team: any): void {
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      width: '600px',
      data: { team }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.updateTeam(team.investigationTeamId, result).subscribe({
          next: () => {
            this.snackBar.open('Grupo actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadTeams(); // Recargar la lista
            // Refrescar el usuario por si cambió su rol
            // Delay para asegurar que el backend haya procesado el cambio
            setTimeout(() => {
              this.authService.refreshUser();
            }, 1000);
          },
          error: (error) => {
            console.error('Error updating team:', error);
            const errorMessage = error.error?.message || 'Error al actualizar el grupo';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }
}

