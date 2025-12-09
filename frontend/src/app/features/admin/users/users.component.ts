import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../core/services/api.service';
import { UserDialogComponent } from '../../../shared/components/user-dialog/user-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="users-container">
      <div class="header">
        <h1>Gestión de Usuarios</h1>
        <button mat-raised-button color="primary" (click)="createUser()">
          <mat-icon>add</mat-icon>
          Crear Usuario
        </button>
      </div>
      
      <mat-card class="filters-card">
        <div class="filters">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Buscar por nombre o email</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Buscar...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filtrar por rol</mat-label>
            <mat-select [(ngModel)]="selectedRole" (selectionChange)="applyFilters()">
              <mat-option [value]="null">Todos los roles</mat-option>
              <mat-option value="ESTUDIANTE">Estudiante</mat-option>
              <mat-option value="DOCENTE">Docente</mat-option>
              <mat-option value="COORDINADOR">Coordinador</mat-option>
              <mat-option value="ADMINISTRADOR">Administrador</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filtrar por proyecto curricular</mat-label>
            <mat-select [(ngModel)]="selectedProjectArea" (selectionChange)="applyFilters()">
              <mat-option [value]="null">Todos los proyectos</mat-option>
              @for (area of projectAreas; track area.proyectAreaId) {
                <mat-option [value]="area.proyectAreaId">{{area.name}}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          @if (searchTerm || selectedRole || selectedProjectArea) {
            <button mat-button (click)="clearFilters()" class="clear-filters">
              <mat-icon>clear</mat-icon>
              Limpiar filtros
            </button>
          }
        </div>
      </mat-card>
      
      <mat-card>
        <table mat-table [dataSource]="filteredUsers" class="users-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let user">{{user.name}}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{user.email}}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Rol</th>
            <td mat-cell *matCellDef="let user">
              <mat-chip [style.background-color]="getRoleColor(user.role)" [style.color]="'white'">
                {{getRoleLabel(user.role)}}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="projectArea">
            <th mat-header-cell *matHeaderCellDef>Proyecto Curricular</th>
            <td mat-cell *matCellDef="let user">
              {{user.projectAreaName || 'N/A'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button (click)="editUser(user)" title="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteUser(user)" title="Eliminar">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        @if (filteredUsers.length === 0) {
          <div class="no-data">No se encontraron usuarios</div>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .users-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .filters-card {
      margin-bottom: 24px;
    }
    
    .filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }
    
    .filter-field {
      flex: 1;
      min-width: 200px;
    }
    
    .clear-filters {
      margin-left: auto;
    }
    
    .users-table {
      width: 100%;
    }
    
    .no-data {
      text-align: center;
      padding: 24px;
      color: #999;
      font-style: italic;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  projectAreas: any[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'projectArea', 'actions'];
  
  searchTerm: string = '';
  selectedRole: string | null = null;
  selectedProjectArea: number | null = null;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadProjectAreas();
  }

  loadUsers(): void {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  loadProjectAreas(): void {
    this.apiService.getProjectAreasAdmin().subscribe({
      next: (areas) => {
        this.projectAreas = areas;
      },
      error: (error) => console.error('Error loading project areas:', error)
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      // Filtro por búsqueda (nombre o email)
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtro por rol
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      
      // Filtro por proyecto curricular
      const matchesProjectArea = !this.selectedProjectArea || 
        user.projectAreaId === this.selectedProjectArea;
      
      return matchesSearch && matchesRole && matchesProjectArea;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = null;
    this.selectedProjectArea = null;
    this.applyFilters();
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ESTUDIANTE': 'Estudiante',
      'DOCENTE': 'Docente',
      'COORDINADOR': 'Coordinador',
      'ADMINISTRADOR': 'Administrador'
    };
    return labels[role] || role;
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'ESTUDIANTE': '#4caf50',
      'DOCENTE': '#2196f3',
      'COORDINADOR': '#ff9800',
      'ADMINISTRADOR': '#9c27b0'
    };
    return colors[role] || '#757575';
  }

  createUser(): void {
    console.log('createUser called');
    try {
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '600px',
        data: {}
      });

      console.log('Dialog opened:', dialogRef);

      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result) {
          this.apiService.createUser(result).subscribe({
            next: () => {
              this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
              this.loadUsers();
              this.clearFilters();
            },
            error: (error) => {
              console.error('Error creating user:', error);
              this.snackBar.open(error.error?.message || 'Error al crear usuario', 'Cerrar', { duration: 3000 });
            }
          });
        }
      });
    } catch (error) {
      console.error('Error opening dialog:', error);
      this.snackBar.open('Error al abrir el diálogo', 'Cerrar', { duration: 3000 });
    }
  }

  editUser(user: any): void {
    console.log('editUser called with user:', user);
    try {
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '600px',
        data: { user }
      });

      console.log('Dialog opened:', dialogRef);

      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result) {
          if (result.user) {
            // Actualizar usuario
            this.apiService.updateUser(user.userId, result.user).subscribe({
              next: () => {
              // Si es coordinador y hay cambios en los equipos
              if (result.coordinatorId && result.coordinatedTeamId) {
                this.apiService.updateCoordinatorTeams(result.coordinatorId, result.coordinatedTeamId).subscribe({
                  next: () => {
                    this.snackBar.open('Usuario y grupo actualizados exitosamente', 'Cerrar', { duration: 3000 });
                    this.loadUsers();
                    this.applyFilters();
                  },
                  error: (error) => {
                    console.error('Error updating coordinator team:', error);
                    this.snackBar.open('Usuario actualizado pero error al actualizar grupo: ' + (error.error?.message || 'Error desconocido'), 'Cerrar', { duration: 5000 });
                    this.loadUsers();
                  }
                });
              } else {
                this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', { duration: 3000 });
                this.loadUsers();
                this.applyFilters();
              }
              },
              error: (error) => {
                console.error('Error updating user:', error);
                this.snackBar.open(error.error?.message || 'Error al actualizar usuario', 'Cerrar', { duration: 3000 });
              }
            });
          }
        }
      });
    } catch (error) {
      console.error('Error opening dialog:', error);
      this.snackBar.open('Error al abrir el diálogo', 'Cerrar', { duration: 3000 });
    }
  }

  deleteUser(user: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de eliminar al usuario ${user.name} (${user.email})?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteUser(user.userId).subscribe({
          next: () => {
            this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadUsers();
            this.applyFilters();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            const errorMessage = error.error?.message || 'No se puede eliminar el usuario porque tiene relaciones con otros datos del sistema';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
          }
        });
      }
    });
  }
}

