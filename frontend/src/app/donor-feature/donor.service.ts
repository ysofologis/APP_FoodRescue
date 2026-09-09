import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateListingRequest {
  donorId: string;
  description: string;
  quantity: number;
  pickupLocation: string;
}

export interface CreateListingResponse {
  id: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class DonorService {
  private readonly apiUrl = '/api/listings';

  constructor(private http: HttpClient) {}

  createListing(req: CreateListingRequest): Observable<CreateListingResponse> {
    return this.http.post<CreateListingResponse>(this.apiUrl, req);
  }
}
