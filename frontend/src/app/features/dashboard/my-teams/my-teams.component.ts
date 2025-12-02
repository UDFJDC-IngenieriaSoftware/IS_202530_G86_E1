import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-my-teams',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="my-teams-container">
      <div class="header">
        <h1>Mis Grupos de Investigación</h1>
        <button mat-raised-button color="primary" (click)="createTeam()">
          <mat-icon>add</mat-icon>
          Crear Grupo
        </button>
      </div>

      @if (teams.length > 0) {
        <div class="teams-grid">
          @for (team of teams; track team.investigationTeamId) {
            <mat-card class="team-card">
              <mat-card-header>
                <mat-card-title>{{team.name}}</mat-card-title>
                <mat-card-subtitle>{{team.areaName}}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>{{team.description}}</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button [routerLink]="['/teams', team.investigationTeamId]">Ver Detalles</button>
                <button mat-button (click)="editTeam(team)">Editar</button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      } @else {
        <mat-card>
          <p class="no-teams">No tienes grupos registrados</p>
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
    
    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .no-teams {
      text-align: center;
      padding: 32px;
      color: #666;
    }
  `]
})
export class MyTeamsComponent implements OnInit {
  teams: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    // TODO: Implementar endpoint para obtener grupos del coordinador actual
    this.apiService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams; // Filtrar por coordinador
      },
      error: (error) => console.error('Error loading teams:', error)
    });
  }

  createTeam(): void {
    // TODO: Implementar diálogo de creación
  }

  editTeam(team: any): void {
    // TODO: Implementar edición
  }
}

