import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService, ProfileService, LocalStorageService, ACCESS_TOKEN_KEY } from './core/services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  title = 'Wedding Bidders';

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.tryToInitializeCurrentUser();
  }

  private tryToInitializeCurrentUser(): void {
    const accessToken = this.localStorageService.get<string>(ACCESS_TOKEN_KEY);

    if (accessToken) {
      forkJoin({
        user: this.authService.getCurrentUser(),
        profile: this.profileService.getCurrent()
      }).subscribe({
        next: ({ user, profile }) => {
          this.authService.setCurrentUser(user);
          this.profileService.setCurrentProfile(profile);
        },
        error: () => {
          this.localStorageService.remove(ACCESS_TOKEN_KEY);
        }
      });
    }
  }
}
