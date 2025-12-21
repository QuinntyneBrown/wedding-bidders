import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { AuthService, NavigationService, LocalStorageService } from '../../core/services';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: jest.Mocked<AuthService>;
  let navigationServiceMock: jest.Mocked<NavigationService>;
  let localStorageServiceMock: jest.Mocked<LocalStorageService>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
      getCurrentUser: jest.fn(),
      setCurrentUser: jest.fn()
    } as any;

    navigationServiceMock = {
      redirectPreLogin: jest.fn()
    } as any;

    localStorageServiceMock = {
      get: jest.fn(),
      put: jest.fn(),
      remove: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        Login,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NavigationService, useValue: navigationServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have valid form when fields are filled correctly', () => {
    component.loginForm.patchValue({
      username: 'test@test.com',
      password: 'password123'
    });

    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should require valid email', () => {
    component.loginForm.patchValue({
      username: 'invalid-email',
      password: 'password123'
    });

    expect(component.loginForm.get('username')?.hasError('email')).toBeTruthy();
  });

  it('should call authService.login on submit', fakeAsync(() => {
    const mockUser = { userId: '123', username: 'test@test.com', roles: [] };
    authServiceMock.login.mockReturnValue(of({ userId: '123', token: 'token', refreshToken: 'refresh' }));
    authServiceMock.getCurrentUser.mockReturnValue(of(mockUser));

    component.loginForm.patchValue({
      username: 'test@test.com',
      password: 'password123'
    });

    component.onSubmit();
    tick();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      username: 'test@test.com',
      password: 'password123'
    });
    expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
    expect(authServiceMock.setCurrentUser).toHaveBeenCalledWith(mockUser);
    expect(navigationServiceMock.redirectPreLogin).toHaveBeenCalled();
  }));

  it('should show error message on failed login', fakeAsync(() => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));

    component.loginForm.patchValue({
      username: 'test@test.com',
      password: 'wrongpassword'
    });

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.isLoading).toBeFalsy();
  }));

  it('should save credentials when rememberMe is checked', fakeAsync(() => {
    authServiceMock.login.mockReturnValue(of({ userId: '123', token: 'token', refreshToken: 'refresh' }));
    authServiceMock.getCurrentUser.mockReturnValue(of({ userId: '123', username: 'test@test.com', roles: [] }));

    component.loginForm.patchValue({
      username: 'test@test.com',
      password: 'password123',
      rememberMe: true
    });

    component.onSubmit();
    tick();

    expect(localStorageServiceMock.put).toHaveBeenCalled();
  }));
});
