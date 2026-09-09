import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DonorDashboardComponent } from './donor-dashboard.component';
import { CreateListingFormComponent } from './create-listing-form.component';
import { DonorService } from './donor.service';

@NgModule({
  declarations: [
    DonorDashboardComponent,
    CreateListingFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [DonorService],
  exports: [DonorDashboardComponent]
})
export class DonorFeatureModule { }
