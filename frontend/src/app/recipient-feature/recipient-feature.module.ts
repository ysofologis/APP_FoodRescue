import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RecipientDashboardComponent } from './recipient-dashboard.component';
import { SubmitClaimFormComponent } from './submit-claim-form.component';
import { RecipientService } from './recipient.service';

@NgModule({
  declarations: [
    RecipientDashboardComponent,
    SubmitClaimFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [RecipientService],
  exports: [RecipientDashboardComponent]
})
export class RecipientFeatureModule { }
