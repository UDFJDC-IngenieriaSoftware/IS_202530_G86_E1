import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { ProjectDialogComponent } from '../../../shared/components/project-dialog/project-dialog.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule
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

      <!-- Filtros y búsqueda -->
      <mat-card class="filters-card">
        <div class="filters-container">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar por título</mat-label>
            <input matInput [(ngModel)]="searchText" (ngModelChange)="applyFilters()" placeholder="Escribe para buscar...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filtrar por Estado</mat-label>
            <mat-select [(ngModel)]="selectedState" (ngModelChange)="applyFilters()">
              <mat-option [value]="null">Todos</mat-option>
              <mat-option [value]="1">Activo</mat-option>
              <mat-option [value]="2">En desarrollo</mat-option>
              <mat-option [value]="3">Finalizado</mat-option>
              <mat-option [value]="4">Cancelado</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filtrar por Grupo</mat-label>
            <mat-select [(ngModel)]="selectedTeam" (ngModelChange)="applyFilters()">
              <mat-option [value]="null">Todos</mat-option>
              @for (team of uniqueTeams; track team) {
                <mat-option [value]="team">{{team}}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filtrar por Tipo</mat-label>
            <mat-select [(ngModel)]="selectedProductType" (ngModelChange)="applyFilters()">
              <mat-option [value]="null">Todos</mat-option>
              @for (type of uniqueProductTypes; track type) {
                <mat-option [value]="type">{{type}}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          @if (hasActiveFilters()) {
            <button mat-button (click)="clearFilters()" class="clear-filters-btn">
              <mat-icon>clear</mat-icon>
              Limpiar Filtros
            </button>
          }
        </div>
      </mat-card>

      @if (filteredProjects.length > 0) {
        <mat-card>
          <table mat-table [dataSource]="filteredProjects">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Título</th>
              <td mat-cell *matCellDef="let project">{{project.title}}</td>
            </ng-container>

            <ng-container matColumnDef="teamName">
              <th mat-header-cell *matHeaderCellDef>Grupo</th>
              <td mat-cell *matCellDef="let project">{{project.teamName}}</td>
            </ng-container>

            <ng-container matColumnDef="productTypeName">
              <th mat-header-cell *matHeaderCellDef>Tipo de Proyecto</th>
              <td mat-cell *matCellDef="let project">
                @if (project.productTypeName) {
                  <mat-chip>{{project.productTypeName}}</mat-chip>
                } @else {
                  <span class="no-type">Sin tipo</span>
                }
              </td>
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
      } @else if (projects.length > 0) {
        <mat-card>
          <p class="no-results">No se encontraron proyectos con los filtros aplicados</p>
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
    
    .filters-card {
      margin-bottom: 24px;
    }
    
    .filters-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }
    
    .search-field {
      flex: 1;
      min-width: 250px;
    }
    
    .filter-field {
      min-width: 180px;
    }
    
    .clear-filters-btn {
      margin-left: auto;
    }
    
    .no-projects, .no-results {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    
    .no-type {
      color: #999;
      font-style: italic;
    }
    
    mat-chip {
      background-color: #e3f2fd;
      color: #1976d2;
    }
  `]
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  displayedColumns: string[] = ['title', 'teamName', 'productTypeName', 'state', 'actions'];
  
  // Filtros
  searchText: string = '';
  selectedState: number | null = null;
  selectedTeam: string | null = null;
  selectedProductType: string | null = null;
  
  // Opciones únicas para los filtros
  uniqueTeams: string[] = [];
  uniqueProductTypes: string[] = [];

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
        this.extractUniqueValues();
        this.applyFilters();
      },
      error: (error: any) => console.error('Error loading projects:', error)
    });
  }

  extractUniqueValues(): void {
    // Extraer equipos únicos
    this.uniqueTeams = [...new Set(this.projects.map(p => p.teamName).filter(Boolean))].sort();
    
    // Extraer tipos de producto únicos
    this.uniqueProductTypes = [...new Set(
      this.projects
        .map(p => p.productTypeName)
        .filter(Boolean)
    )].sort();
  }

  applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      // Filtro por texto (título)
      const matchesSearch = !this.searchText || 
        project.title.toLowerCase().includes(this.searchText.toLowerCase());
      
      // Filtro por estado
      const matchesState = this.selectedState === null || project.state === this.selectedState;
      
      // Filtro por equipo
      const matchesTeam = this.selectedTeam === null || project.teamName === this.selectedTeam;
      
      // Filtro por tipo de producto
      const matchesProductType = this.selectedProductType === null || 
        project.productTypeName === this.selectedProductType;
      
      return matchesSearch && matchesState && matchesTeam && matchesProductType;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedState = null;
    this.selectedTeam = null;
    this.selectedProductType = null;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchText ||
      this.selectedState !== null ||
      this.selectedTeam !== null ||
      this.selectedProductType !== null
    );
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

