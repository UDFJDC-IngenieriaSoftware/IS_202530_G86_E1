import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.apiService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  createProject(): void {
    // TODO: Implementar diálogo de creación
  }

  editProject(project: any): void {
    // TODO: Implementar edición
  }

  deleteProject(project: any): void {
    // TODO: Implementar eliminación
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

