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
  selector: 'app-investigation-area-dialog',
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
    <h2 mat-dialog-title>{{data?.investigationArea ? 'Editar' : 'Crear'}} Área de Investigación</h2>
    <mat-dialog-content>
      <form [formGroup]="investigationAreaForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Proyecto Curricular*</mat-label>
          <mat-select formControlName="projectAreaId" required [disabled]="!!data?.investigationArea">
            @if (loadingProjectAreas) {
              <mat-option disabled>Cargando...</mat-option>
            } @else {
              @for (area of projectAreas; track area.proyectAreaId) {
                <mat-option [value]="area.proyectAreaId">{{area.name}}</mat-option>
              }
            }
          </mat-select>
          @if (investigationAreaForm.get('projectAreaId')?.hasError('required')) {
            <mat-error>El proyecto curricular es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre*</mat-label>
          <input matInput formControlName="name" placeholder="Ej: Inteligencia Artificial, Robótica...">
          @if (investigationAreaForm.get('name')?.hasError('required')) {
            <mat-error>El nombre es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción*</mat-label>
          <textarea matInput formControlName="description" rows="4" placeholder="Descripción del área de investigación"></textarea>
          @if (investigationAreaForm.get('description')?.hasError('required')) {
            <mat-error>La descripción es obligatoria</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!investigationAreaForm.valid">
        {{data?.investigationArea ? 'Actualizar' : 'Crear'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    mat-dialog-content {
      min-width: 500px;
      padding: 24px;
    }
    
    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class InvestigationAreaDialogComponent implements OnInit {
  investigationAreaForm: FormGroup;
  projectAreas: any[] = [];
  loadingProjectAreas = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<InvestigationAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { investigationArea?: any, projectAreaId?: number }
  ) {
    this.investigationAreaForm = this.fb.group({
      projectAreaId: [data?.projectAreaId || '', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProjectAreas();
    
    if (this.data?.investigationArea) {
      this.investigationAreaForm.patchValue({
        projectAreaId: this.data.investigationArea.projectAreaId,
        name: this.data.investigationArea.name,
        description: this.data.investigationArea.description
      });
    }
  }

  loadProjectAreas(): void {
    this.loadingProjectAreas = true;
    this.apiService.getProjectAreasAdmin().subscribe({
      next: (areas: any[]) => {
        this.projectAreas = areas;
        this.loadingProjectAreas = false;
      },
      error: () => {
        this.loadingProjectAreas = false;
      }
    });
  }

  onSubmit(): void {
    if (this.investigationAreaForm.valid) {
      this.dialogRef.close(this.investigationAreaForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

