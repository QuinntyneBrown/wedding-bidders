import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BidService } from '../../core/services';
import { Bid } from '../../core/models';

@Component({
  selector: 'app-bids',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './bids.html',
  styleUrls: ['./bids.scss']
})
export class Bids implements OnInit {
  bids: Bid[] = [];
  weddingId: string | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bidService: BidService
  ) {}

  ngOnInit(): void {
    this.weddingId = this.route.snapshot.paramMap.get('weddingId');
    if (this.weddingId) {
      this.loadBidsByWedding();
    } else {
      this.loadBidsByCurrentProfile();
    }
  }

  loadBidsByWedding(): void {
    if (!this.weddingId) return;

    this.isLoading = true;
    this.bidService.getBidsByWeddingId(this.weddingId).subscribe({
      next: (bids) => {
        this.bids = bids;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load bids';
        this.isLoading = false;
      }
    });
  }

  loadBidsByCurrentProfile(): void {
    this.isLoading = true;
    this.bidService.getBidsByCurrentProfile().subscribe({
      next: (bids) => {
        this.bids = bids;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load bids';
        this.isLoading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  }
}
