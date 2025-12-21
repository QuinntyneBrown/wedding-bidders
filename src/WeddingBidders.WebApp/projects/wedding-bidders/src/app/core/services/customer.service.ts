import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer, RegisterCustomerRequest, RegisterCustomerResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly baseUrl = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  getCurrentCustomer(): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/current`);
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/getAll`);
  }

  registerCustomer(request: RegisterCustomerRequest): Observable<RegisterCustomerResponse> {
    return this.http.post<RegisterCustomerResponse>(`${this.baseUrl}/add`, request);
  }
}
