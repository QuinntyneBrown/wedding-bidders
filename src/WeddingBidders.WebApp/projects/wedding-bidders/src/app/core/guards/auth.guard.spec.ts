import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LocalStorageService, ACCESS_TOKEN_KEY } from '../services/local-storage.service';
import { NavigationService } from '../services/navigation.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let localStorageService: LocalStorageService;
  let navigationService: NavigationService;

  const mockActivatedRouteSnapshot = {} as any;
  const mockRouterStateSnapshot = { url: '/workspace' } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        LocalStorageService,
        NavigationService,
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    localStorageService = TestBed.inject(LocalStorageService);
    navigationService = TestBed.inject(NavigationService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow access when access token exists', () => {
    localStorageService.put(ACCESS_TOKEN_KEY, 'valid-token');

    const result = guard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    expect(result).toBe(true);
  });

  it('should deny access when no access token', () => {
    const redirectSpy = jest.spyOn(navigationService, 'redirectToLogin');

    const result = guard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    expect(result).toBe(false);
    expect(redirectSpy).toHaveBeenCalled();
  });

  it('should store last path before redirecting', () => {
    guard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    expect(navigationService.lastPath).toBe('/workspace');
  });
});
