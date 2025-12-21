import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bid, CreateBidRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private readonly baseUrl = `${environment.apiUrl}/bid`;

  constructor(private http: HttpClient) {}

  createBid(request: CreateBidRequest): Observable<Bid> {
    return this.http.post<Bid>(`${this.baseUrl}/add`, request);
  }

  getBidsByWeddingId(id: string): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.baseUrl}/getAllByWeddingId`, { params: { id } });
  }

  getBidsByBidderId(id: string): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.baseUrl}/getAllByCatererId`, { params: { id } });
  }

  getBidsByCurrentProfile(): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.baseUrl}/getAllByCurrentProfile`);
  }
}
