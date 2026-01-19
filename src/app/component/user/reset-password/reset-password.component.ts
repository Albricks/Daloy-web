import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
    imports: [
    CommonModule,          // 👈 enables *ngIf
    ReactiveFormsModule    // 👈 enables formGroup & formControlName
  ],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {

  form!: FormGroup;
  message: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', Validators.required]
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // const { error } = await this.authService.updatePassword(
    //   this.form.value.password!
    // );

    // if (error) {
    //   this.error = error.message;
    //   return;
    // }

    // this.message = 'Password updated successfully. Redirecting to login...';

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
