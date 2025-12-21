import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LocalStorageService, ACCESS_TOKEN_KEY, CURRENT_USER_KEY } from './local-storage.service';
import { environment } from '../../../environments/environment';
import { User, AuthenticateResponse } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let localStorageService: LocalStorageService;

  const mockUser: User = {
    userId: '123',
    username: 'test@test.com',
    roles: ['Member']
  };

  const mockAuthResponse: AuthenticateResponse = {
    userId: '123',
    token: 'jwt-token',
    refreshToken: 'refresh-token'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, LocalStorageService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should authenticate user and store token', () => {
      const credentials = { username: 'test@test.com', password: 'password123' };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
        expect(localStorageService.get(ACCESS_TOKEN_KEY)).toBe('jwt-token');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user/token`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockAuthResponse);
    });
  });

  describe('logout', () => {
    it('should clear stored tokens and user', () => {
      localStorageService.put(ACCESS_TOKEN_KEY, 'token');
      localStorageService.put(CURRENT_USER_KEY, mockUser);

      service.logout();

      expect(localStorageService.get(ACCESS_TOKEN_KEY)).toBeNull();
      expect(localStorageService.get(CURRENT_USER_KEY)).toBeNull();
    });

    it('should emit null for currentUser', done => {
      localStorageService.put(ACCESS_TOKEN_KEY, 'token');

      service.logout();

      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  describe('setCurrentUser', () => {
    it('should store user and emit on currentUser$', done => {
      service.setCurrentUser(mockUser);

      service.currentUser$.subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(localStorageService.get(CURRENT_USER_KEY)).toEqual(mockUser);
        done();
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user from API', () => {
      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user/current`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      localStorageService.put(ACCESS_TOKEN_KEY, 'token');

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no access token', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getStoredUser', () => {
    it('should return stored user', () => {
      localStorageService.put(CURRENT_USER_KEY, mockUser);

      expect(service.getStoredUser()).toEqual(mockUser);
    });

    it('should return null when no user stored', () => {
      expect(service.getStoredUser()).toBeNull();
    });
  });
});
