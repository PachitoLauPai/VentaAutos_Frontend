import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: 'ADMIN' | 'CLIENTE';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private api: ApiService) { }

  login(credentials: LoginRequest): Observable<any> {
    return this.api.post('auth/login', credentials).pipe(
      tap((response: any) => {
        if (response.id) {
          this.currentUser = response;
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.api.post('auth/registro', userData);
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      this.currentUser = stored ? JSON.parse(stored) : null;
    }
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.rol === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // ✅ NUEVO: Obtener todos los usuarios
  getUsuarios(): Observable<User[]> {
    return this.api.get<User[]>('usuarios');
  }

  
  // En AuthService, agregar:
  actualizarUsuario(id: number, datos: any): Observable<User> {
    return this.api.put<User>(`usuarios/${id}`, datos);
  }


  eliminarUsuario(id: number): Observable<void> {
    return this.api.delete<void>(`usuarios/${id}`);
  }

}