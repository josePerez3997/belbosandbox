import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  isLoading = false;
  errorMessage: string | null = null;

  onLogin() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.isLoading = true;
    this.errorMessage = null;

    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/banks']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        console.error('Login error:', err);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return 'Credenciales inválidas. Por favor verifique su email y contraseña.';
    } else if (error.code === 'auth/too-many-requests') {
      return 'Demasiados intentos fallidos. Por favor intente más tarde.';
    }
    return error.message || 'Error de autenticación. Por favor intente nuevamente.';
  }
}
