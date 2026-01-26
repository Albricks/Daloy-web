import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  profileForm!: FormGroup;

  avatarPreview: string | null = null;
  isSaving = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadProfile();
  }

  /* ---------------------------
     FORM
  ---------------------------- */
  private buildForm(): void {
    this.profileForm = this.fb.nonNullable.group({
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      avatar: [null as File | null]
    });
  }

  /* ---------------------------
     LOAD CURRENT PROFILE
  ---------------------------- */
  private loadProfile(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) return;

      this.profileForm.patchValue({
        username: user.userName,
        email: user.email,
        fullName: user.fullName ?? '',
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().substring(0, 10)
          : ''
      });

      this.avatarPreview = user.avatarUrl ?? null;
    });
  }

  /* ---------------------------
     AVATAR PREVIEW
  ---------------------------- */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    this.profileForm.patchValue({ avatar: file });

    const reader = new FileReader();
    reader.onload = () => {
      // Force Angular to pick up async FileReader change
      Promise.resolve().then(() => {
        this.avatarPreview = reader.result as string;
      });
    };
reader.readAsDataURL(file);
    reader.readAsDataURL(file);
  }

  /* ---------------------------
     SAVE PROFILE
  ---------------------------- */
  save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.successMessage = null;
    this.errorMessage = null;

    const { fullName, birthDate, avatar } = this.profileForm.getRawValue();

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('birthDate', new Date(birthDate).toISOString());

    if (avatar) {
      formData.append('avatar', avatar);
    }

    // 🔥 You will implement this API next:
    // PUT /api/profile/me
    this.authService.updateProfile(formData).subscribe({
      next: (updatedUser) => {
        this.successMessage = '✅ Profile updated successfully';
        this.isSaving = false;

        // Refresh auth state so navbar updates
        this.authService.loadMe();
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to update profile';
        this.isSaving = false;
      }
    });
  }

  /* ---------------------------
     CHANGE PASSWORD (SEPARATE FLOW)
  ---------------------------- */
  goChangePassword() {
    // route or open modal later
    alert('Change password flow coming soon 🔐');
  }

  get f() {
    return this.profileForm.controls;
  }
}
