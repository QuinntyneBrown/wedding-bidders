import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthenticateRequest, AuthenticateResponse, ChangePasswordRequest } from '../models';
import { LocalStorageService, ACCESS_TOKEN_KEY, CURRENT_USER_KEY } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/user`;
  private currentUserSubject = new ReplaySubject<User | null>(1);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  login(credentials: AuthenticateRequest): Observable<AuthenticateResponse> {
    return this.http.post<AuthenticateResponse>(`${this.baseUrl}/token`, credentials).pipe(
      tap(response => {
        this.localStorageService.put(ACCESS_TOKEN_KEY, response.token);
      })
    );
  }

  logout(): void {
    this.localStorageService.remove(ACCESS_TOKEN_KEY);
    this.localStorageService.remove(CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      this.localStorageService.put(CURRENT_USER_KEY, user);
    }
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/current`);
  }

  changePassword(request: ChangePasswordRequest): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/change-password`, request);
  }

  isAuthenticated(): boolean {
    return !!this.localStorageService.get<string>(ACCESS_TOKEN_KEY);
  }

  getStoredUser(): User | null {
    return this.localStorageService.get<User>(CURRENT_USER_KEY);
  }
}
