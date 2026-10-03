import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DonorResponse {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  businessLicense?: string;
  status: string;
}

export interface QuantityView {
  value: number;
  unit: string;
}

export interface ListingResponse {
  id: string;
  title: string;
  description?: string;
  donorId: string;
  category: string;
  quantity: QuantityView;
  condition: string;
  storageRequirement: string;
  allergens?: string;
  photoUrl?: string;
  pickupLocation: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  status: string;
  claimedBy?: string;
  claimedAt?: string;
}

export interface DonorImpactSummary {
  donorId: string;
  totalMealsSaved: number;
  totalCo2Avoided: number;
  totalKgDelivered: number;
}

export interface RecipientImpactSummary {
  recipientId: string;
  totalMealsSaved: number;
  totalCo2Avoided: number;
  totalKgDelivered: number;
}

export interface RegisterDonorDto {
  name: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  businessLicense?: string;
}

export interface CreateListingDto {
  title: string;
  donorId: string;
  category: string;
  quantityValue: number;
  quantityUnit: string;
  condition: string;
  storageRequirement: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  pickupLocation: string;
  description?: string;
  allergens?: string;
  photoUrl?: string;
}

export interface ClaimListingDto {
  listingId: string;
  recipientId: string;
}

@Injectable({ providedIn: 'root' })
export class DonorApiService {
  constructor(private readonly http: HttpClient) {}

  register(dto: RegisterDonorDto): Observable<DonorResponse> {
    return this.http.post<DonorResponse>('/api/donors', dto);
  }

  getById(id: string): Observable<DonorResponse> {
    return this.http.get<DonorResponse>(`/api/donors/${id}`);
  }

  createListing(dto: CreateListingDto): Observable<ListingResponse> {
    return this.http.post<ListingResponse>('/api/listings', dto);
  }

  listListings(opts?: { donorId?: string; status?: string }): Observable<ListingResponse[]> {
    const params: Record<string, string> = {};
    if (opts?.donorId) params['donorId'] = opts.donorId;
    if (opts?.status) params['status'] = opts.status;
    return this.http.get<ListingResponse[]>('/api/listings', { params });
  }

  getListingById(id: string): Observable<ListingResponse> {
    return this.http.get<ListingResponse>(`/api/listings/${id}`);
  }

  claimListing(listingId: string, recipientId: string): Observable<ListingResponse> {
    return this.http.post<ListingResponse>(
      `/api/listings/${listingId}/claim`,
      { listingId, recipientId } as ClaimListingDto,
    );
  }

  getDonorImpact(id: string): Observable<DonorImpactSummary> {
    return this.http.get<DonorImpactSummary>(`/api/donors/${id}/impact`);
  }

  getRecipientImpact(id: string): Observable<RecipientImpactSummary> {
    return this.http.get<RecipientImpactSummary>(`/api/recipients/${id}/impact`);
  }
}