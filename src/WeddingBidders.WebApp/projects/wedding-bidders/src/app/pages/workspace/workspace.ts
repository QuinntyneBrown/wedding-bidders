import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, ProfileService } from '../../core/services';
import { User, Profile } from '../../core/models';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './workspace.html',
  styleUrls: ['./workspace.scss']
})
export class Workspace implements OnInit {
  currentUser$!: Observable<User | null>;
  currentProfile$!: Observable<Profile | null>;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
    this.currentProfile$ = this.profileService.currentProfile$;

    this.authService.getCurrentUser().subscribe({
      next: (user) => this.authService.setCurrentUser(user)
    });

    this.profileService.getCurrent().subscribe({
      next: (profile) => this.profileService.setCurrentProfile(profile)
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
