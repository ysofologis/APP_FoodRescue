import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AuthService } from '../core/auth/auth.service';
import {
  DonorApiService,
  ListingResponse,
  RecipientImpactSummary,
} from '../core/api/donor-api.service';

@Component({
  selector: 'app-recipient-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './recipient-dashboard.component.html',
  styleUrl: './recipient-dashboard.component.css',
})
export class RecipientDashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly donorApi = inject(DonorApiService);

  readonly recipientId = this.auth.linkedId;
  readonly listings = signal<ListingResponse[]>([]);
  readonly impact = signal<RecipientImpactSummary | null>(null);
  readonly listingsError = signal<string | null>(null);
  readonly impactError = signal<string | null>(null);
  readonly claimingId = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh();
    const rid = this.auth.linkedId();
    if (rid) {
      this.donorApi.getRecipientImpact(rid).subscribe({
        next: (res) => this.impact.set(res),
        error: (err) =>
          this.impactError.set(this.extractMessage(err, 'Failed to load impact')),
      });
    }
  }

  refresh(): void {
    this.donorApi.listListings({ status: 'AVAILABLE' }).subscribe({
      next: (res) => this.listings.set(res),
      error: (err) =>
        this.listingsError.set(this.extractMessage(err, 'Failed to load listings')),
    });
  }

  claim(listingId: string): void {
    const recipientId = this.auth.linkedId();
    if (!recipientId) return;
    this.claimingId.set(listingId);
    this.donorApi.claimListing(listingId, recipientId).subscribe({
      next: () => {
        this.claimingId.set(null);
        this.refresh();
      },
      error: (err) => {
        this.claimingId.set(null);
        const m = this.extractMessage(err, 'Failed to claim listing');
        this.listingsError.set(m);
      },
    });
  }

  private extractMessage(err: any, fallback: string): string {
    const m = err?.error?.message ?? err?.message ?? fallback;
    return Array.isArray(m) ? m.join(', ') : String(m);
  }
}