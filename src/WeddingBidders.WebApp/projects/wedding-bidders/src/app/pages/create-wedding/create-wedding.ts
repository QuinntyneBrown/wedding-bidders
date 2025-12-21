import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { WeddingService, BidderService } from '../../core/services';
import { BidderTypeDto } from '../../core/models';

@Component({
  selector: 'app-create-wedding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-wedding.html',
  styleUrls: ['./create-wedding.scss']
})
export class CreateWedding implements OnInit {
  weddingForm!: FormGroup;
  bidderTypes: BidderTypeDto[] = [];
  selectedCategories: string[] = [];
  isLoading = false;
  errorMessage = '';
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private weddingService: WeddingService,
    private bidderService: BidderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.weddingForm = this.fb.group({
      numberOfGuests: ['', [Validators.required, Validators.min(1)]],
      numberOfHours: ['', [Validators.required, Validators.min(1)]],
      location: ['', [Validators.required, Validators.maxLength(500)]],
      date: ['', [Validators.required]]
    });

    this.loadBidderTypes();
  }

  loadBidderTypes(): void {
    this.bidderService.getBidderTypes().subscribe({
      next: (types) => {
        this.bidderTypes = types;
      }
    });
  }

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  onSubmit(): void {
    if (this.weddingForm.invalid || this.selectedCategories.length === 0) {
      if (this.selectedCategories.length === 0) {
        this.errorMessage = 'Please select at least one service category';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.weddingForm.value;

    this.weddingService.createWedding({
      numberOfGuests: formValue.numberOfGuests,
      numberOfHours: formValue.numberOfHours,
      location: formValue.location,
      date: formValue.date.toISOString(),
      categories: this.selectedCategories.map(name => ({ name }))
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/weddings']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create wedding';
      }
    });
  }
}
