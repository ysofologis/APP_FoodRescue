import { Routes } from '@angular/router';
import { DonorDashboardComponent } from './donor-feature/donor-dashboard.component';
import { RecipientDashboardComponent } from './recipient-feature/recipient-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'donor', pathMatch: 'full' },
  { path: 'donor', component: DonorDashboardComponent },
  { path: 'recipient', component: RecipientDashboardComponent }
];
