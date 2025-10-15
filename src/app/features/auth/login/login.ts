import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.id) {
          this.router.navigate(['/autos']);
        } else {
          this.error = response.mensaje || 'Credenciales inválidas';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error en el servidor';
        console.error('Error:', error);
      }
    });
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}