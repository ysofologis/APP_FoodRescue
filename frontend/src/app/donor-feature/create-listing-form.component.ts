import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonorApiService, CreateListingDto, ListingResponse } from '../core/api/donor-api.service';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-create-listing-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-listing-form.component.html',
  styleUrl: './create-listing-form.component.css',
})
export class CreateListingFormComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly donorApi = inject(DonorApiService);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastResult = signal<ListingResponse | null>(null);

  model = {
    title: '',
    description: '',
    category: 'BAKERY',
    condition: 'FRESH',
    quantityValue: 1,
    quantityUnit: 'KG',
    storageRequirement: 'AMBIENT',
    pickupWindowStart: this.futureIso(2),
    pickupWindowEnd: this.futureIso(4),
    pickupLocation: '',
    allergens: '',
  };

  ngOnInit(): void {
    // Defaults are reasonable so the form is testable from a fresh state.
  }

  submit(): void {
    const donorId = this.auth.linkedId();
    if (!donorId) {
      this.error.set('Not logged in');
      return;
    }
    this.submitting.set(true);
    this.error.set(null);

    const dto: CreateListingDto = {
      title: this.model.title,
      donorId,
      category: this.model.category,
      quantityValue: Number(this.model.quantityValue),
      quantityUnit: this.model.quantityUnit,
      condition: this.model.condition,
      storageRequirement: this.model.storageRequirement,
      pickupWindowStart: new Date(this.model.pickupWindowStart).toISOString(),
      pickupWindowEnd: new Date(this.model.pickupWindowEnd).toISOString(),
      pickupLocation: this.model.pickupLocation,
      description: this.model.description || undefined,
      allergens: this.model.allergens || undefined,
    };

    this.donorApi.createListing(dto).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.lastResult.set(res);
      },
      error: (err) => {
        this.submitting.set(false);
        const msg =
          err?.error?.message?.toString?.() ??
          err?.message ??
          'Failed to create listing';
        this.error.set(Array.isArray(msg) ? msg.join(', ') : msg);
      },
    });
  }

  private futureIso(hoursFromNow: number): string {
    const d = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}