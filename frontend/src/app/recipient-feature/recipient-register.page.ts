import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  RecipientApiService,
  RegisterRecipientDto,
  RecipientResponse,
} from '../core/api/recipient-api.service';

@Component({
  selector: 'app-recipient-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recipient-register.page.html',
  styleUrl: './recipient-register.page.css',
})
export class RecipientRegisterPage {
  private readonly api = inject(RecipientApiService);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastResult = signal<RecipientResponse | null>(null);

  model = {
    name: '',
    orgType: 'SHELTER',
    contactEmail: '',
    contactPhone: '',
    address: '',
    legalDocsRef: '',
  };

  submit(): void {
    this.submitting.set(true);
    this.error.set(null);
    const dto: RegisterRecipientDto = {
      name: this.model.name,
      orgType: this.model.orgType,
      contactEmail: this.model.contactEmail,
      contactPhone: this.model.contactPhone || undefined,
      address: this.model.address || undefined,
      legalDocsRef: this.model.legalDocsRef || undefined,
    };
    this.api.register(dto).subscribe({
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