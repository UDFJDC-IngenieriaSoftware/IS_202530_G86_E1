import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'applications',
    loadComponent: () => import('./applications/applications.component').then(m => m.ApplicationsComponent)
  },
  {
    path: 'my-teams',
    loadComponent: () => import('./my-teams/my-teams.component').then(m => m.MyTeamsComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'my-teams-student',
    loadComponent: () => import('./my-teams-student/my-teams-student.component').then(m => m.MyTeamsStudentComponent)
  }
];

