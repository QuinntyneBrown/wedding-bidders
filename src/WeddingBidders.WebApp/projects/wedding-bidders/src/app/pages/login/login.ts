import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService, NavigationService, LocalStorageService, LOGIN_CREDENTIALS_KEY } from '../../core/services';
import { LoginCredentials } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navigationService: NavigationService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const savedCredentials = this.localStorageService.get<LoginCredentials>(LOGIN_CREDENTIALS_KEY);

    this.loginForm = this.fb.group({
      username: [savedCredentials?.username || '', [Validators.required, Validators.email]],
      password: [savedCredentials?.password || '', [Validators.required]],
      rememberMe: [!!savedCredentials]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      this.localStorageService.put(LOGIN_CREDENTIALS_KEY, { username, password });
    } else {
      this.localStorageService.remove(LOGIN_CREDENTIALS_KEY);
    }

    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            this.authService.setCurrentUser(user);
            this.navigationService.redirectPreLogin();
          },
          error: () => {
            this.isLoading = false;
            this.errorMessage = 'Failed to get user information';
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid username or password';
      }
    });
  }
}
