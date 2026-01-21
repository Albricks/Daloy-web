import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup
} from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {

  signupForm!: FormGroup;
  profilePreview: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  // 🔐 Caps Lock detection
  capsLockOn = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildForm();
      });

    this.buildForm();
  }

  /* ---------------------------
     FORM BUILDER
  ---------------------------- */
  private buildForm(): void {
    this.signupForm = this.fb.nonNullable.group(
      {
        username: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+$/)]],
        fullName: ['', Validators.required],
        birthDate: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        profileImage: [null as File | null] // 👈 used for FormData
      },
      {
        validators: [this.passwordMatchValidator]
      }
    );

    this.profilePreview = null;
    this.errorMessage = null;
    this.successMessage = null;
    this.isSubmitting = false;
    this.capsLockOn = false;
  }

  /* ---------------------------
     VALIDATORS
  ---------------------------- */
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  /* ---------------------------
     PASSWORD RULE HELPERS
  ---------------------------- */
  hasUppercase = () => /[A-Z]/.test(this.f['password'].value || '');
  hasLowercase = () => /[a-z]/.test(this.f['password'].value || '');
  hasNumber = () => /[0-9]/.test(this.f['password'].value || '');
  hasSpecial = () => /[^A-Za-z0-9]/.test(this.f['password'].value || '');
  hasMinLength = () => (this.f['password'].value || '').length >= 8;

  onPasswordKey(event: KeyboardEvent) {
    this.capsLockOn = event.getModifierState('CapsLock');
  }

  /* ---------------------------
     IMAGE PREVIEW
  ---------------------------- */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    // 👇 store File object (important)
    this.signupForm.patchValue({ profileImage: file });

    const reader = new FileReader();
    reader.onload = () => (this.profilePreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  /* ---------------------------
     SUBMIT (REGISTER)
     🔥 SWITCHED TO FormData
  ---------------------------- */
  submit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const {
      email,
      password,
      username,
      fullName,
      birthDate,
      profileImage
    } = this.signupForm.value;

    // ✅ FormData instead of JSON
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);
    formData.append('fullName', fullName);
    formData.append('birthDate', new Date(birthDate).toISOString());

    if (profileImage) {
      formData.append('avatar', profileImage);
    }

    this.authService.register(formData).subscribe({
      next: () => {
        this.successMessage = '🎉 Account created successfully! Redirecting to login…';
        this.signupForm.disable();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        console.error(err);
        this.isSubmitting = false;
        this.errorMessage =
          err?.error?.message ?? 'Registration failed';
      }
    });
  }

get showPasswordRules(): boolean {
  const passwordControl = this.f['password'];

  return (
    passwordControl.touched &&
    passwordControl.invalid
  );
}

  get f() {
    return this.signupForm.controls;
  }
}
