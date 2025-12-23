import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { SubscriptionService } from '../../core/services';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './payment.html',
  styleUrls: ['./payment.scss']
})
export class Payment {
  paymentForm: FormGroup;
  isProcessing = false;
  errorMessage = '';
  readonly membershipPrice = 180;

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    // In a real implementation, you would use Stripe.js to tokenize the card
    // For now, we'll simulate the token creation
    const mockToken = `tok_${Date.now()}`;

    this.subscriptionService.charge({ token: mockToken }).subscribe({
      next: () => {
        this.snackBar.open('Payment successful! Your account has been upgraded.', 'Close', {
          duration: 5000
        });
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Payment failed. Please try again.';
        this.isProcessing = false;
      }
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    input.value = value;
    this.paymentForm.patchValue({ cardNumber: value });
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    input.value = value;
    this.paymentForm.patchValue({ expiry: value });
  }

  formatCvc(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    input.value = value;
    this.paymentForm.patchValue({ cvc: value });
  }

  getCardNumberDisplay(): string {
    const value = this.paymentForm.value.cardNumber || '';
    return value.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  getErrorMessage(field: string): string {
    const control = this.paymentForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('pattern')) {
      switch (field) {
        case 'cardNumber':
          return 'Enter a valid 16-digit card number';
        case 'expiry':
          return 'Enter expiry as MM/YY';
        case 'cvc':
          return 'Enter a valid 3 or 4 digit CVC';
        default:
          return 'Invalid format';
      }
    }
    return '';
  }
}
