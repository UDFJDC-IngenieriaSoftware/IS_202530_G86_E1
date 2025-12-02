import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <mat-toolbar class="footer-toolbar">
      <div class="footer-content">
        <p>&copy; 2024 Universidad Distrital Francisco José de Caldas - Facultad de Ingeniería</p>
        <p>Sistema de Gestión de Grupos de Investigación</p>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .footer-toolbar {
      background-color: var(--primary-black) !important;
      color: var(--primary-white);
      padding: 16px 24px;
      margin-top: auto;
    }
    
    .footer-content {
      width: 100%;
      text-align: center;
      font-size: 0.9rem;
    }
    
    .footer-content p {
      margin: 4px 0;
    }
  `]
})
export class FooterComponent {}

