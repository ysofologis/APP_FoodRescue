import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonorService } from './donor.service';

@Component({
  selector: 'app-create-listing-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <h3>Create Food Listing</h3>

      <label>Description</label>
      <input formControlName="description" placeholder="e.g., 20 loaves of bread">

      <label>Quantity</label>
      <input type="number" formControlName="quantity">

      <label>Pickup Location</label>
      <input formControlName="pickupLocation" placeholder="123 Main St, Athens">

      <button type="submit" [disabled]="form.invalid">Publish Listing</button>
    </form>

    <div *ngIf="result">Listing created: {{ result.id }} ({{ result.status }})</div>
  `,
  styles: [`form { display: flex; flex-direction: column; gap: 8px; max-width: 400px; }`]
})
export class CreateListingFormComponent {
  form: FormGroup;
  result: any = null;

  constructor(private fb: FormBuilder, private donorService: DonorService) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      pickupLocation: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    // In a real app the donorId would come from auth context
    const req = {
      donorId: '00000000-0000-0000-0000-000000000001',
      ...this.form.value
    };

    this.donorService.createListing(req).subscribe(res => {
      this.result = res;
      this.form.reset();
    });
  }
}
