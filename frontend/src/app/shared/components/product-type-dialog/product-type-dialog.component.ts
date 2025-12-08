import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-type-dialog',
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
    <h2 mat-dialog-title>{{data?.productType ? 'Editar' : 'Crear'}} Tipo de Proyecto</h2>
    <mat-dialog-content>
      <form [formGroup]="productTypeForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre*</mat-label>
          <input matInput formControlName="name" placeholder="Ej: Artículo, Libro, Software...">
          @if (productTypeForm.get('name')?.hasError('required')) {
            <mat-error>El nombre es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción*</mat-label>
          <textarea matInput formControlName="description" rows="4" placeholder="Descripción del tipo de proyecto"></textarea>
          @if (productTypeForm.get('description')?.hasError('required')) {
            <mat-error>La descripción es obligatoria</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!productTypeForm.valid">
        {{data?.productType ? 'Actualizar' : 'Crear'}}
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
export class ProductTypeDialogComponent implements OnInit {
  productTypeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productType?: any }
  ) {
    this.productTypeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data?.productType) {
      this.productTypeForm.patchValue({
        name: this.data.productType.name,
        description: this.data.productType.description
      });
    }
  }

  onSubmit(): void {
    if (this.productTypeForm.valid) {
      this.dialogRef.close(this.productTypeForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

