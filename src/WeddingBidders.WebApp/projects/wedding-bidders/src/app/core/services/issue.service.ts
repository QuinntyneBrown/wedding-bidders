import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Issue, CreateIssueRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly baseUrl = `${environment.apiUrl}/issue`;

  constructor(private http: HttpClient) {}

  getAllIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.baseUrl}/getAll`);
  }

  createIssue(request: CreateIssueRequest): Observable<Issue> {
    return this.http.post<Issue>(`${this.baseUrl}/add`, request);
  }
}
