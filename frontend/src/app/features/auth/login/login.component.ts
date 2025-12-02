import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header class="card-header">
          <mat-card-title>Iniciar Sesión</mat-card-title>
          <mat-card-subtitle>Ingresa con tu correo institucional</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width form-field-light-blue">
              <mat-label style="display: none;"></mat-label>
              <input matInput type="email" formControlName="email" placeholder="Email" [disabled]="false" id="email-input">
              <mat-icon matPrefix>email</mat-icon>
              @if (loginForm.get('email')?.hasError('required')) {
                <mat-error>El email es obligatorio</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email')) {
                <mat-error>Email inválido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width form-field-light-blue">
              <mat-label style="display: none;"></mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Contraseña*" [disabled]="false" id="password-input">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (loginForm.get('password')?.hasError('required')) {
                <mat-error>La contraseña es obligatoria</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="loginForm.invalid || loading">
              @if (loading) {
                <ng-container>
                  <mat-icon class="spinner">hourglass_empty</mat-icon>
                </ng-container>
              } @else {
                <ng-container>
                  <mat-icon>login</mat-icon>
                </ng-container>
              }
              @if (loading) {
                Iniciando sesión...
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer>
          <p class="register-link">
            ¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a>
          </p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 24px;
      background-color: #f5f5f5;
      position: relative;
      z-index: 1;
      overflow: visible;
    }
    
    .login-card {
      width: 100%;
      max-width: 450px;
      padding: 40px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
    }

    .login-card form {
      position: relative;
      z-index: 11;
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
      position: relative;
      z-index: 1;
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

    .form-field-light-blue ::ng-deep [style*="background"] {
      background: transparent !important;
    }

    .form-field-light-blue ::ng-deep *[class*="blue"],
    .form-field-light-blue ::ng-deep *[class*="primary"] {
      background-color: transparent !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper,
    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper.mat-mdc-form-field-bottom-align,
    .form-field-light-blue ::ng-deep .mat-mdc-form-field-subscript-wrapper * {
      background-color: transparent !important;
      background: transparent !important;
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
      height: auto !important;
      position: relative;
      overflow: visible !important;
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
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
      height: 56px !important;
      align-items: center;
      position: relative;
      border: none !important;
      border-bottom: none !important;
      overflow: visible !important;
    }

    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex::after,
    .form-field-light-blue ::ng-deep .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex::before {
      display: none !important;
      content: none !important;
    }

    .form-field-light-blue ::ng-deep input {
      color: var(--primary-black) !important;
      font-size: 1rem;
      cursor: text !important;
      min-height: 56px !important;
      height: 56px !important;
      line-height: 56px !important;
      padding: 0 16px 0 48px !important;
      width: 100% !important;
      box-sizing: border-box !important;
      overflow: visible !important;
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
    
    .spinner {
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .register-link {
      text-align: center;
      margin-top: 20px;
      color: var(--primary-black);
    }
    
    .register-link a {
      color: var(--primary-blue);
      text-decoration: none;
      font-weight: 500;
    }

    /* Estilos para el botón de inicio de sesión */
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
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Credenciales inválidas', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}

