import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PublicImpactApiService, PublicImpactSummary } from '../../core/api/public-impact-api.service';

@Component({
  selector: 'app-public-impact',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './public-impact.page.html',
  styleUrl: './public-impact.page.css',
})
export class PublicImpactPage implements OnInit {
  private readonly api = inject(PublicImpactApiService);

  readonly impact = signal<PublicImpactSummary | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.api.getPublicImpact().subscribe({
      next: (res) => {
        this.impact.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        const m = err?.error?.message ?? err?.message ?? 'Failed to load impact';
        this.error.set(Array.isArray(m) ? m.join(', ') : String(m));
      },
    });
  }
}