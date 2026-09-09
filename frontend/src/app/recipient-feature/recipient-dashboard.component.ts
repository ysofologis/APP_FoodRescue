import { Component } from '@angular/core';

@Component({
  selector: 'app-recipient-dashboard',
  template: `
    <div class="recipient-dashboard">
      <h2>Recipient Dashboard</h2>
      <p class="context-label">Bounded Context: Recipient & Matching</p>
      <app-submit-claim-form></app-submit-claim-form>
    </div>
  `,
  styles: [`.context-label { color: #666; font-size: 0.9em; }`]
})
export class RecipientDashboardComponent {}
