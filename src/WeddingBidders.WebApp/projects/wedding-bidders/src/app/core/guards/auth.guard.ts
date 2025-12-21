import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService, ACCESS_TOKEN_KEY } from '../services/local-storage.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private navigationService: NavigationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const accessToken = this.localStorageService.get<string>(ACCESS_TOKEN_KEY);

    if (accessToken) {
      return true;
    }

    this.navigationService.lastPath = state.url;
    this.navigationService.redirectToLogin();
    return false;
  }
}
