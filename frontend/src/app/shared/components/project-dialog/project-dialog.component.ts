import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>
      {{data?.project ? 'Editar Proyecto' : 'Nuevo Proyecto'}}
    </h2>
    <mat-dialog-content>
      <form [formGroup]="projectForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Equipo</mat-label>
          <mat-select formControlName="teamId" required>
            @if (loading) {
              <mat-option disabled>Cargando equipos...</mat-option>
            } @else if (teams.length === 0) {
              <mat-option disabled>No tienes equipos asignados</mat-option>
            } @else {
              @for (team of teams; track team.investigationTeamId) {
                <mat-option [value]="team.investigationTeamId">{{team.name}}</mat-option>
              }
            }
          </mat-select>
          @if (projectForm.get('teamId')?.hasError('required')) {
            <mat-error>El equipo es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" required>
          @if (projectForm.get('title')?.hasError('required')) {
            <mat-error>El título es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Resumen</mat-label>
          <textarea matInput formControlName="resume" rows="5" required></textarea>
          @if (projectForm.get('resume')?.hasError('required')) {
            <mat-error>El resumen es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="state" required>
            <mat-option [value]="1">Activo</mat-option>
            <mat-option [value]="2">En desarrollo</mat-option>
            <mat-option [value]="3">Finalizado</mat-option>
            <mat-option [value]="4">Cancelado</mat-option>
          </mat-select>
          @if (projectForm.get('state')?.hasError('required')) {
            <mat-error>El estado es obligatorio</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="projectForm.invalid || loading">
        @if (loading) {
          {{data?.project ? 'Guardando...' : 'Creando...'}}
        } @else {
          {{data?.project ? 'Guardar' : 'Crear'}}
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-top: 16px;
    }
    
    mat-dialog-content {
      min-width: 500px;
    }
  `]
})
export class ProjectDialogComponent implements OnInit {
  projectForm: FormGroup;
  teams: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project?: any },
    private apiService: ApiService
  ) {
    this.projectForm = this.fb.group({
      teamId: ['', [Validators.required]],
      title: ['', [Validators.required]],
      resume: ['', [Validators.required]],
      state: [1, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Cargar solo los equipos del coordinador
    console.log('ProjectDialogComponent - Loading teams...');
    this.loading = true;
    
    // Deshabilitar el campo mientras carga
    this.projectForm.get('teamId')?.disable();
    
    this.apiService.getMyTeams().subscribe({
      next: (teams: any[]) => {
        console.log('ProjectDialogComponent - Teams received:', teams);
        console.log('ProjectDialogComponent - Teams count:', teams.length);
        this.teams = teams || [];
        this.loading = false;
        
        // Habilitar el campo después de cargar
        this.projectForm.get('teamId')?.enable();
        
        // Si es edición, cargar datos del proyecto
        if (this.data?.project) {
          this.projectForm.patchValue({
            teamId: this.data.project.teamId,
            title: this.data.project.title,
            resume: this.data.project.resume,
            state: this.data.project.state
          });
        }
      },
      error: (error: any) => {
        console.error('ProjectDialogComponent - Error loading teams:', error);
        console.error('ProjectDialogComponent - Error status:', error.status);
        console.error('ProjectDialogComponent - Error message:', error.message);
        console.error('ProjectDialogComponent - Error details:', error.error);
        // Si no hay equipos, el array queda vacío y el usuario verá que no hay opciones
        this.teams = [];
        this.loading = false;
        
        // Habilitar el campo incluso si hay error
        this.projectForm.get('teamId')?.enable();
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }
}

