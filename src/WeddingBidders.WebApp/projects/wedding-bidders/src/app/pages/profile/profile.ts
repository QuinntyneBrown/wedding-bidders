import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { ProfileService, CustomerService, BidderService, WeddingService, BidService } from '../../core/services';
import { Profile, ProfileType, Customer, Bidder, Wedding, Bid } from '../../core/models';

@Component({
  selector: 'app-profile',
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
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfilePage implements OnInit {
  profile: Profile | null = null;
  customer: Customer | null = null;
  bidder: Bidder | null = null;
  weddings: Wedding[] = [];
  bids: Bid[] = [];
  isLoading = true;
  errorMessage = '';

  readonly ProfileType = ProfileType;

  constructor(
    private profileService: ProfileService,
    private customerService: CustomerService,
    private bidderService: BidderService,
    private weddingService: WeddingService,
    private bidService: BidService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getCurrent().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileService.setCurrentProfile(profile);
        this.loadRoleSpecificData(profile);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  loadRoleSpecificData(profile: Profile): void {
    if (profile.profileType === ProfileType.Customer) {
      this.loadCustomerData();
    } else {
      this.loadBidderData();
    }
  }

  loadCustomerData(): void {
    this.customerService.getCurrentCustomer().subscribe({
      next: (customer: Customer) => {
        this.customer = customer;
        this.loadWeddings();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadBidderData(): void {
    this.bidderService.getCurrentBidder().subscribe({
      next: (bidder: Bidder) => {
        this.bidder = bidder;
        this.loadBidderBids();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadWeddings(): void {
    this.weddingService.getWeddingsByCurrentProfile().subscribe({
      next: (weddings) => {
        this.weddings = weddings;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadBidderBids(): void {
    this.bidService.getBidsByCurrentProfile().subscribe({
      next: (bids: Bid[]) => {
        this.bids = bids;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getProfileTypeName(type: ProfileType): string {
    const names: Record<ProfileType, string> = {
      [ProfileType.Customer]: 'Customer',
      [ProfileType.Caterer]: 'Caterer',
      [ProfileType.Photographer]: 'Photographer',
      [ProfileType.MakeUpArtist]: 'Make Up Artist',
      [ProfileType.EventPlanner]: 'Event Planner',
      [ProfileType.Internal]: 'Internal',
      [ProfileType.DiscJockey]: 'Disc Jockey'
    };
    return names[type] || 'Unknown';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  }
}
