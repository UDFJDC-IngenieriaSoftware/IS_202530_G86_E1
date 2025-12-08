import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-team-dialog',
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
      {{data?.team ? 'Editar Grupo' : 'Nuevo Grupo'}}
    </h2>
    <mat-dialog-content>
      <form [formGroup]="teamForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" required>
          @if (teamForm.get('name')?.hasError('required')) {
            <mat-error>El nombre es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email del Equipo</mat-label>
          <input matInput type="email" formControlName="teamEmail" required>
          @if (teamForm.get('teamEmail')?.hasError('required')) {
            <mat-error>El email es obligatorio</mat-error>
          }
          @if (teamForm.get('teamEmail')?.hasError('email')) {
            <mat-error>El email no es válido</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Área de Investigación</mat-label>
          <mat-select formControlName="areaId" required>
            @if (loadingAreas) {
              <mat-option disabled>Cargando áreas...</mat-option>
            } @else {
              @for (area of investigationAreas; track area.investigationAreaId) {
                <mat-option [value]="area.investigationAreaId">{{area.name}}</mat-option>
              }
            }
          </mat-select>
          @if (teamForm.get('areaId')?.hasError('required')) {
            <mat-error>El área es obligatoria</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="5" required></textarea>
          @if (teamForm.get('description')?.hasError('required')) {
            <mat-error>La descripción es obligatoria</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="teamForm.invalid || loading">
        @if (loading) {
          {{data?.team ? 'Guardando...' : 'Creando...'}}
        } @else {
          {{data?.team ? 'Guardar' : 'Crear'}}
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
export class TeamDialogComponent implements OnInit {
  teamForm: FormGroup;
  investigationAreas: any[] = [];
  loading = false;
  loadingAreas = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team?: any },
    private apiService: ApiService,
    public authService: AuthService
  ) {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required]],
      teamEmail: ['', [Validators.required, Validators.email]],
      areaId: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Cargar áreas de investigación
    this.loadingAreas = true;
    this.apiService.getInvestigationAreas().subscribe({
      next: (areas: any[]) => {
        this.investigationAreas = areas;
        this.loadingAreas = false;
        
        // Si es edición, cargar datos del equipo
        if (this.data?.team) {
          this.teamForm.patchValue({
            name: this.data.team.name,
            teamEmail: this.data.team.teamEmail,
            areaId: this.data.team.areaId,
            description: this.data.team.description
          });
        }
      },
      error: (error: any) => {
        console.error('Error loading investigation areas:', error);
        this.loadingAreas = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      const formValue = this.teamForm.value;
      // Asegurar que areaId sea un número
      const teamData = {
        name: formValue.name,
        teamEmail: formValue.teamEmail,
        description: formValue.description,
        areaId: parseInt(formValue.areaId, 10)
      };
      this.dialogRef.close(teamData);
    }
  }
}

