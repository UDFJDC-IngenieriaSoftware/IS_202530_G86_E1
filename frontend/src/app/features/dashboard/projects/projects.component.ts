import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { ProjectDialogComponent } from '../../../shared/components/project-dialog/project-dialog.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="projects-container">
      <div class="header">
        <h1>Proyectos de Investigación</h1>
        <button mat-raised-button color="primary" (click)="createProject()">
          <mat-icon>add</mat-icon>
          Nuevo Proyecto
        </button>
      </div>

      @if (projects.length > 0) {
        <mat-card>
          <table mat-table [dataSource]="projects">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Título</th>
              <td mat-cell *matCellDef="let project">{{project.title}}</td>
            </ng-container>

            <ng-container matColumnDef="teamName">
              <th mat-header-cell *matHeaderCellDef>Grupo</th>
              <td mat-cell *matCellDef="let project">{{project.teamName}}</td>
            </ng-container>

            <ng-container matColumnDef="state">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let project">{{getStateLabel(project.state)}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let project">
                <button mat-icon-button (click)="editProject(project)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteProject(project)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card>
      } @else {
        <mat-card>
          <p class="no-projects">No hay proyectos registrados</p>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .projects-container {
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
    
    .no-projects {
      text-align: center;
      padding: 32px;
      color: #666;
    }
  `]
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  displayedColumns: string[] = ['title', 'teamName', 'state', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.apiService.getProjects().subscribe({
      next: (projects: any[]) => {
        this.projects = projects;
      },
      error: (error: any) => console.error('Error loading projects:', error)
    });
  }

  createProject(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.createProject(result).subscribe({
          next: () => {
            this.snackBar.open('Proyecto creado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadProjects();
          },
          error: (error: any) => {
            console.error('Error creating project:', error);
            this.snackBar.open('Error al crear proyecto', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  editProject(project: any): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '600px',
      data: { project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updateProject(project.investigationProjectId, result).subscribe({
          next: () => {
            this.snackBar.open('Proyecto actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadProjects();
          },
          error: (error: any) => {
            console.error('Error updating project:', error);
            this.snackBar.open('Error al actualizar proyecto', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteProject(project: any): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.title}"?`)) {
      this.apiService.deleteProject(project.investigationProjectId).subscribe({
        next: () => {
          this.snackBar.open('Proyecto eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadProjects();
        },
        error: (error: any) => {
          console.error('Error deleting project:', error);
          this.snackBar.open('Error al eliminar proyecto', 'Cerrar', { duration: 3000 });
        }
      });
    }
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
}

