import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getCurrent(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/current`);
  }

  exists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/${encodeURIComponent(username)}`);
  }

  getAll(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(this.baseUrl);
  }

  getById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }
}
