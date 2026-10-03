import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRecipientDto {
  name: string;
  orgType: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  legalDocsRef?: string;
  dietaryRestrictions?: string[];
  preferredCategories?: string[];
}

export interface RecipientResponse {
  id: string;
  name: string;
  orgType: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  status: string;
  reliabilityScore: number;
  dietaryRestrictions: string[];
  preferredCategories: string[];
}

@Injectable({ providedIn: 'root' })
export class RecipientApiService {
  constructor(private readonly http: HttpClient) {}

  register(dto: RegisterRecipientDto): Observable<RecipientResponse> {
    return this.http.post<RecipientResponse>('/api/recipients', dto);
  }

  list(): Observable<RecipientResponse[]> {
    return this.http.get<RecipientResponse[]>('/api/recipients');
  }

  getById(id: string): Observable<RecipientResponse> {
    return this.http.get<RecipientResponse>(`/api/recipients/${id}`);
  }
}