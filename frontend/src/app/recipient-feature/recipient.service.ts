import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubmitClaimRequest {
  recipientId: string;
  foodListingId: string;
}

export interface SubmitClaimResponse {
  id: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class RecipientService {
  private readonly apiUrl = '/api/claims';

  constructor(private http: HttpClient) {}

  submitClaim(req: SubmitClaimRequest): Observable<SubmitClaimResponse> {
    return this.http.post<SubmitClaimResponse>(this.apiUrl, req);
  }
}
