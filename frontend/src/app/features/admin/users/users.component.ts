import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { UserDialogComponent } from '../../../shared/components/user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
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
      
      <mat-card>
        <table mat-table [dataSource]="users" class="users-table">
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
              <mat-chip>{{user.role}}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button (click)="editUser(user)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteUser(user)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
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
    
    .users-table {
      width: 100%;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => console.error('Error loading users:', error)
    });
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
    if (confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) {
      this.apiService.deleteUser(user.userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }
}

