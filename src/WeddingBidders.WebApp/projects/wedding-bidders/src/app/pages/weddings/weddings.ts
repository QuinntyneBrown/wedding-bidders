import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { WeddingService } from '../../core/services';
import { Wedding } from '../../core/models';

@Component({
  selector: 'app-weddings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    RouterLink
  ],
  templateUrl: './weddings.html',
  styleUrls: ['./weddings.scss']
})
export class Weddings implements OnInit {
  weddings: Wedding[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private weddingService: WeddingService) {}

  ngOnInit(): void {
    this.loadWeddings();
  }

  loadWeddings(): void {
    this.isLoading = true;
    this.weddingService.getWeddingsByCurrentProfile().subscribe({
      next: (weddings) => {
        this.weddings = weddings;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load weddings';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
