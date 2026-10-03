import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AuthService } from '../core/auth/auth.service';
import { DonorApiService, ListingResponse, DonorImpactSummary } from '../core/api/donor-api.service';
import { CreateListingFormComponent } from './create-listing-form.component';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, CreateListingFormComponent],
  templateUrl: './donor-dashboard.component.html',
  styleUrl: './donor-dashboard.component.css',
})
export class DonorDashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly donorApi = inject(DonorApiService);

  readonly donorId = this.auth.linkedId;
  readonly listings = signal<ListingResponse[]>([]);
  readonly impact = signal<DonorImpactSummary | null>(null);
  readonly listingsError = signal<string | null>(null);
  readonly impactError = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.auth.linkedId();
    if (!id) return;
    this.donorApi.listListings({ donorId: id }).subscribe({
      next: (res) => this.listings.set(res),
      error: (err) =>
        this.listingsError.set(this.extractMessage(err, 'Failed to load listings')),
    });
    this.donorApi.getDonorImpact(id).subscribe({
      next: (res) => this.impact.set(res),
      error: (err) =>
        this.impactError.set(this.extractMessage(err, 'Failed to load impact')),
    });
  }

  private extractMessage(err: any, fallback: string): string {
    const m = err?.error?.message ?? err?.message ?? fallback;
    return Array.isArray(m) ? m.join(', ') : String(m);
  }
}