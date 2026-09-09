import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav style="margin-bottom: 20px;">
      <a routerLink="/donor" style="margin-right: 16px;">Donor Dashboard</a>
      <a routerLink="/recipient">Recipient Dashboard</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
