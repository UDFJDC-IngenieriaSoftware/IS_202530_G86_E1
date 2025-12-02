import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  template: `
    <div class="home-container">
      <section class="hero-section">
        <div class="hero-content">
          <h1>Investigación UD</h1>
          <p class="subtitle">Sistema de Gestión de Grupos de Investigación</p>
          <p class="description">
            Centraliza, consulta y gestiona la información de los grupos de investigación 
            de la Facultad de Ingeniería de la Universidad Distrital.
          </p>
          <div class="hero-actions">
            <a mat-raised-button color="primary" routerLink="/teams" size="large">
              <mat-icon>search</mat-icon>
              Explorar Grupos
            </a>
            <a mat-stroked-button routerLink="/register" size="large">
              <mat-icon>person_add</mat-icon>
              Registrarse
            </a>
          </div>
        </div>
      </section>

      <section class="features-section">
        <h2>Funcionalidades Principales</h2>
        <mat-grid-list cols="3" rowHeight="200px" gutterSize="16px">
          <mat-grid-tile>
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">groups</mat-icon>
                <h3>Directorio de Grupos</h3>
                <p>Consulta un directorio unificado de grupos clasificados por área o línea de investigación.</p>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          
          <mat-grid-tile>
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">science</mat-icon>
                <h3>Proyectos Activos</h3>
                <p>Visualiza proyectos activos y producción científica de los grupos de investigación.</p>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          
          <mat-grid-tile>
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">how_to_reg</mat-icon>
                <h3>Solicitudes de Vinculación</h3>
                <p>Solicita y da seguimiento a las admisiones a los grupos de investigación.</p>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 128px);
    }
    
    .hero-section {
      background: linear-gradient(135deg, var(--primary-blue) 0%, #0d7a9f 100%);
      color: var(--primary-white);
      padding: 80px 24px;
      text-align: center;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 16px;
      font-weight: 700;
    }
    
    .subtitle {
      font-size: 1.5rem;
      margin-bottom: 24px;
      opacity: 0.9;
    }
    
    .description {
      font-size: 1.1rem;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    
    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
    
    .features-section {
      padding: 64px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .features-section h2 {
      text-align: center;
      margin-bottom: 32px;
      color: var(--primary-black);
      font-size: 2rem;
    }
    
    .feature-card {
      height: 100%;
      text-align: center;
    }
    
    .feature-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--primary-blue);
      margin-bottom: 16px;
    }
    
    .feature-card h3 {
      color: var(--primary-black);
      margin-bottom: 8px;
    }
    
    .feature-card p {
      color: #666;
      line-height: 1.5;
    }
  `]
})
export class HomeComponent {}

