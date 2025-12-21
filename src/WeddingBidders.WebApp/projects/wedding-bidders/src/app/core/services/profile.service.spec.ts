import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { environment } from '../../../environments/environment';
import { Profile, CreateProfileRequest } from '../models';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  const mockProfile: Profile = {
    profileId: 'profile-123',
    userId: 'user-123',
    displayName: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: 'A wedding enthusiast'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCurrent', () => {
    it('should return the current profile', () => {
      service.getCurrent().subscribe(profile => {
        expect(profile).toEqual(mockProfile);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/profile/current`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });
  });

  describe('create', () => {
    it('should create a new profile', () => {
      const createRequest: CreateProfileRequest = {
        displayName: 'Jane Doe',
        bio: 'Planning my dream wedding'
      };

      const createResponse = {
        profileId: 'profile-456',
        userId: 'user-456'
      };

      service.create(createRequest).subscribe(response => {
        expect(response).toEqual(createResponse);
        expect(response.profileId).toBe('profile-456');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/profile`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(createResponse);
    });
  });

  describe('setCurrentProfile', () => {
    it('should emit the profile through currentProfile$ observable', (done) => {
      service.currentProfile$.subscribe(profile => {
        if (profile) {
          expect(profile).toEqual(mockProfile);
          done();
        }
      });

      service.setCurrentProfile(mockProfile);
    });

    it('should emit null when profile is cleared', (done) => {
      let emitCount = 0;
      service.currentProfile$.subscribe(profile => {
        emitCount++;
        if (emitCount === 2) {
          expect(profile).toBeNull();
          done();
        }
      });

      service.setCurrentProfile(mockProfile);
      service.setCurrentProfile(null);
    });
  });
});
