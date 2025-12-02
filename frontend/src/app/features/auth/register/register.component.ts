import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header class="card-header">
          <mat-card-title>Registro</mat-card-title>
          <mat-card-subtitle>Crea tu cuenta con correo institucional</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width form-field-light-blue">
              <mat-label style="display: none;"></mat-label>
              <input matInput formControlName="name" placeholder="Nombre Completo*" [disabled]="false">
              <mat-icon matPrefix>person</mat-icon>
              @if (registerForm.get('name')?.hasError('required')) {
                <mat-error>El nombre es obligatorio</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width form-field-light-blue">
              <mat-label style="display: none;"></mat-label>
              <input matInput type="email" formControlName="email" placeholder="Email Institucional*" [disabled]="false">
              <mat-icon matPrefix>email</mat-icon>
              @if (registerForm.get('email')?.hasError('required')) {
                <mat-error>El email es obligatorio</mat-error>
              }
              @if (registerForm.get('email')?.hasError('email') || registerForm.get('email')?.hasError('pattern')) {
                <mat-error>Debe ser un email &#64;udistrital.edu.co</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width form-field-light-blue">
              <mat-label style="display: none;"></mat-label>
              <mat-select formControlName="role" placeholder="Estudiante">
                <mat-option value="ESTUDIANTE">Estudiante</mat-option>
                <mat-option value="COORDINADOR">Coordinador</mat-option>
              </mat-select>
              <mat-icon matPrefix>badge</mat-icon>
            </mat-form-field>

            @if (registerForm.get('role')?.value && registerForm.get('role')?.value !== 'ADMINISTRADOR') {
              <mat-form-field appearance="fill" class="full-width form-field-light-blue">
                <mat-label style="display: none;"></mat-label>
                <mat-select formControlName="projectAreaId" placeholder="Proyecto Curricular">
                  @for (area of projectAreas; track area.proyectAreaId) {
                    <mat-option [value]="area.proyectAreaId">{{area.name}}</mat-option>
                  }
                </mat-select>
                <mat-icon matPrefix>school</mat-icon>
              </mat-form-field>
            }

            <mat-form-field appearance="fill" class="full-width form-field-light-blue">
              <mat-label style="display: none;"></mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Contraseña*" [disabled]="false">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (registerForm.get('password')?.hasError('required')) {
                <mat-error>La contraseña es obligatoria</mat-error>
              }
              @if (registerForm.get('password')?.hasError('minlength')) {
                <mat-error>Mínimo 6 caracteres</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="registerForm.invalid || loading">
              @if (loading) {
                <ng-container>
                  <mat-icon class="spinner">hourglass_empty</mat-icon>
                </ng-container>
              } @else {
                <ng-container>
                  <mat-icon>person_add</mat-icon>
                </ng-container>
              }
              @if (loading) {
                Registrando...
              } @else {
                Registrarse
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer>
          <p class="login-link">
            ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a>
          </p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 24px;
      background-color: #f5f5f5;
      overflow: visible;
    }
    
    .register-card {
      width: 100%;
      max-width: 550px;
      padding: 40px;
      margin: 0 auto;
      overflow: visible;
    }

    .register-card ::ng-deep mat-form-field {
      overflow: visible;
    }

    .register-card form {
      overflow: visible;
    }

    .register-card ::ng-deep mat-card-content {
      overflow: visible;
    }

    .register-card ::ng-deep mat-form-field,
    .register-card ::ng-deep .mat-mdc-form-field {
      overflow: visible !important;
    }

    .register-card ::ng-deep .mat-mdc-select {
      pointer-events: auto !important;
    }

    .register-card ::ng-deep .mat-mdc-select-trigger {
      pointer-events: auto !important;
    }

    .card-header {
      text-align: center;
      margin-bottom: 32px;
      display: block;
    }

    mat-card-title {
      color: var(--primary-black);
      font-size: 1.75rem;
      margin-bottom: 8px;
      font-weight: 500;
    }

    mat-card-subtitle {
      color: var(--primary-black);
      font-size: 0.95rem;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 24px;
    }

    .form-field-light-blue.full-width {
      margin-bottom: 28px;
    }

    .form-field-light-blue {
      cursor: text;
      background-color: transparent !important;
    }


    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex {
      background-color: #E3F2FD !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper,
    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper.mat-mdc-form-field-bottom-align,
    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper.mat-mdc-form-field-bottom-align * {
      background-color: transparent !important;
      background: none !important;
    }


    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: #E3F2FD !important;
      border-radius: 4px;
      border: none !important;
      border-bottom: none !important;
      border-bottom-width: 0 !important;
      border-bottom-style: none !important;
      box-shadow: none !important;
      cursor: text !important;
      min-height: 56px;
      height: 56px !important;
      position: relative;
      overflow: visible !important;
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
    }
    
    /* Allow select dropdown to open properly */
    .form-field-light-blue ::ng-deep mat-select {
      width: 100%;
    }
    
    .form-field-light-blue ::ng-deep .mat-mdc-select-trigger {
      width: 100%;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper::after,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper::before {
      display: none !important;
      content: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex {
      background-color: #E3F2FD;
      cursor: text !important;
      min-height: 56px;
      align-items: center;
      border: none !important;
      border-bottom: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex::after,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex::before {
      display: none !important;
      content: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper *:not(.mat-mdc-select-trigger) {
      cursor: text !important;
    }

    .form-field-light-blue ::ng-deep input {
      color: var(--primary-black) !important;
      font-size: 1rem;
      cursor: text !important;
      min-height: 56px !important;
      padding: 16px 16px 16px 48px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-input {
      color: var(--primary-black) !important;
      font-size: 1rem;
      cursor: text !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-flex {
      cursor: text !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper {
      cursor: text !important;
    }

    .form-field-light-blue ::ng-deep select {
      cursor: pointer !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select {
      cursor: pointer !important;
      pointer-events: auto !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-trigger {
      cursor: pointer !important;
      min-height: 56px !important;
      height: 56px !important;
      display: flex;
      align-items: center;
      pointer-events: auto !important;
      padding: 0 !important;
      width: 100% !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-value-container {
      padding-left: 48px !important;
      padding-right: 32px !important;
      width: 100% !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-value {
      pointer-events: auto !important;
      padding-left: 0 !important;
      color: var(--primary-black) !important;
      width: 100% !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-placeholder {
      padding-left: 0 !important;
      color: var(--primary-black) !important;
      opacity: 0.7 !important;
    }


    .form-field-light-blue ::ng-deep mat-form-field {
      pointer-events: auto !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field {
      pointer-events: auto !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-input::placeholder {
      color: var(--primary-black) !important;
      opacity: 0.7 !important;
    }

    .form-field-light-blue ::ng-deep input::placeholder {
      color: var(--primary-black) !important;
      opacity: 0.7 !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-icon-prefix .mat-icon {
      color: var(--primary-black) !important;
      opacity: 0.7;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-icon-suffix button .mat-icon {
      color: var(--primary-black) !important;
      opacity: 0.7;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-notched-outline .mdc-notched-outline__leading,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-notched-outline .mdc-notched-outline__notch,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-notched-outline .mdc-notched-outline__trailing {
      border-color: transparent !important;
      border-width: 0 !important;
      display: none !important;
    }

    .form-field-light-blue ::ng-deep .mdc-notched-outline {
      display: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper {
      border-bottom-width: 0 !important;
      border-bottom-style: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-line-ripple {
      display: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-line-ripple::before,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mdc-line-ripple::after {
      display: none !important;
      content: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field {
      border-bottom: none !important;
      border-bottom-width: 0 !important;
      border-bottom-style: none !important;
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
      background-color: transparent !important;
      background: transparent !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field > * {
      background-color: transparent !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper > *:not(.mat-mdc-form-field-subscript-wrapper) {
      background-color: #E3F2FD !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field {
      background-color: transparent !important;
    }


    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex {
      background-color: #E3F2FD !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper,
    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper.mat-mdc-form-field-bottom-align,
    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper * {
      background-color: transparent !important;
      background: transparent !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper * {
      border-bottom: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field::after,
    .form-field-light-blue ::ng-deep .mat-mdc-form-field::before {
      display: none !important;
      content: none !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      position: relative !important;
      margin-top: 4px;
      height: auto;
      min-height: 20px;
      background-color: transparent !important;
      background: transparent !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper.mat-mdc-form-field-bottom-align {
      background-color: transparent !important;
      background: transparent !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper * {
      background-color: transparent !important;
    }

    .form-field-light-blue ::ng-deep mat-form-field .mat-mdc-form-field-subscript-wrapper {
      background-color: transparent !important;
      background: transparent !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-error {
      color: var(--accent-red) !important;
      font-size: 0.9rem;
      margin-top: 4px;
      display: block;
      position: relative;
      font-weight: 500;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-value {
      color: var(--primary-black) !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-select-arrow {
      color: var(--primary-black) !important;
      opacity: 0.7;
    }

    /* Estilos para el panel del dropdown */
    ::ng-deep .mat-mdc-select-panel {
      background-color: white !important;
      border-radius: 4px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      padding: 8px 0 !important;
      min-width: 100% !important;
    }

    ::ng-deep .mat-mdc-option {
      padding: 12px 16px !important;
      min-height: 48px !important;
      color: var(--primary-black) !important;
    }

    ::ng-deep .mat-mdc-option:hover:not(.mdc-list-item--disabled) {
      background-color: rgba(18, 145, 192, 0.1) !important;
    }

    ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {
      background-color: rgba(18, 145, 192, 0.15) !important;
      color: var(--primary-blue) !important;
      font-weight: 500 !important;
    }

    ::ng-deep .mat-mdc-option .mdc-list-item__primary-text {
      color: inherit !important;
    }
    
    .spinner {
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .login-link {
      text-align: center;
      margin-top: 20px;
      color: var(--primary-black);
    }
    
    .login-link a {
      color: var(--primary-blue);
      text-decoration: none;
      font-weight: 500;
    }

    /* Estilos para el botón de registro */
    button[mat-raised-button].full-width {
      min-height: 56px !important;
      height: 56px !important;
      font-size: 1rem !important;
    }

    button[mat-raised-button].full-width ::ng-deep .mdc-button__label {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      gap: 8px;
    }

    button[mat-raised-button].full-width mat-icon {
      margin: 0 !important;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  loading = false;
  projectAreas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/.*@udistrital\.edu\.co$/)]],
      role: ['ESTUDIANTE', [Validators.required]],
      projectAreaId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.apiService.getProjectAreas().subscribe(areas => {
      this.projectAreas = areas;
    });

    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'ADMINISTRADOR') {
        this.registerForm.get('projectAreaId')?.clearValidators();
      } else {
        this.registerForm.get('projectAreaId')?.setValidators([Validators.required]);
      }
      this.registerForm.get('projectAreaId')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const formValue = this.registerForm.value;
      
      this.authService.register(
        formValue.name,
        formValue.email,
        formValue.password,
        formValue.role,
        formValue.projectAreaId
      ).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(error.error?.message || 'Error al registrar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}

