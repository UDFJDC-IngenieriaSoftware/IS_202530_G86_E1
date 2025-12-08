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

        @if (authService.hasRole('ADMINISTRADOR')) {
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Docente Coordinador*</mat-label>
          <mat-select formControlName="teacherId" [required]="teamForm.get('areaId')?.value">
            @if (!teamForm.get('areaId')?.value) {
              <mat-option disabled>Primero seleccione un área de investigación</mat-option>
            } @else if (loadingCoordinators) {
              <mat-option disabled>Cargando docentes...</mat-option>
            } @else if (coordinators.length === 0) {
              <mat-option disabled>No hay docentes disponibles para este proyecto curricular</mat-option>
            } @else {
              @for (teacher of coordinators; track teacher.teacherId || teacher.coordinatorId) {
                <mat-option [value]="teacher.teacherId ? teacher.teacherId : (teacher.coordinatorId ? teacher.coordinatorId : null)">
                  {{teacher.name}} ({{teacher.email}})
                  @if (teacher.coordinatorId) {
                    <span style="color: #666; font-size: 0.9em;"> - Coordinador actual</span>
                  }
                </mat-option>
              }
            }
          </mat-select>
          @if (teamForm.get('teacherId')?.hasError('required')) {
            <mat-error>Debe seleccionar un docente coordinador</mat-error>
          }
        </mat-form-field>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="isFormInvalid() || loading">
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
  coordinators: any[] = [];
  loading = false;
  loadingAreas = false;
  loadingCoordinators = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team?: any },
    private apiService: ApiService,
    public authService: AuthService
  ) {
    const coordinatorIdValidators = this.authService.hasRole('ADMINISTRADOR') 
      ? [Validators.required] 
      : [];

    this.teamForm = this.fb.group({
      name: ['', [Validators.required]],
      teamEmail: ['', [Validators.required, Validators.email]],
      areaId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      coordinatorId: [null, coordinatorIdValidators],
      teacherId: [null] // No requerido inicialmente, se validará cuando haya área seleccionada
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
            description: this.data.team.description,
            coordinatorId: this.data.team.coordinatorId
          });
          
          // Si es administrador y hay área, hacer teacherId requerido
          if (this.authService.hasRole('ADMINISTRADOR') && this.data.team.areaId) {
            this.teamForm.get('teacherId')?.setValidators([Validators.required]);
            this.teamForm.get('teacherId')?.updateValueAndValidity();
          }
          
          // Cargar docentes para el área seleccionada
          this.loadCoordinatorsForArea(this.data.team.areaId);
        }
      },
      error: (error: any) => {
        console.error('Error loading investigation areas:', error);
        this.loadingAreas = false;
      }
    });

    // Escuchar cambios en el área de investigación para cargar docentes del mismo proyecto curricular
    if (this.authService.hasRole('ADMINISTRADOR')) {
      this.teamForm.get('areaId')?.valueChanges.subscribe(areaId => {
        if (areaId) {
          this.loadCoordinatorsForArea(areaId);
        } else {
          this.coordinators = [];
          // Quitar validación requerida si no hay área seleccionada
          this.teamForm.get('teacherId')?.clearValidators();
          this.teamForm.get('teacherId')?.updateValueAndValidity();
          this.teamForm.get('teacherId')?.setValue(null);
        }
      });
    }
  }

  loadCoordinatorsForArea(areaId: number): void {
    if (!this.authService.hasRole('ADMINISTRADOR')) {
      return;
    }

    // Obtener el projectAreaId del área de investigación seleccionada
    const selectedArea = this.investigationAreas.find(a => a.investigationAreaId === areaId);
    if (!selectedArea || !selectedArea.projectAreaId) {
      this.coordinators = [];
      // Si no hay área válida, quitar validación requerida
      this.teamForm.get('teacherId')?.clearValidators();
      this.teamForm.get('teacherId')?.updateValueAndValidity();
      return;
    }

    // Hacer teacherId requerido cuando hay un área válida
    this.teamForm.get('teacherId')?.setValidators([Validators.required]);
    this.teamForm.get('teacherId')?.updateValueAndValidity();

    this.loadingCoordinators = true;
    const excludeTeamId = this.data?.team?.investigationTeamId;
    this.apiService.getAvailableTeachers(excludeTeamId, selectedArea.projectAreaId).subscribe({
      next: (teachers: any[]) => {
        this.coordinators = teachers;
        this.loadingCoordinators = false;
        
        // Si se está editando y hay coordinador actual, establecer el teacherId
        if (this.data?.team?.coordinatorId) {
          const currentCoordinator = teachers.find(t => t.coordinatorId === this.data.team.coordinatorId);
          if (currentCoordinator) {
            this.teamForm.patchValue({
              teacherId: currentCoordinator.teacherId || currentCoordinator.coordinatorId
            });
          }
        }
      },
      error: (error: any) => {
        console.error('Error loading teachers:', error);
        this.loadingCoordinators = false;
        // Si hay error, quitar validación requerida temporalmente
        this.teamForm.get('teacherId')?.clearValidators();
        this.teamForm.get('teacherId')?.updateValueAndValidity();
      }
    });
  }

  isFormInvalid(): boolean {
    // Validar campos básicos
    if (!this.teamForm.get('name')?.value || !this.teamForm.get('teamEmail')?.value || 
        !this.teamForm.get('areaId')?.value || !this.teamForm.get('description')?.value) {
      return true;
    }

    // Validar email
    if (this.teamForm.get('teamEmail')?.hasError('email')) {
      return true;
    }

    // Si es administrador, validar que haya docente seleccionado cuando hay área
    if (this.authService.hasRole('ADMINISTRADOR')) {
      const areaId = this.teamForm.get('areaId')?.value;
      const teacherId = this.teamForm.get('teacherId')?.value;
      
      if (areaId && !teacherId) {
        return true;
      }
    }

    return false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // Validar campos básicos
    if (!this.teamForm.get('name')?.value || !this.teamForm.get('teamEmail')?.value || 
        !this.teamForm.get('areaId')?.value || !this.teamForm.get('description')?.value) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.teamForm.controls).forEach(key => {
        this.teamForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Validar email
    if (this.teamForm.get('teamEmail')?.hasError('email')) {
      this.teamForm.get('teamEmail')?.markAsTouched();
      return;
    }

    // Si es administrador, validar que haya docente seleccionado
    if (this.authService.hasRole('ADMINISTRADOR')) {
      const areaId = this.teamForm.get('areaId')?.value;
      const teacherId = this.teamForm.get('teacherId')?.value;
      
      if (areaId && !teacherId) {
        // Si hay área pero no docente, marcar como error
        this.teamForm.get('teacherId')?.setErrors({ required: true });
        this.teamForm.get('teacherId')?.markAsTouched();
        return;
      }
    }

    const formValue = this.teamForm.value;
    // Asegurar que areaId sea un número
    const teamData: any = {
      name: formValue.name.trim(),
      teamEmail: formValue.teamEmail.trim(),
      description: formValue.description.trim(),
      areaId: parseInt(formValue.areaId, 10)
    };
    
    // Si es administrador, incluir el docente seleccionado (obligatorio)
    // El backend se encargará de crear el coordinador si no existe
    if (this.authService.hasRole('ADMINISTRADOR') && formValue.teacherId) {
      teamData.teacherId = parseInt(formValue.teacherId, 10);
    }
    
    this.dialogRef.close(teamData);
  }
}

