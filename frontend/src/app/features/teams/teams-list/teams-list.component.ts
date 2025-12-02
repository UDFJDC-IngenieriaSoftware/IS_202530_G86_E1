import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="teams-container">
      <div class="teams-header">
        <h1>Grupos de Investigación</h1>
        <p>Explora los grupos de investigación de la Facultad de Ingeniería</p>
      </div>

      <div class="filters">
        <mat-form-field appearance="fill" class="search-field form-field-light-blue">
          <mat-label style="display: none;">Buscar</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterTeams()" placeholder="Buscar" [disabled]="false">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="fill" class="filter-field form-field-light-blue">
          <mat-label style="display: none;">Filtrar por Área</mat-label>
          <mat-select [(ngModel)]="selectedAreaId" (selectionChange)="filterTeams()" placeholder="Filtrar por Área">
            <mat-option [value]="null">Todas las áreas</mat-option>
            @for (area of investigationAreas; track area.investigationAreaId) {
              <mat-option [value]="area.investigationAreaId">{{area.name}}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="teams-grid">
        @for (team of filteredTeams; track team.investigationTeamId) {
          <mat-card class="team-card">
            <mat-card-header>
              <mat-card-title>{{team.name}}</mat-card-title>
              <mat-card-subtitle>{{team.areaName}}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="team-description">{{team.description}}</p>
              <div class="team-info">
                <span><mat-icon>email</mat-icon> {{team.teamEmail}}</span>
                @if (team.coordinatorName) {
                  <span><mat-icon>person</mat-icon> {{team.coordinatorName}}</span>
                }
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" [routerLink]="['/teams', team.investigationTeamId]">
                Ver Detalles
              </button>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <div class="no-teams">
            <mat-icon>info</mat-icon>
            <p>No se encontraron grupos de investigación</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .teams-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .teams-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .teams-header h1 {
      color: var(--primary-black);
      margin-bottom: 8px;
    }
    
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    
    .filters mat-form-field {
      flex: 1;
      min-width: 200px;
    }
    
    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .team-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .team-description {
      color: #666;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .team-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.9rem;
      color: #666;
    }
    
    .team-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      vertical-align: middle;
      margin-right: 4px;
    }
    
    .no-teams {
      grid-column: 1 / -1;
      text-align: center;
      padding: 48px;
      color: #666;
    }
    
    .no-teams mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    /* Estilos para campos de búsqueda y filtro - mismo diseño que login/registro */
    .form-field-light-blue {
      cursor: text;
      background-color: transparent !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex {
      background-color: #E3F2FD !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: #E3F2FD !important;
      border-radius: 4px;
      border: none !important;
      border-bottom: none !important;
      border-bottom-width: 0 !important;
      border-bottom-style: none !important;
      box-shadow: none !important;
      cursor: text !important;
      min-height: 56px;
      height: 56px !important;
      position: relative;
      overflow: visible !important;
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper::after,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper::before {
      display: none !important;
      content: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex {
      background-color: #E3F2FD;
      cursor: text !important;
      min-height: 56px;
      height: 56px !important;
      align-items: center;
      border: none !important;
      border-bottom: none !important;
      overflow: visible !important;
    }

    .form-field-light-blue ::ng-deep input {
      color: var(--primary-black) !important;
      font-size: 1rem;
      cursor: text !important;
      min-height: 56px !important;
      height: 56px !important;
      line-height: 56px !important;
      padding: 0 16px 0 48px !important;
      width: 100% !important;
      box-sizing: border-box !important;
      overflow: visible !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-icon-prefix .mat-icon {
      color: var(--primary-black) !important;
      opacity: 0.7;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-notched-outline .mdc-notched-outline__leading,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-notched-outline .mdc-notched-outline__notch,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-notched-outline .mdc-notched-outline__trailing {
      border-color: transparent !important;
      border-width: 0 !important;
      display: none !important;
    }

    .form-field-light-blue ::ng-deep .mdc-notched-outline {
      display: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-line-ripple {
      display: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-line-ripple::before,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-line-ripple::after {
      display: none !important;
      content: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field {
      border-bottom: none !important;
      border-bottom-width: 0 !important;
      border-bottom-style: none !important;
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
      background-color: transparent !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper * {
      border-bottom: none !important;
    }

    /* Estilos para labels - negros y visibles */
    .form-field-light-blue ::ng-deep .mat-mdc-form-field-label {
      color: var(--primary-black) !important;
    }

    .form-field-light-blue ::ng-deep .mdc-floating-label {
      color: var(--primary-black) !important;
    }

    /* Estilos específicos para el select */
    .form-field-light-blue ::ng-deep .mat-mdc-select-trigger {
      cursor: pointer !important;
      min-height: 56px !important;
      height: 56px !important;
      display: flex;
      align-items: center !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #E3F2FD !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-value-container {
      padding: 0 16px 0 48px !important;
      width: 100% !important;
      background-color: #E3F2FD !important;
      display: flex !important;
      align-items: center !important;
      height: 56px !important;
      box-sizing: border-box !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-value-text {
      color: var(--primary-black) !important;
      background-color: transparent !important;
      display: flex !important;
      align-items: center !important;
      line-height: 1.5 !important;
      padding: 0 !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-value {
      padding: 0 !important;
      color: var(--primary-black) !important;
      background-color: transparent !important;
      display: flex !important;
      align-items: center !important;
      line-height: 1.5 !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-placeholder {
      padding: 0 !important;
      color: var(--primary-black) !important;
      opacity: 0.7 !important;
      display: flex !important;
      align-items: center !important;
      line-height: 1.5 !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-arrow {
      color: var(--primary-black) !important;
      opacity: 0.7;
    }

    /* Asegurar que todo el select tenga fondo claro */
    .form-field-light-blue ::ng-deep .mat-mdc-select {
      background-color: #E3F2FD !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select * {
      background-color: #E3F2FD !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
      color: var(--primary-black) !important;
    }
  `]
})
export class TeamsListComponent implements OnInit {
  teams: any[] = [];
  filteredTeams: any[] = [];
  investigationAreas: any[] = [];
  searchTerm = '';
  selectedAreaId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadInvestigationAreas();
  }

  loadTeams(): void {
    this.apiService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.filteredTeams = teams;
      },
      error: (error) => console.error('Error loading teams:', error)
    });
  }

  loadInvestigationAreas(): void {
    this.apiService.getInvestigationAreas().subscribe({
      next: (areas) => {
        this.investigationAreas = areas;
      },
      error: (error) => console.error('Error loading areas:', error)
    });
  }

  filterTeams(): void {
    this.filteredTeams = this.teams.filter(team => {
      const matchesSearch = !this.searchTerm || 
        team.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        team.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesArea = !this.selectedAreaId || team.areaId === this.selectedAreaId;
      
      return matchesSearch && matchesArea;
    });
  }
}

