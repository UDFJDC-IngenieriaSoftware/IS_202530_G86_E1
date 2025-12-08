import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductTypeDialogComponent } from '../../../shared/components/product-type-dialog/product-type-dialog.component';

@Component({
  selector: 'app-product-types',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="product-types-container">
      <div class="header">
        <h1>Tipos de Proyecto</h1>
        <button mat-raised-button color="primary" (click)="createProductType()">
          <mat-icon>add</mat-icon>
          Nuevo Tipo
        </button>
      </div>

      @if (productTypes.length > 0) {
        <mat-card>
          <table mat-table [dataSource]="productTypes">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let type">{{type.name}}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Descripción</th>
              <td mat-cell *matCellDef="let type">{{type.description}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let type">
                <button mat-icon-button (click)="editProductType(type)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteProductType(type)" title="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card>
      } @else {
        <mat-card>
          <p class="no-types">No hay tipos de proyecto registrados</p>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .product-types-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    
    .no-types {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    
    table {
      width: 100%;
    }
    
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class ProductTypesComponent implements OnInit {
  productTypes: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProductTypes();
  }

  loadProductTypes(): void {
    this.loading = true;
    this.apiService.getProductTypesAdmin().subscribe({
      next: (types: any[]) => {
        this.productTypes = types;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading product types:', error);
        this.snackBar.open('Error al cargar tipos de proyecto', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  createProductType(): void {
    const dialogRef = this.dialog.open(ProductTypeDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.createProductType(result).subscribe({
          next: () => {
            this.snackBar.open('Tipo de proyecto creado exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadProductTypes();
          },
          error: (error: any) => {
            console.error('Error creating product type:', error);
            const errorMessage = error.error?.message || 'Error al crear tipo de proyecto';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  editProductType(productType: any): void {
    const dialogRef = this.dialog.open(ProductTypeDialogComponent, {
      width: '500px',
      data: { productType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.updateProductType(productType.productTypeId, result).subscribe({
          next: () => {
            this.snackBar.open('Tipo de proyecto actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadProductTypes();
          },
          error: (error: any) => {
            console.error('Error updating product type:', error);
            const errorMessage = error.error?.message || 'Error al actualizar tipo de proyecto';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  deleteProductType(productType: any): void {
    if (confirm(`¿Está seguro de que desea eliminar el tipo de proyecto "${productType.name}"?`)) {
      this.loading = true;
      this.apiService.deleteProductType(productType.productTypeId).subscribe({
        next: () => {
          this.snackBar.open('Tipo de proyecto eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.loadProductTypes();
        },
        error: (error: any) => {
          console.error('Error deleting product type:', error);
          const errorMessage = error.error?.message || 'Error al eliminar tipo de proyecto';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}

