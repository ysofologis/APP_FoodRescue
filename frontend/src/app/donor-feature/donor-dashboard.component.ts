import { Component } from '@angular/core';

@Component({
  selector: 'app-donor-dashboard',
  template: `
    <div class="donor-dashboard">
      <h2>Donor Dashboard</h2>
      <p class="context-label">Bounded Context: Donor Management</p>
      <app-create-listing-form></app-create-listing-form>
    </div>
  `,
  styles: [`.context-label { color: #666; font-size: 0.9em; }`]
})
export class DonorDashboardComponent {}
