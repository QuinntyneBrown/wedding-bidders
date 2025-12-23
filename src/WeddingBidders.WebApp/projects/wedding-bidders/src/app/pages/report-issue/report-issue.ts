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
import { IssueService } from '../../core/services';
import { CreateIssueRequest } from '../../core/models';

@Component({
  selector: 'app-report-issue',
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
  templateUrl: './report-issue.html',
  styleUrls: ['./report-issue.scss']
})
export class ReportIssue {
  issueForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.issueForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]]
    });
  }

  onSubmit(): void {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const request: CreateIssueRequest = {
      subject: this.issueForm.value.subject,
      content: this.issueForm.value.content
    };

    this.issueService.createIssue(request).subscribe({
      next: () => {
        this.snackBar.open('Issue reported successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to submit issue. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.issueForm.get(field);
    if (control?.hasError('required')) {
      return `${field === 'subject' ? 'Subject' : 'Description'} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Must be at least ${minLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Cannot exceed ${maxLength} characters`;
    }
    return '';
  }
}
