import { Routes } from '@angular/router';

import { DonorDashboardComponent } from './donor-feature/donor-dashboard.component';
import { DonorRegisterPage } from './donor-feature/donor-register.page';
import { RecipientDashboardComponent } from './recipient-feature/recipient-dashboard.component';
import { RecipientRegisterPage } from './recipient-feature/recipient-register.page';
import { LoginPage } from './core/auth/login/login.page';
import { PublicImpactPage } from './shared/public-impact/public-impact.page';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'impact' },
  { path: 'login', component: LoginPage },
  { path: 'impact', component: PublicImpactPage },

  {
    path: 'donor',
    canActivate: [authGuard],
    children: [
      { path: '', component: DonorDashboardComponent },
      { path: 'register', component: DonorRegisterPage },
    ],
  },

  {
    path: 'recipient',
    canActivate: [authGuard],
    children: [
      { path: '', component: RecipientDashboardComponent },
      { path: 'register', component: RecipientRegisterPage },
    ],
  },

  { path: '**', redirectTo: 'impact' },
];