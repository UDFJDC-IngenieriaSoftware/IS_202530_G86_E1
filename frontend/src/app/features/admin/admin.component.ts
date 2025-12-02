import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  template: `
    <div class="admin-container">
      <h1>Panel de Administración</h1>
      <div class="admin-cards">
        <mat-card class="admin-card" routerLink="/admin/users">
          <mat-card-content>
            <mat-icon>people</mat-icon>
            <h3>Gestión de Usuarios</h3>
            <p>Administra usuarios y roles del sistema</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .admin-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
      margin-top: 32px;
    }
    
    .admin-card {
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .admin-card:hover {
      transform: translateY(-4px);
    }
    
    .admin-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--primary-blue);
      margin-bottom: 16px;
    }
  `]
})
export class AdminComponent {}

