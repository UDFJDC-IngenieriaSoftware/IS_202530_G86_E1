import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      {{data?.user ? 'Editar Usuario' : 'Nuevo Usuario'}}
    </h2>
    <mat-dialog-content>
      <form [formGroup]="userForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" required>
          @if (userForm.get('name')?.hasError('required')) {
            <mat-error>El nombre es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
          @if (userForm.get('email')?.hasError('required')) {
            <mat-error>El email es obligatorio</mat-error>
          }
          @if (userForm.get('email')?.hasError('email') || userForm.get('email')?.hasError('pattern')) {
            <mat-error>Debe ser un email &#64;udistrital.edu.co</mat-error>
          }
        </mat-form-field>

        @if (!data?.user) {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            @if (userForm.get('password')?.hasError('required')) {
              <mat-error>La contraseña es obligatoria</mat-error>
            }
            @if (userForm.get('password')?.hasError('minlength')) {
              <mat-error>Mínimo 6 caracteres</mat-error>
            }
          </mat-form-field>
        }

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="role" required [disabled]="!!data?.user && (data?.user?.role === 'ESTUDIANTE' || data?.user?.role === 'COORDINADOR')">
            @if (!data?.user) {
              <!-- Al crear, solo se puede crear DOCENTE -->
              <mat-option value="DOCENTE">Docente</mat-option>
            } @else {
              <!-- Al editar, mostrar el rol actual -->
              @if (data?.user?.role === 'ESTUDIANTE') {
                <mat-option value="ESTUDIANTE">Estudiante</mat-option>
              } @else if (data?.user?.role === 'DOCENTE') {
                <mat-option value="DOCENTE">Docente</mat-option>
              } @else if (data?.user?.role === 'COORDINADOR') {
                <mat-option value="COORDINADOR">Coordinador</mat-option>
              }
            }
          </mat-select>
          @if (userForm.get('role')?.hasError('required')) {
            <mat-error>El rol es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Proyecto Curricular</mat-label>
          <mat-select formControlName="projectAreaId" required>
            @if (loadingAreas) {
              <mat-option disabled>Cargando proyectos...</mat-option>
            } @else {
              @for (area of projectAreas; track area.proyectAreaId) {
                <mat-option [value]="area.proyectAreaId">{{area.name}}</mat-option>
              }
            }
          </mat-select>
          @if (userForm.get('projectAreaId')?.hasError('required')) {
            <mat-error>El proyecto curricular es obligatorio</mat-error>
          }
        </mat-form-field>

        @if (userForm.get('role')?.value === 'COORDINADOR' && data?.user) {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Grupo que Coordina*</mat-label>
            <mat-select formControlName="coordinatedTeamId" required>
              @if (loadingTeams) {
                <mat-option disabled>Cargando grupos...</mat-option>
              } @else {
                <mat-option [value]="null">-- Seleccione un grupo --</mat-option>
                @for (team of allTeams; track team.investigationTeamId) {
                  <mat-option [value]="team.investigationTeamId">{{team.name}}</mat-option>
                }
              }
            </mat-select>
            @if (userForm.get('coordinatedTeamId')?.hasError('required')) {
              <mat-error>Debe seleccionar un grupo</mat-error>
            }
          </mat-form-field>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="userForm.invalid || loading">
        @if (loading) {
          {{data?.user ? 'Guardando...' : 'Creando...'}}
        } @else {
          {{data?.user ? 'Guardar' : 'Crear'}}
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
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class UserDialogComponent implements OnInit {
  userForm: FormGroup;
  projectAreas: any[] = [];
  allTeams: any[] = [];
  loading = false;
  loadingAreas = false;
  loadingTeams = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: any } = {},
    private apiService: ApiService
  ) {
    console.log('UserDialogComponent constructor, data:', data);
    try {
      this.userForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email, Validators.pattern(/.*@udistrital\.edu\.co$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['DOCENTE', [Validators.required]],
        projectAreaId: ['', [Validators.required]],
        coordinatedTeamId: [null]
      });
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  }

  ngOnInit(): void {
    console.log('UserDialogComponent ngOnInit, data:', this.data);
    // Cargar proyectos curriculares
    this.loadingAreas = true;
    this.apiService.getProjectAreas().subscribe({
      next: (areas: any[]) => {
        console.log('Project areas loaded:', areas);
        this.projectAreas = areas;
        this.loadingAreas = false;
      },
      error: (error: any) => {
        console.error('Error loading project areas:', error);
        this.loadingAreas = false;
      }
    });

    // Si es edición, cargar datos del usuario
    if (this.data?.user) {
      this.userForm.patchValue({
        name: this.data.user.name,
        email: this.data.user.email,
        role: this.data.user.role,
        projectAreaId: this.data.user.projectAreaId
      });
      
      // Remover validación de contraseña en edición
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();

      // Si es coordinador, cargar información de grupos
      if (this.data.user.role === 'COORDINADOR') {
        this.loadAllTeams();
        this.loadCoordinatorInfo();
        // Agregar validación requerida para el grupo
        this.userForm.get('coordinatedTeamId')?.setValidators([Validators.required]);
      }
    } else {
      // En creación, la contraseña es obligatoria
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }

    // Cargar todos los equipos si es edición de coordinador
    if (this.data?.user?.role === 'COORDINADOR') {
      if (this.allTeams.length === 0) {
        this.loadAllTeams();
      }
    }

    // Cargar equipos cuando se selecciona COORDINADOR en edición
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'COORDINADOR' && this.data?.user) {
        if (this.allTeams.length === 0) {
          this.loadAllTeams();
        }
        this.loadCoordinatorInfo();
        // Agregar validación requerida para el grupo
        this.userForm.get('coordinatedTeamId')?.setValidators([Validators.required]);
        this.userForm.get('coordinatedTeamId')?.updateValueAndValidity();
      } else if (role !== 'COORDINADOR') {
        // Remover validación si no es coordinador
        this.userForm.get('coordinatedTeamId')?.clearValidators();
        this.userForm.get('coordinatedTeamId')?.updateValueAndValidity();
      }
    });
  }

  loadAllTeams(): void {
    this.loadingTeams = true;
    // Obtener solo grupos sin coordinador, pero si estamos editando un coordinador, incluir su grupo actual
    const currentCoordinatorId = this.data?.user?.coordinatorId || null;
    this.apiService.getTeamsWithoutCoordinator(currentCoordinatorId).subscribe({
      next: (teams: any[]) => {
        this.allTeams = teams;
        this.loadingTeams = false;
      },
      error: (error: any) => {
        console.error('Error loading teams:', error);
        this.loadingTeams = false;
      }
    });
  }

  loadCoordinatorInfo(): void {
    if (this.data?.user?.userId && this.data?.user?.coordinatorId) {
      this.apiService.getUserWithCoordinatorInfo(this.data.user.userId).subscribe({
        next: (userInfo: any) => {
          if (userInfo.coordinatedTeams && Array.isArray(userInfo.coordinatedTeams) && userInfo.coordinatedTeams.length > 0) {
            // Solo tomar el primer grupo (un coordinador coordina un solo grupo)
            const firstTeamId = userInfo.coordinatedTeams[0].investigationTeamId;
            this.userForm.patchValue({
              coordinatedTeamId: firstTeamId
            });
          } else {
            this.userForm.patchValue({
              coordinatedTeamId: null
            });
          }
        },
        error: (error: any) => {
          console.error('Error loading coordinator info:', error);
          // Si hay error, establecer null
          this.userForm.patchValue({
            coordinatedTeamId: null
          });
        }
      });
    } else {
      // Si no es coordinador o no tiene coordinatorId, establecer null
      this.userForm.patchValue({
        coordinatedTeamId: null
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      
      if (this.data?.user) {
        // Edición
        const updateData: any = {
          name: formValue.name,
          email: formValue.email,
          role: formValue.role,
          projectAreaId: formValue.projectAreaId
        };

        // Si es coordinador y hay cambios en los equipos, actualizar
        if (formValue.role === 'COORDINADOR') {
          // Obtener el coordinatorId del usuario actualizado
          const coordinatorId = this.data.user.coordinatorId;
          if (coordinatorId && formValue.coordinatedTeamId) {
            this.dialogRef.close({
              user: updateData,
              coordinatorId: coordinatorId,
              coordinatedTeamId: formValue.coordinatedTeamId
            });
          } else {
            this.dialogRef.close({ user: updateData });
          }
        } else {
          this.dialogRef.close({ user: updateData });
        }
      } else {
        // Creación
        const createData = {
          name: formValue.name,
          email: formValue.email,
          password: formValue.password,
          role: formValue.role,
          projectAreaId: parseInt(formValue.projectAreaId, 10)
        };
        this.dialogRef.close(createData);
      }
    }
  }
}

