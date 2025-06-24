import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.page.html',
  styleUrls: ['./signup-form.page.scss'],
  standalone: false,
})
export class SignupFormPage {
  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Getter methods for easy access in template
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  // Handle form submission
  onSubmit() {
    if (this.signupForm.valid) {
      // Call the login method from AuthService
      this.authService
        .register(this.email?.value, this.password?.value)
        .subscribe({
          next: (response) => {
            // Handle successful registration
            console.log('Registration successful', response);
            // redirect the user to login page
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Login failed', error);
          },
        });
    }
  }
}
