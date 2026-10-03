import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicImpactSummary {
  totalMealsSaved: number;
  totalCo2Avoided: number;
  totalKgDelivered: number;
}

@Injectable({ providedIn: 'root' })
export class PublicImpactApiService {
  constructor(private readonly http: HttpClient) {}

  getPublicImpact(): Observable<PublicImpactSummary> {
    return this.http.get<PublicImpactSummary>('/api/impact/public');
  }
}