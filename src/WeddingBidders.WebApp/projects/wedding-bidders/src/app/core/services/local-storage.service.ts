import { Injectable } from '@angular/core';

export const ACCESS_TOKEN_KEY = 'weddingbidders:accessToken';
export const LOGIN_CREDENTIALS_KEY = 'weddingbidders:loginCredentials';
export const CURRENT_USER_KEY = 'weddingbidders:currentUser';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  }

  put<T>(key: string, value: T): void {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
