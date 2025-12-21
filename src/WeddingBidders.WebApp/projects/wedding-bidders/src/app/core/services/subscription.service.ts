import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChargeSubscriptionRequest {
  token: string;
}

export interface ChargeSubscriptionResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly baseUrl = `${environment.apiUrl}/subscription`;

  constructor(private http: HttpClient) {}

  charge(request: ChargeSubscriptionRequest): Observable<ChargeSubscriptionResponse> {
    return this.http.post<ChargeSubscriptionResponse>(`${this.baseUrl}/charge`, request);
  }
}
