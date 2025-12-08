import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectAreaDialogComponent } from '../../../shared/components/project-area-dialog/project-area-dialog.component';
import { InvestigationAreaDialogComponent } from '../../../shared/components/investigation-area-dialog/investigation-area-dialog.component';

@Component({
  selector: 'app-project-areas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatChipsModule
  ],
  template: `
    <div class="project-areas-container">
      <div class="header">
        <h1>Proyectos Curriculares</h1>
        <button mat-raised-button color="primary" (click)="createProjectArea()">
          <mat-icon>add</mat-icon>
          Nuevo Proyecto Curricular
        </button>
      </div>

      @if (projectAreas.length > 0) {
        <div class="project-areas-list">
          @for (area of projectAreas; track area.proyectAreaId) {
            <mat-card class="project-area-card">
              <mat-card-header class="project-area-header">
                <div class="header-content">
                  <div>
                    <mat-card-title>{{area.name}}</mat-card-title>
                    <mat-card-subtitle>{{area.projectEmail}}</mat-card-subtitle>
                  </div>
                  <div class="card-actions">
                    <button mat-icon-button (click)="editProjectArea(area)" title="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    @if (canDeleteProjectArea(area.proyectAreaId)) {
                      <button mat-icon-button (click)="deleteProjectArea(area)" title="Eliminar">
                        <mat-icon>delete</mat-icon>
                      </button>
                    }
                  </div>
                </div>
              </mat-card-header>
              
              <mat-card-content>
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <span class="panel-title-content">
                        <mat-icon>science</mat-icon>
                        <span>Áreas de Investigación</span>
                        @if (getInvestigationAreasCount(area.proyectAreaId) > 0) {
                          <span class="badge">{{getInvestigationAreasCount(area.proyectAreaId)}}</span>
                        }
                      </span>
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  
                  <div class="investigation-areas-section">
                    <button mat-raised-button color="primary" (click)="createInvestigationArea(area)" class="add-button">
                      <mat-icon>add</mat-icon>
                      Nueva Área de Investigación
                    </button>
                    
                    @if (investigationAreas[area.proyectAreaId] && investigationAreas[area.proyectAreaId].length > 0) {
                      <table mat-table [dataSource]="investigationAreas[area.proyectAreaId]!" class="investigation-areas-table">
                        <ng-container matColumnDef="name">
                          <th mat-header-cell *matHeaderCellDef>Nombre</th>
                          <td mat-cell *matCellDef="let invArea">{{invArea.name}}</td>
                        </ng-container>

                        <ng-container matColumnDef="description">
                          <th mat-header-cell *matHeaderCellDef>Descripción</th>
                          <td mat-cell *matCellDef="let invArea">{{invArea.description}}</td>
                        </ng-container>

                        <ng-container matColumnDef="actions">
                          <th mat-header-cell *matHeaderCellDef>Acciones</th>
                          <td mat-cell *matCellDef="let invArea">
                            <button mat-icon-button (click)="editInvestigationArea(invArea)" title="Editar">
                              <mat-icon>edit</mat-icon>
                            </button>
                            <button mat-icon-button (click)="deleteInvestigationArea(invArea)" title="Eliminar">
                              <mat-icon>delete</mat-icon>
                            </button>
                          </td>
                        </ng-container>

                        <tr mat-header-row *matHeaderRowDef="investigationAreaColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: investigationAreaColumns;"></tr>
                      </table>
                    } @else {
                      <p class="no-items">No hay áreas de investigación registradas</p>
                    }
                  </div>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <span class="panel-title-content">
                        <mat-icon>people</mat-icon>
                        <span>Usuarios</span>
                        @if (getUsersCount(area.proyectAreaId) > 0) {
                          <span class="badge">{{getUsersCount(area.proyectAreaId)}}</span>
                        }
                      </span>
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  
                  <div class="users-section">
                    @if (users[area.proyectAreaId] && (users[area.proyectAreaId].students.length > 0 || users[area.proyectAreaId].teachers.length > 0)) {
                      @if (users[area.proyectAreaId].students.length > 0) {
                        <h4>Estudiantes</h4>
                        <table mat-table [dataSource]="users[area.proyectAreaId].students" class="users-table">
                          <ng-container matColumnDef="name">
                            <th mat-header-cell *matHeaderCellDef>Nombre</th>
                            <td mat-cell *matCellDef="let user">{{user.name}}</td>
                          </ng-container>

                          <ng-container matColumnDef="email">
                            <th mat-header-cell *matHeaderCellDef>Email</th>
                            <td mat-cell *matCellDef="let user">{{user.email}}</td>
                          </ng-container>

                          <ng-container matColumnDef="role">
                            <th mat-header-cell *matHeaderCellDef>Rol</th>
                            <td mat-cell *matCellDef="let user">
                              <mat-chip [style.background-color]="getRoleColor(user.role)" [style.color]="'white'">
                                {{getRoleLabel(user.role)}}
                              </mat-chip>
                            </td>
                          </ng-container>

                          <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                          <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
                        </table>
                      }

                      @if (users[area.proyectAreaId].teachers.length > 0) {
                        <h4>Docentes</h4>
                        <table mat-table [dataSource]="users[area.proyectAreaId].teachers" class="users-table">
                          <ng-container matColumnDef="name">
                            <th mat-header-cell *matHeaderCellDef>Nombre</th>
                            <td mat-cell *matCellDef="let user">{{user.name}}</td>
                          </ng-container>

                          <ng-container matColumnDef="email">
                            <th mat-header-cell *matHeaderCellDef>Email</th>
                            <td mat-cell *matCellDef="let user">{{user.email}}</td>
                          </ng-container>

                          <ng-container matColumnDef="role">
                            <th mat-header-cell *matHeaderCellDef>Rol</th>
                            <td mat-cell *matCellDef="let user">
                              <mat-chip [style.background-color]="getRoleColor(user.role)" [style.color]="'white'">
                                {{getRoleLabel(user.role)}}
                              </mat-chip>
                            </td>
                          </ng-container>

                          <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                          <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
                        </table>
                      }
                    } @else {
                      <p class="no-items">No hay usuarios registrados en este proyecto curricular</p>
                    }
                  </div>
                </mat-expansion-panel>
              </mat-card-content>
            </mat-card>
          }
        </div>
      } @else {
        <mat-card>
          <p class="no-areas">No hay proyectos curriculares registrados</p>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .project-areas-container {
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
    
    .no-areas {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    
    table {
      width: 100%;
    }
    
    .project-areas-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .project-area-card {
      width: 100%;
    }
    
    .project-area-header {
      width: 100%;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .card-actions {
      display: flex;
      gap: 8px;
    }
    
    .panel-title-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .panel-title-content mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    mat-expansion-panel {
      margin-top: 16px;
    }
    
    .investigation-areas-section, .users-section {
      padding: 16px 0;
    }
    
    .add-button {
      margin-bottom: 16px;
    }
    
    .investigation-areas-table, .users-table {
      width: 100%;
      margin-top: 16px;
    }
    
    .badge {
      background-color: #ff9800;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: bold;
      margin-left: 8px;
    }
    
    .no-items {
      text-align: center;
      padding: 24px;
      color: #999;
      font-style: italic;
    }
    
    h4 {
      margin-top: 24px;
      margin-bottom: 16px;
      color: var(--primary-black);
    }
    
    h4:first-child {
      margin-top: 0;
    }
  `]
})
export class ProjectAreasComponent implements OnInit {
  projectAreas: any[] = [];
  displayedColumns: string[] = ['name', 'projectEmail', 'actions'];
  investigationAreaColumns: string[] = ['name', 'description', 'actions'];
  userColumns: string[] = ['name', 'email', 'role'];
  investigationAreas: { [key: number]: any[] } = {};
  users: { [key: number]: { students: any[], teachers: any[] } } = {};
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProjectAreas();
  }

  loadProjectAreas(): void {
    this.loading = true;
    this.apiService.getProjectAreasAdmin().subscribe({
      next: (areas: any[]) => {
        this.projectAreas = areas;
        // Cargar áreas de investigación y usuarios para cada proyecto
        areas.forEach(area => {
          this.loadInvestigationAreas(area.proyectAreaId);
          this.loadUsers(area.proyectAreaId);
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading project areas:', error);
        this.snackBar.open('Error al cargar proyectos curriculares', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadInvestigationAreas(projectAreaId: number): void {
    this.apiService.getInvestigationAreasByProjectArea(projectAreaId).subscribe({
      next: (areas: any[]) => {
        this.investigationAreas[projectAreaId] = areas;
      },
      error: (error: any) => {
        console.error('Error loading investigation areas:', error);
      }
    });
  }

  loadUsers(projectAreaId: number): void {
    this.apiService.getUsersByProjectArea(projectAreaId).subscribe({
      next: (data: any) => {
        this.users[projectAreaId] = {
          students: data.students || [],
          teachers: data.teachers || []
        };
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
      }
    });
  }

  getInvestigationAreasCount(projectAreaId: number): number {
    return this.investigationAreas[projectAreaId]?.length || 0;
  }

  getUsersCount(projectAreaId: number): number {
    const userData = this.users[projectAreaId];
    if (!userData) return 0;
    return (userData.students?.length || 0) + (userData.teachers?.length || 0);
  }

  canDeleteProjectArea(projectAreaId: number): boolean {
    // Verificar si hay usuarios (estudiantes o docentes)
    const userData = this.users[projectAreaId];
    const hasUsers = userData && ((userData.students?.length || 0) > 0 || (userData.teachers?.length || 0) > 0);
    
    // Verificar si hay áreas de investigación
    // Si investigationAreas[projectAreaId] existe (aunque sea un array vacío), significa que ya se cargó
    const investigationAreasData = this.investigationAreas[projectAreaId];
    const hasInvestigationAreas = investigationAreasData && investigationAreasData.length > 0;
    
    // Si los datos aún no se han cargado (no existe la clave), asumir que no se puede eliminar por seguridad
    // Esto evita mostrar el botón antes de que se carguen los datos
    const dataLoaded = userData !== undefined && investigationAreasData !== undefined;
    
    // Solo se puede eliminar si los datos están cargados Y no hay usuarios ni áreas de investigación
    return dataLoaded && !hasUsers && !hasInvestigationAreas;
  }

  createInvestigationArea(projectArea: any): void {
    const dialogRef = this.dialog.open(InvestigationAreaDialogComponent, {
      width: '600px',
      data: { projectAreaId: projectArea.proyectAreaId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.createInvestigationArea(result).subscribe({
          next: () => {
            this.snackBar.open('Área de investigación creada exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadInvestigationAreas(projectArea.proyectAreaId);
          },
          error: (error: any) => {
            console.error('Error creating investigation area:', error);
            const errorMessage = error.error?.message || 'Error al crear área de investigación';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  editInvestigationArea(investigationArea: any): void {
    const dialogRef = this.dialog.open(InvestigationAreaDialogComponent, {
      width: '600px',
      data: { investigationArea }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.updateInvestigationArea(investigationArea.investigationAreaId, result).subscribe({
          next: () => {
            this.snackBar.open('Área de investigación actualizada exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadInvestigationAreas(investigationArea.projectAreaId);
          },
          error: (error: any) => {
            console.error('Error updating investigation area:', error);
            const errorMessage = error.error?.message || 'Error al actualizar área de investigación';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  deleteInvestigationArea(investigationArea: any): void {
    if (confirm(`¿Está seguro de que desea eliminar el área de investigación "${investigationArea.name}"?`)) {
      this.loading = true;
      this.apiService.deleteInvestigationArea(investigationArea.investigationAreaId).subscribe({
        next: () => {
          this.snackBar.open('Área de investigación eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.loadInvestigationAreas(investigationArea.projectAreaId);
        },
        error: (error: any) => {
          console.error('Error deleting investigation area:', error);
          const errorMessage = error.error?.message || 'Error al eliminar área de investigación';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
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

  createProjectArea(): void {
    const dialogRef = this.dialog.open(ProjectAreaDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.createProjectArea(result).subscribe({
          next: () => {
            this.snackBar.open('Proyecto curricular creado exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadProjectAreas();
          },
          error: (error: any) => {
            console.error('Error creating project area:', error);
            const errorMessage = error.error?.message || 'Error al crear proyecto curricular';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  editProjectArea(projectArea: any): void {
    const dialogRef = this.dialog.open(ProjectAreaDialogComponent, {
      width: '500px',
      data: { projectArea }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.updateProjectArea(projectArea.proyectAreaId, result).subscribe({
          next: () => {
            this.snackBar.open('Proyecto curricular actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadProjectAreas();
          },
          error: (error: any) => {
            console.error('Error updating project area:', error);
            const errorMessage = error.error?.message || 'Error al actualizar proyecto curricular';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  deleteProjectArea(projectArea: any): void {
    if (confirm(`¿Está seguro de que desea eliminar el proyecto curricular "${projectArea.name}"?`)) {
      this.loading = true;
      this.apiService.deleteProjectArea(projectArea.proyectAreaId).subscribe({
        next: () => {
          this.snackBar.open('Proyecto curricular eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.loadProjectAreas();
        },
        error: (error: any) => {
          console.error('Error deleting project area:', error);
          const errorMessage = error.error?.message || 'Error al eliminar proyecto curricular';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}

