import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe o ha sido movida.</p>
      <button mat-raised-button color="primary" routerLink="/home">
        <mat-icon>home</mat-icon>
        Volver al Inicio
      </button>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
      text-align: center;
      padding: 24px;
    }
    
    .error-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: var(--primary-blue);
      margin-bottom: 24px;
    }
    
    h1 {
      font-size: 4rem;
      color: var(--primary-black);
      margin-bottom: 16px;
    }
    
    h2 {
      color: var(--primary-black);
      margin-bottom: 16px;
    }
    
    p {
      color: #666;
      margin-bottom: 32px;
    }
  `]
})
export class NotFoundComponent {}

