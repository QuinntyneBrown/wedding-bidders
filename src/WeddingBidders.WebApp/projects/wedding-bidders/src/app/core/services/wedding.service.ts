import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Wedding, CreateWeddingRequest, UpdateWeddingRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {
  private readonly baseUrl = `${environment.apiUrl}/wedding`;

  constructor(private http: HttpClient) {}

  getAllWeddings(): Observable<Wedding[]> {
    return this.http.get<Wedding[]>(`${this.baseUrl}/getAll`);
  }

  getWeddingById(id: string): Observable<Wedding> {
    return this.http.get<Wedding>(`${this.baseUrl}/getById`, { params: { id } });
  }

  getWeddingsByCustomerId(id: string): Observable<Wedding[]> {
    return this.http.get<Wedding[]>(`${this.baseUrl}/getAllByCustomerId`, { params: { id } });
  }

  getWeddingsByCurrentProfile(): Observable<Wedding[]> {
    return this.http.get<Wedding[]>(`${this.baseUrl}/getAllByCurrentProfile`);
  }

  createWedding(request: CreateWeddingRequest): Observable<Wedding> {
    return this.http.post<Wedding>(`${this.baseUrl}/add`, request);
  }

  updateWedding(request: UpdateWeddingRequest): Observable<Wedding> {
    return this.http.put<Wedding>(`${this.baseUrl}/update`, request);
  }

  deleteWedding(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove`, { params: { id } });
  }
}
