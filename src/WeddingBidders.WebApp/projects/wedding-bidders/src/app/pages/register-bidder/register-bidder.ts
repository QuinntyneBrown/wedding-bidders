import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, Router } from '@angular/router';
import { BidderService } from '../../core/services';
import { BidderTypeDto, BidderType } from '../../core/models';

@Component({
  selector: 'app-register-bidder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './register-bidder.html',
  styleUrls: ['./register-bidder.scss']
})
export class RegisterBidder implements OnInit {
  registerForm!: FormGroup;
  bidderTypes: BidderTypeDto[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private bidderService: BidderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      companyName: [''],
      description: [''],
      bidderType: [BidderType.Caterer, [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.loadBidderTypes();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  loadBidderTypes(): void {
    this.bidderService.getBidderTypes().subscribe({
      next: (types) => {
        this.bidderTypes = types;
      },
      error: () => {
        this.errorMessage = 'Failed to load bidder types';
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.registerForm.value;

    this.bidderService.registerBidder({
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      email: formValue.email,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      companyName: formValue.companyName,
      description: formValue.description,
      bidderType: formValue.bidderType
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed';
      }
    });
  }
}
