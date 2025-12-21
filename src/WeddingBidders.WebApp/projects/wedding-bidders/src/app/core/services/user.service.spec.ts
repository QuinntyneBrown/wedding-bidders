import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { User } from '../models';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    userId: 'user-123',
    username: 'johndoe',
    email: 'john@example.com',
    firstname: 'John',
    lastname: 'Doe'
  };

  const mockUsers: User[] = [
    mockUser,
    {
      userId: 'user-456',
      username: 'janedoe',
      email: 'jane@example.com',
      firstname: 'Jane',
      lastname: 'Doe'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCurrent', () => {
    it('should return the current user', () => {
      service.getCurrent().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user/current`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('exists', () => {
    it('should return true if user exists', () => {
      const username = 'johndoe';

      service.exists(username).subscribe(exists => {
        expect(exists).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user/exists/${username}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false if user does not exist', () => {
      const username = 'nonexistent';

      service.exists(username).subscribe(exists => {
        expect(exists).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user/exists/${username}`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });

    it('should encode special characters in username', () => {
      const username = 'user@test.com';

      service.exists(username).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/user/exists/user%40test.com`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });
  });

  describe('getAll', () => {
    it('should return all users', () => {
      const usersResponse = { users: mockUsers };

      service.getAll().subscribe(response => {
        expect(response.users).toEqual(mockUsers);
        expect(response.users.length).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user`);
      expect(req.request.method).toBe('GET');
      req.flush(usersResponse);
    });
  });

  describe('getById', () => {
    it('should return user by id', () => {
      const userId = 'user-123';

      service.getById(userId).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });
});
