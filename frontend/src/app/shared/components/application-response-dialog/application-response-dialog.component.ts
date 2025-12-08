import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-application-response-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>
      {{data.state === 'APROBADA' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}}
    </h2>
    <mat-dialog-content>
      <p><strong>Estudiante:</strong> {{data.application.userName}} ({{data.application.userEmail}})</p>
      <p><strong>Mensaje del estudiante:</strong> {{data.application.applicationMessage}}</p>
      
      <form [formGroup]="responseForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mensaje de respuesta</mat-label>
          <textarea matInput formControlName="message" rows="4" 
                    [placeholder]="data.state === 'APROBADA' ? 'Mensaje de bienvenida...' : 'Razón del rechazo...'"></textarea>
          @if (responseForm.get('message')?.hasError('required')) {
            <mat-error>El mensaje es obligatorio</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button 
              [color]="data.state === 'APROBADA' ? 'primary' : 'warn'" 
              (click)="onSubmit()" 
              [disabled]="responseForm.invalid">
        {{data.state === 'APROBADA' ? 'Aprobar' : 'Rechazar'}}
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
    
    mat-dialog-content p {
      margin-bottom: 12px;
    }
  `]
})
export class ApplicationResponseDialogComponent {
  responseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApplicationResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { application: any; state: string }
  ) {
    this.responseForm = this.fb.group({
      message: ['', [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.responseForm.valid) {
      this.dialogRef.close({
        message: this.responseForm.value.message
      });
    }
  }
}

