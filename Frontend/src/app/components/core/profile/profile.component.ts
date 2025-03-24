import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  isEditMode = false;
  updateSuccess = false;
  updateError = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  defaultAvatarUrl = 'assets/default-avatar.svg';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      profilePicture: [''],
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        username: this.user.username,
        email: this.user.email,
      });

      if (this.user.profilePicture) {
        this.previewUrl = this.user.profilePicture;
      }
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.updateSuccess = false;
    this.updateError = '';

    if (!this.isEditMode) {
      this.selectedFile = null;
      this.previewUrl = this.user?.profilePicture || null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      setTimeout(() => {
        this.user = {
          id: this.user!.id,
          username: this.profileForm.get('username')?.value,
          email: this.profileForm.get('email')?.value,
          token: this.user!.token,

          profilePicture: this.previewUrl || this.user?.profilePicture,
        };

        localStorage.setItem('currentUser', JSON.stringify(this.user));

        this.updateSuccess = true;
        this.isEditMode = false;
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
        });
      }, 1000);
    }
  }

  getProfileImageUrl(): string {
    return (
      this.previewUrl || this.user?.profilePicture || this.defaultAvatarUrl
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
