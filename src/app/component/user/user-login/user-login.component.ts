import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  // UI state
  showPassword = false;
  showForgotPassword = false;

  // Forms
  loginForm!: FormGroup;
  forgotForm!: FormGroup;

  // Messages
  errorMessage: string | null = null;
  forgotMessage: string | null = null;
  forgotError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Login form
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    // Forgot password form (modal)
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // --------------------
  // Login logic
  // --------------------

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

onSubmit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.errorMessage = null;

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: () => {
      this.router.navigate(['/home']);
    },
    error: err => {
      this.errorMessage = err?.error?.message ?? 'Invalid credentials';
    }
  });
}

  // --------------------
  // Forgot password modal
  // --------------------

  openForgotPassword() {
    this.showForgotPassword = true;
  }

  closeForgotPassword() {
    this.showForgotPassword = false;
    this.forgotForm.reset();
    this.forgotMessage = null;
    this.forgotError = null;
  }

sendReset() {
  this.forgotError = null;
  this.forgotMessage = 'Password reset will be available soon.';
}

}
