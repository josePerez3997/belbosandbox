import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = false;
  errorMessage: string | null = null;

  onRegister() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.isLoading = true;
    this.errorMessage = null;

    this.auth.register(email!, password!).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/banks']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        console.error('Registration error:', err);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'auth/email-already-in-use') {
      return 'Este email ya está registrado. Por favor use otro o intente iniciar sesión.';
    } else if (error.code === 'auth/weak-password') {
      return 'La contraseña es demasiado débil. Use al menos 6 caracteres.';
    }
    return error.message || 'Error de registro. Por favor intente nuevamente.';
  }
}
