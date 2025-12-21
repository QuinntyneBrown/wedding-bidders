import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account, Billing } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly baseUrl = `${environment.apiUrl}/account`;

  constructor(private http: HttpClient) {}

  getCurrentAccount(): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/current`);
  }

  getBilling(): Observable<Billing> {
    return this.http.get<Billing>(`${this.baseUrl}/billing`);
  }
}
