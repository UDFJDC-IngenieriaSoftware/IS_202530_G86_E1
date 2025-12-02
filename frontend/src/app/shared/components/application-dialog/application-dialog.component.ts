import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-application-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Solicitar Vinculación</h2>
    <mat-dialog-content>
      <p>Estás solicitando unirte a: <strong>{{data.teamName}}</strong></p>
      <form [formGroup]="applicationForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mensaje de solicitud</mat-label>
          <textarea matInput formControlName="message" rows="5" 
                    placeholder="Explica por qué deseas unirte a este grupo..."></textarea>
          @if (applicationForm.get('message')?.hasError('required')) {
            <mat-error>El mensaje es obligatorio</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="applicationForm.invalid || loading">
        @if (loading) {
          Enviando...
        } @else {
          Enviar Solicitud
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
      min-width: 400px;
    }
  `]
})
export class ApplicationDialogComponent {
  applicationForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { teamId: number; teamName: string },
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.applicationForm = this.fb.group({
      message: ['', [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.loading = true;
      const application = {
        investigationTeamId: this.data.teamId,
        applicationMessage: this.applicationForm.value.message
      };

      this.apiService.createApplication(application).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Solicitud enviada exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al enviar solicitud', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}

