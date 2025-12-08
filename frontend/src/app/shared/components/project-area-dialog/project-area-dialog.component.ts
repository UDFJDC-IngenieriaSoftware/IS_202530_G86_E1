import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-project-area-dialog',
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
    <h2 mat-dialog-title>{{data?.projectArea ? 'Editar' : 'Crear'}} Proyecto Curricular</h2>
    <mat-dialog-content>
      <form [formGroup]="projectAreaForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre*</mat-label>
          <input matInput formControlName="name" placeholder="Ej: Ingeniería de Sistemas, Ingeniería Industrial...">
          @if (projectAreaForm.get('name')?.hasError('required')) {
            <mat-error>El nombre es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email*</mat-label>
          <input matInput type="email" formControlName="projectEmail" placeholder="Ej: sistemas@udistrital.edu.co">
          @if (projectAreaForm.get('projectEmail')?.hasError('required')) {
            <mat-error>El email es obligatorio</mat-error>
          }
          @if (projectAreaForm.get('projectEmail')?.hasError('email')) {
            <mat-error>El email debe tener un formato válido</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!projectAreaForm.valid">
        {{data?.projectArea ? 'Actualizar' : 'Crear'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    mat-dialog-content {
      min-width: 400px;
      padding: 24px;
    }
    
    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class ProjectAreaDialogComponent implements OnInit {
  projectAreaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectArea?: any }
  ) {
    this.projectAreaForm = this.fb.group({
      name: ['', [Validators.required]],
      projectEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.data?.projectArea) {
      this.projectAreaForm.patchValue({
        name: this.data.projectArea.name,
        projectEmail: this.data.projectArea.projectEmail
      });
    }
  }

  onSubmit(): void {
    if (this.projectAreaForm.valid) {
      this.dialogRef.close(this.projectAreaForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

