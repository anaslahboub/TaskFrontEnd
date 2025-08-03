import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakAuthService, ForgotPasswordRequest, PasswordResetResponse } from '../index';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  submitted = false;

  constructor(
    private keycloakAuthService: KeycloakAuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const request: ForgotPasswordRequest = {
        email: this.email
      };

      const response: PasswordResetResponse = await this.keycloakAuthService.forgotPassword(request);

      if (response.success) {
        this.successMessage = response.message;
        this.submitted = true;
      } else {
        this.errorMessage = response.message;
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      this.errorMessage = 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }

  resetForm() {
    this.email = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.submitted = false;
  }
} 