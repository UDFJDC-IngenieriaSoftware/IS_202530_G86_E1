import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:8081/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Teams
  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/teams/public`);
  }

  getMyTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/teams/my-teams`);
  }

  getTeamById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/teams/public/${id}`);
  }

  getTeamsByArea(areaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/teams/public/area/${areaId}`);
  }

  createTeam(team: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/teams`, team);
  }

  updateTeam(id: number, team: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/teams/${id}`, team);
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/teams/${id}`);
  }

  // Projects
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/projects/public`);
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/projects/public/${id}`);
  }

  getProjectsByTeam(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/projects/public/team/${teamId}`);
  }

  createProject(project: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/projects`, project);
  }

  updateProject(id: number, project: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/projects/${id}`);
  }

  // Applications
  createApplication(application: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/applications`, application);
  }

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/applications/my-applications`);
  }

  getMyApplicationByTeam(teamId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/applications/my-application/team/${teamId}`).pipe(
      catchError(error => {
        // Si es 404 o el error indica que no hay aplicación, devolver null
        if (error.status === 404 || error.status === 500) {
          return of(null);
        }
        throw error;
      })
    );
  }

  getApplicationsByTeam(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/applications/team/${teamId}`);
  }

  updateApplicationStatus(id: number, state: string, answerMessage: string): Observable<any> {
    return this.http.put<any>(`${API_URL}/applications/${id}/status`, { state, answerMessage });
  }

  // Public Data
  getProjectAreas(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/public/project-areas`);
  }

  getInvestigationAreas(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/public/investigation-areas`);
  }

  getProductTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/public/product-types`);
  }

  // Users (Admin)
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/users`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/users/${id}`);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/users/${id}`);
  }
}

