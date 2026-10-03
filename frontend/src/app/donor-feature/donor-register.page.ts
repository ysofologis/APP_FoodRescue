import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DonorApiService, RegisterDonorDto, DonorResponse } from '../core/api/donor-api.service';

@Component({
  selector: 'app-donor-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './donor-register.page.html',
  styleUrl: './donor-register.page.css',
})
export class DonorRegisterPage {
  private readonly donorApi = inject(DonorApiService);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastResult = signal<DonorResponse | null>(null);

  model = {
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    businessLicense: '',
  };

  submit(): void {
    this.submitting.set(true);
    this.error.set(null);
    const dto: RegisterDonorDto = {
      name: this.model.name,
      contactEmail: this.model.contactEmail,
      contactPhone: this.model.contactPhone || undefined,
      address: this.model.address || undefined,
      businessLicense: this.model.businessLicense || undefined,
    };
    this.donorApi.register(dto).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.lastResult.set(res);
      },
      error: (err) => {
        this.submitting.set(false);
        const m = err?.error?.message ?? err?.message ?? 'Failed to register';
        this.error.set(Array.isArray(m) ? m.join(', ') : String(m));
      },
    });
  }
}