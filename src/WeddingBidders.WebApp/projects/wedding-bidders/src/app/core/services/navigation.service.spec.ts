import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn().mockResolvedValue(true)
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default values', () => {
    expect(service.lastPath).toBe('/');
    expect(service.loginUrl).toBe('/login');
    expect(service.defaultWorkspacePath).toBe('/workspace');
  });

  describe('redirectToLogin', () => {
    it('should navigate to login page', () => {
      service.redirectToLogin();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('redirectPreLogin', () => {
    it('should navigate to lastPath if it is not login page', () => {
      service.lastPath = '/dashboard';
      service.redirectPreLogin();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to workspace if lastPath is login page', () => {
      service.lastPath = '/login';
      service.redirectPreLogin();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/workspace']);
    });
  });

  describe('redirectToPublicDefault', () => {
    it('should navigate to root path', () => {
      service.redirectToPublicDefault();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('redirectToWorkspace', () => {
    it('should navigate to workspace', () => {
      service.redirectToWorkspace();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/workspace']);
    });
  });
});
