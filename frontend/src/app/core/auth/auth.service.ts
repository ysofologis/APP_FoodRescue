import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export type Role = 'DONOR' | 'RECIPIENT' | 'VERIFIER' | 'ADMIN';

export interface LoginResponse {
  accessToken: string;
  role: Role;
  linkedId: string;
}

export interface AuthState {
  token: string | null;
  role: Role | null;
  linkedId: string | null;
}

const INITIAL_STATE: AuthState = {
  token: null,
  role: null,
  linkedId: null,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'foodrescue.auth';
  private readonly _state = signal<AuthState>(this.loadFromStorage());

  readonly state = this._state.asReadonly();
  readonly isAuthenticated = computed(() => this._state().token !== null);
  readonly role = computed(() => this._state().role);
  readonly linkedId = computed(() => this._state().linkedId);

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse | null> {
    return this.http
      .post<LoginResponse>('/api/auth/login', { email, password })
      .pipe(
        tap((res) => {
          this._state.set({
            token: res.accessToken,
            role: res.role,
            linkedId: res.linkedId,
          });
          this.persist();
        }),
        catchError(() => of(null)),
      );
  }

  logout(): void {
    this._state.set(INITIAL_STATE);
    localStorage.removeItem(this.storageKey);
  }

  getToken(): string | null {
    return this._state().token;
  }

  private persist(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this._state()));
    } catch {
      // Storage may be unavailable (SSR or quota); ignore.
    }
  }

  private loadFromStorage(): AuthState {
    try {
      const raw =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem(this.storageKey)
          : null;
      if (!raw) return INITIAL_STATE;
      const parsed = JSON.parse(raw) as AuthState;
      if (!parsed.token) return INITIAL_STATE;
      return parsed;
    } catch {
      return INITIAL_STATE;
    }
  }
}