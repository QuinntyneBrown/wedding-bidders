import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  lastPath = '/';
  loginUrl = '/login';
  defaultWorkspacePath = '/workspace';

  constructor(private router: Router) {}

  redirectToLogin(): void {
    this.router.navigate([this.loginUrl]);
  }

  redirectPreLogin(): void {
    const path = this.lastPath !== this.loginUrl ? this.lastPath : this.defaultWorkspacePath;
    this.router.navigate([path]);
  }

  redirectToPublicDefault(): void {
    this.router.navigate(['/']);
  }

  redirectToWorkspace(): void {
    this.router.navigate([this.defaultWorkspacePath]);
  }
}
