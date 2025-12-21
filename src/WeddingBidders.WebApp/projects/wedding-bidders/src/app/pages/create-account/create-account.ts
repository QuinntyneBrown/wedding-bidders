import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Observable, map, debounceTime, of } from 'rxjs';
import { ProfileService, NavigationService, UserService } from '../../core/services';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './create-account.html',
  styleUrls: ['./create-account.scss']
})
export class CreateAccount {
  createAccountForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private navigationService: NavigationService,
    private userService: UserService
  ) {
    this.createAccountForm = this.fb.group({
      invitationToken: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email], [this.usernameExistsValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmation = group.get('passwordConfirmation')?.value;
    return password === confirmation ? null : { passwordMismatch: true };
  }

  private usernameExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return this.userService.exists(control.value).pipe(
      debounceTime(300),
      map(exists => exists ? { existingValue: true } : null)
    );
  }

  onSubmit(): void {
    if (this.createAccountForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.createAccountForm.value;

    this.profileService.create({
      email: formValue.email,
      password: formValue.password,
      passwordConfirmation: formValue.passwordConfirmation,
      invitationToken: formValue.invitationToken,
      firstname: formValue.firstname,
      lastname: formValue.lastname
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Redirecting to login...';
        setTimeout(() => {
          this.navigationService.redirectToLogin();
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create account';
      }
    });
  }
}
