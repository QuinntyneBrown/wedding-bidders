import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bidder, BidderTypeDto, RegisterBidderRequest, RegisterBidderResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BidderService {
  private readonly baseUrl = `${environment.apiUrl}/bidder`;

  constructor(private http: HttpClient) {}

  getCurrentBidder(): Observable<Bidder> {
    return this.http.get<Bidder>(`${this.baseUrl}/current`);
  }

  getAllBidders(): Observable<Bidder[]> {
    return this.http.get<Bidder[]>(`${this.baseUrl}/getAll`);
  }

  getBidderById(id: string): Observable<Bidder> {
    return this.http.get<Bidder>(`${this.baseUrl}/getById`, { params: { id } });
  }

  getBidderByBidId(bidId: string): Observable<Bidder> {
    return this.http.get<Bidder>(`${this.baseUrl}/GetByBidId`, { params: { bidId } });
  }

  getBidderByProfileId(profileId: string): Observable<Bidder> {
    return this.http.get<Bidder>(`${this.baseUrl}/GetByProfileId`, { params: { profileId } });
  }

  getBidderTypes(): Observable<BidderTypeDto[]> {
    return this.http.get<BidderTypeDto[]>(`${this.baseUrl}/gettypes`);
  }

  registerBidder(request: RegisterBidderRequest): Observable<RegisterBidderResponse> {
    return this.http.post<RegisterBidderResponse>(`${this.baseUrl}/add`, request);
  }
}
