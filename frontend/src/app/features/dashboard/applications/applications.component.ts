import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, MatIconModule],
  template: `
    <div class="applications-container">
      <h1>Mis Solicitudes de Vinculación</h1>
      
      @if (applications.length > 0) {
        <mat-card>
          <table mat-table [dataSource]="applications" class="applications-table">
            <ng-container matColumnDef="teamName">
              <th mat-header-cell *matHeaderCellDef>Grupo</th>
              <td mat-cell *matCellDef="let application">{{application.teamName}}</td>
            </ng-container>

            <ng-container matColumnDef="applicationDate">
              <th mat-header-cell *matHeaderCellDef>Fecha de Solicitud</th>
              <td mat-cell *matCellDef="let application">{{application.applicationDate | date:'short'}}</td>
            </ng-container>

            <ng-container matColumnDef="state">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let application">
                <mat-chip [class]="'state-' + application.state.toLowerCase()">
                  {{getStateLabel(application.state)}}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="message">
              <th mat-header-cell *matHeaderCellDef>Mi Mensaje</th>
              <td mat-cell *matCellDef="let application">{{application.applicationMessage}}</td>
            </ng-container>

            <ng-container matColumnDef="answerDate">
              <th mat-header-cell *matHeaderCellDef>Fecha de Respuesta</th>
              <td mat-cell *matCellDef="let application">
                @if (application.answerDate) {
                  {{application.answerDate | date:'short'}}
                } @else {
                  <span class="no-answer">-</span>
                }
              </td>
            </ng-container>

            <ng-container matColumnDef="answerMessage">
              <th mat-header-cell *matHeaderCellDef>Respuesta del Coordinador</th>
              <td mat-cell *matCellDef="let application">
                @if (application.answerMessage) {
                  <div class="answer-message">
                    <mat-icon>reply</mat-icon>
                    {{application.answerMessage}}
                  </div>
                } @else {
                  <span class="no-answer">Pendiente de respuesta</span>
                }
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card>
      } @else {
        <mat-card>
          <p class="no-applications">No tienes solicitudes de vinculación</p>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .applications-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .applications-table {
      width: 100%;
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
    
    .answer-message {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
      border-left: 3px solid var(--primary-blue, #1976d2);
    }
    
    .answer-message mat-icon {
      color: var(--primary-blue, #1976d2);
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-top: 2px;
    }
    
    .no-answer {
      color: #999;
      font-style: italic;
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  applications: any[] = [];
  displayedColumns: string[] = ['teamName', 'applicationDate', 'state', 'message', 'answerDate', 'answerMessage'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.apiService.getMyApplications().subscribe({
      next: (applications) => {
        console.log('Applications loaded:', applications);
        console.log('Displayed columns:', this.displayedColumns);
        this.applications = applications;
      },
      error: (error) => console.error('Error loading applications:', error)
    });
  }

  getStateLabel(state: string): string {
    const labels: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'APROBADA': 'Aprobada',
      'RECHAZADA': 'Rechazada'
    };
    return labels[state] || state;
  }
}

