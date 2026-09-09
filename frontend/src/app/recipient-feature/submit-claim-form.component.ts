import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipientService } from './recipient.service';

@Component({
  selector: 'app-submit-claim-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <h3>Submit Claim for Food Listing</h3>

      <label>Food Listing ID</label>
      <input formControlName="foodListingId" placeholder="UUID of the listing">

      <button type="submit" [disabled]="form.invalid">Submit Claim</button>
    </form>

    <div *ngIf="result">Claim created: {{ result.id }} ({{ result.status }})</div>
  `,
  styles: [`form { display: flex; flex-direction: column; gap: 8px; max-width: 400px; }`]
})
export class SubmitClaimFormComponent {
  form: FormGroup;
  result: any = null;

  constructor(private fb: FormBuilder, private recipientService: RecipientService) {
    this.form = this.fb.group({
      foodListingId: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    // In a real app the recipientId would come from auth context
    const req = {
      recipientId: '00000000-0000-0000-0000-000000000002',
      foodListingId: this.form.value.foodListingId
    };

    this.recipientService.submitClaim(req).subscribe(res => {
      this.result = res;
      this.form.reset();
    });
  }
}
