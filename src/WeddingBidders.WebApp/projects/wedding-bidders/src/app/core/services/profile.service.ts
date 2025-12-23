import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile, CreateProfileRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly baseUrl = `${environment.apiUrl}/profile`;
  private currentProfileSubject = new ReplaySubject<Profile | null>(1);

  currentProfile$ = this.currentProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrent(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/current`);
  }

  getProfileById(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/getProfileById`, { params: { id } });
  }

  getByBidId(bidId: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/getByBidId`, { params: { bidId } });
  }

  getOthers(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseUrl}/getOthers`);
  }

  updateIsPersonalized(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/personalized`, {});
  }

  create(request: CreateProfileRequest): Observable<{ profileId: string; userId: string }> {
    return this.http.post<{ profileId: string; userId: string }>(this.baseUrl, request);
  }

  setCurrentProfile(profile: Profile | null): void {
    this.currentProfileSubject.next(profile);
  }
}
