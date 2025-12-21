# Identity Software Requirements Specification - Frontend (Coop.App)

## Document Information

- **Project:** {project} - Angular Frontend
- **Version:** 
- **Date:** 
- **Status:** 

---

## Table of Contents

1. [Authentication Requirements](#authentication-requirements)
2. [Token Management Requirements](#token-management-requirements)
3. [Route Protection & Navigation Requirements](#route-protection--navigation-requirements)
4. [User Registration Requirements](#user-registration-requirements)
5. [User Invitation Requirements](#user-invitation-requirements)
6. [Session Management Requirements](#session-management-requirements)
7. [Authorization & Access Control Requirements](#authorization--access-control-requirements)
8. [User Profile Management Requirements](#user-profile-management-requirements)
9. [Password Management Requirements](#password-management-requirements)
10. [User Interface Requirements](#user-interface-requirements)
11. [State Management Requirements](#state-management-requirements)
12. [Validation Requirements](#validation-requirements)

---

## 1. Authentication Requirements

### REQ-FE-AUTH-001: Login Form

**Requirement:** The system shall provide a reactive login form with username and password fields, validation, and remember me functionality.


**Acceptance Criteria:**
- [ ] Login form uses Angular Reactive Forms
- [ ] Username field is required
- [ ] Password field is required
- [ ] Remember Me checkbox is available
- [ ] Form validation prevents submission of invalid data
- [ ] Submit button emits login credentials event
- [ ] Form is visually accessible and user-friendly

**Form Model:**

```typescript
loginForm: FormGroup = new FormGroup({
  username: new FormControl(this.username, [Validators.required]),
  password: new FormControl(this.password, [Validators.required]),
  rememberMe: new FormControl(this.rememberMe, [])
});
```

**Form Fields:**

| Field | Type | Validation | Default |
|-------|------|------------|---------|
| username | string | Required | '' |
| password | string | Required | '' |
| rememberMe | boolean | None | false |

---

### REQ-FE-AUTH-002: Authentication Service

**Requirement:** The system shall provide a centralized authentication service that handles login, logout, and current user state management.

**Acceptance Criteria:**
- [ ] Service provides `login()` method accepting username and password
- [ ] Login method calls backend API endpoint `POST /api/user/token`
- [ ] Service provides `logout()` method to clear authentication state
- [ ] Service exposes `currentUser$` observable for reactive state access
- [ ] Current user state is maintained using `ReplaySubject`
- [ ] Service integrates with LocalStorageService for token persistence
- [ ] Service provides `tryToLogin()` method to restore session from storage

**Service Interface:**

```typescript
export class AuthService {
  currentUser$: Observable<User>;

  login(options: { username: string; password: string }): Observable<AuthenticateResponse>;
  logout(): void;
  tryToLogin(): Observable<User>;
  hasReadWritePrivileges$(aggregate: string): Observable<boolean>;
}
```

**Authentication Response Model:**

```typescript
interface AuthenticateResponse {
  userId: string;
  token: string;
  refreshToken: string;
}
```

---

### REQ-FE-AUTH-003: Login Page Component

**Requirement:** The system shall provide a login page that orchestrates the authentication flow, handles remember me functionality, and manages post-login navigation.

**Acceptance Criteria:**
- [ ] Login page loads saved credentials if "Remember Me" was previously checked
- [ ] Login page saves credentials to localStorage when "Remember Me" is checked
- [ ] Login page clears stored credentials when "Remember Me" is unchecked
- [ ] Successful login redirects user to workspace or saved path
- [ ] Failed login displays appropriate error message
- [ ] Login page is accessible without authentication

**Remember Me Implementation:**

```typescript
ngOnInit() {
  // Load saved credentials if Remember Me was checked
  const loginCredentials = this._localStorageService
    .get({ key: loginCredentialsKey }) as LoginCredentials;

  if (loginCredentials) {
    this.username = loginCredentials.username;
    this.password = loginCredentials.password;
    this.rememberMe = true;
  }
}

public handleLogin(credentials: LoginFormCredentials): void {
  // Save credentials if Remember Me is checked
  if (credentials.rememberMe) {
    this._localStorageService.put({
      key: loginCredentialsKey,
      value: { username: credentials.username, password: credentials.password }
    });
  } else {
    this._localStorageService.put({ key: loginCredentialsKey, value: null });
  }

  // Perform login
  this._authService.login(credentials).subscribe(
    response => this._navigationService.redirectPreLogin()
  );
}
```

---

### REQ-FE-AUTH-004: Logout Functionality

**Requirement:** The system shall provide logout functionality accessible from the workspace interface that clears all authentication state and redirects to public area.


**Acceptance Criteria:**
- [ ] Logout button is displayed in workspace navigation
- [ ] Clicking logout clears access token from storage
- [ ] Clicking logout clears current user state
- [ ] Logout redirects user to public landing page
- [ ] Logout is accessible from any workspace page

**Logout Implementation:**

```typescript
public logout(): void {
  this._authService.logout();
  this._navigationService.redirectToPublicDefault();
}
```

---

## 2. Token Management Requirements

### REQ-FE-TOKEN-001: Token Storage

**Requirement:** The system shall store JWT access tokens securely in browser localStorage with consistent key naming.

**Acceptance Criteria:**
- [ ] Access token is stored in localStorage
- [ ] Storage key is defined as constant: `{project}:accessTokenKey`
- [ ] Token is stored immediately after successful login
- [ ] Token is cleared on logout
- [ ] Token is cleared on 401 Unauthorized error
- [ ] LocalStorageService provides get/put methods for token access

**Storage Keys:**

| Key | Purpose | Value Format |
|-----|---------|--------------|
| {project}:accessTokenKey | JWT access token | string (JWT) |
| {project}:usernameKey | Current username | string |
| {project}:loginCredentialsKey | Saved login credentials | { username: string, password: string } |
| {project}:currentUserKey | Current user object | User |
| {project}:currentProfileKey | Current profile object | Profile |

**LocalStorage Service Interface:**

```typescript
export class LocalStorageService {
  get({ key }: { key: string }): any;
  put({ key, value }: { key: string; value: any }): void;
  updateLocalStorage(key: string, update: (value: any) => any): void;
}
```

---

### REQ-FE-TOKEN-002: HTTP Headers Interceptor

**Requirement:** The system shall automatically inject JWT access tokens into all HTTP request headers using an HTTP interceptor.

**Implementation:** [headers.interceptor.ts](src/Coop.App/src/app/@core/headers.interceptor.ts)

**Acceptance Criteria:**
- [ ] Interceptor retrieves token from localStorage
- [ ] Interceptor adds `Authorization` header with Bearer scheme
- [ ] Header format is: `Authorization: Bearer {token}`
- [ ] Interceptor applies to all outgoing HTTP requests
- [ ] Interceptor does not modify requests if no token is present
- [ ] Interceptor is registered in app module providers

**Interceptor Implementation:**

```typescript
export class HeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this._localStorageService.get({ key: accessTokenKey });

    if (accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
```

---

### REQ-FE-TOKEN-003: JWT Error Interceptor

**Requirement:** The system shall intercept HTTP 401 Unauthorized errors, clear invalid tokens, and redirect users to login page.


**Acceptance Criteria:**
- [ ] Interceptor detects 401 status codes in HTTP responses
- [ ] 401 errors trigger immediate token removal from localStorage
- [ ] 401 errors redirect user to login page
- [ ] Interceptor prevents further API calls with expired token
- [ ] Navigation service is used for consistent redirection
- [ ] Error is re-thrown after handling for component-level handling

**Error Handling Flow:**

```
API Request → Headers Interceptor (adds token) → API Response
                                                        ↓
                                                   401 Error?
                                                        ↓ Yes
                                         JWT Interceptor catches error
                                                        ↓
                                              Clear token storage
                                                        ↓
                                            Redirect to login page
```

**Implementation:**

```typescript
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this._localStorageService.put({ key: accessTokenKey, value: null });
          this._navigationService.redirectToLogin();
        }
        return throwError(error);
      })
    );
  }
}
```

---

## 3. Route Protection & Navigation Requirements

### REQ-FE-ROUTE-001: Authentication Guard

**Requirement:** The system shall implement a route guard that protects workspace routes from unauthorized access.

**Implementation:** [auth.guard.ts](src/Coop.App/src/app/@core/auth.guard.ts)

**Acceptance Criteria:**
- [ ] Guard implements Angular `CanActivate` interface
- [ ] Guard checks for access token in localStorage
- [ ] Guard allows navigation if token exists
- [ ] Guard prevents navigation and redirects to login if no token
- [ ] Guard saves attempted URL for post-login redirection
- [ ] Guard is applied to `/workspace` route tree

**Guard Implementation:**

```typescript
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const accessToken = this._localStorageService.get({ key: accessTokenKey });

    if (accessToken) {
      return true;
    }

    this._navigationService.lastPath = state.url;
    this._navigationService.redirectToLogin();
    return false;
  }
}
```

---

### REQ-FE-ROUTE-002: Route Configuration

**Requirement:** The system shall define protected and public routes with appropriate guards and lazy loading.

**Implementation:** [app-routing.module.ts](src/Coop.App/src/app/app-routing.module.ts)

**Acceptance Criteria:**
- [ ] `/workspace` route is protected with `AuthGuard`
- [ ] Login route is public and accessible without authentication
- [ ] Create account route is public
- [ ] Landing page and informational routes are public
- [ ] Protected routes lazy load workspace module
- [ ] Unauthenticated access to protected routes redirects to login

**Route Configuration:**

| Route | Guard | Lazy Loaded | Description |
|-------|-------|-------------|-------------|
| /login | None | No | Public login page |

---

### REQ-FE-ROUTE-003: Navigation Service

**Requirement:** The system shall provide a centralized navigation service for consistent routing and post-login redirection.

**Acceptance Criteria:**
- [ ] Service provides `redirectToLogin()` method
- [ ] Service provides `redirectPreLogin()` method for post-login navigation
- [ ] Service provides `redirectToPublicDefault()` for logout navigation
- [ ] Service tracks `lastPath` for return navigation after login
- [ ] Service uses Angular Router for navigation
- [ ] Login URL and default workspace path are configurable

**Navigation Methods:**

```typescript
export class NavigationService {
  lastPath: string = '/';
  loginUrl: string = '/login';
  defaultWorkspacePath: string = '/TBD';

  redirectToLogin(): void {
    this._router.navigate([this.loginUrl]);
  }

  redirectPreLogin(): void {
    const path = this.lastPath || this.defaultWorkspacePath;
    this._router.navigate([path]);
  }

  redirectToPublicDefault(): void {
    this._router.navigate(['/']);
  }
}
```

---

## 4. User Registration Requirements

### REQ-FE-REG-001: Create Account Form

**Requirement:** The system shall provide a comprehensive registration form with validation for creating new user accounts.

**Implementation:** [create-account-form.component.ts](src/Coop.App/src/app/create-account/create-account-form/create-account-form.component.ts)

**Acceptance Criteria:**
- [ ] Form includes invitation token field (required)
- [ ] Form includes first name field (required)
- [ ] Form includes last name field (required)
- [ ] Form includes email field (required, email format validation)
- [ ] Form includes password field (required)
- [ ] Form includes password confirmation field (required)
- [ ] Email field has async validation to check username uniqueness
- [ ] Form emits `CreateProfileRequest` on valid submission
- [ ] Form prevents submission if validation fails

**Form Fields:**

| Field | Type | Validation | Async Validation |
|-------|------|------------|------------------|
| invitationToken | string | Required | None |
| firstname | string | Required | None |
| lastname | string | Required | None |
| email | string | Required, Email format | Username exists check |
| password | string | Required | None |
| passwordConfirmation | string | Required | None |

**Create Profile Request Model:**

```typescript
interface CreateProfileRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  invitationToken: string;
  firstname: string;
  lastname: string;
  avatarDigitalAssetId?: string;
}
```

---

### REQ-FE-REG-002: Create Account Page

**Requirement:** The system shall provide a registration page that handles account creation and redirects to login on success.

**Implementation:** [create-account.component.ts](src/Coop.App/src/app/create-account/create-account.component.ts)

**Acceptance Criteria:**
- [ ] Page is accessible without authentication
- [ ] Page receives form data from create account form component
- [ ] Page calls ProfileService.create() with registration data
- [ ] Successful registration redirects to login page
- [ ] Failed registration displays error message
- [ ] Page displays user-friendly success/error feedback

**Account Creation Flow:**

```typescript
public handleCreateAccountFormSubmit(options: CreateProfileRequest): void {
  this._profileService.create({ request: options })
    .subscribe(
      response => {
        // Show success message
        this._navigationService.redirectToLogin();
      },
      error => {
        // Display error message
      }
    );
}
```

---

### REQ-FE-REG-003: Username Uniqueness Validation

**Requirement:** The system shall validate username uniqueness during registration using async validation.

**Implementation:** [username-exists-validator.ts](src/Coop.App/src/app/@core/username-exisits-validator.ts)

**Acceptance Criteria:**
- [ ] Validator is implemented as Angular async validator
- [ ] Validator calls backend API: `GET /api/user/exists/{username}`
- [ ] Validator debounces API calls by 300ms
- [ ] Validator returns `{ existingValue }` error if username exists
- [ ] Validator returns null if username is available
- [ ] Validator integrates with reactive form validation

**Async Validator Implementation:**

```typescript
export function usernameExistsValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.exists({ username: control.value }).pipe(
      debounceTime(300),
      map(exists => exists ? { existingValue: true } : null)
    );
  };
}
```

**Usage:**

```typescript
this.emailFormControl = new FormControl(
  this.email,
  [Validators.required, Validators.email],
  [usernameExistsValidator(this._userService)]
);
```

---

## 5. User Invitation Requirements

### REQ-FE-INV-001: Invitation Token Service

**Requirement:** The system shall provide a service for managing invitation tokens including CRUD operations.

**Acceptance Criteria:**
- [ ] Service provides `get()` method to list all invitation tokens
- [ ] Service provides `getById()` method to retrieve specific token
- [ ] Service provides `create()` method to create new invitation tokens
- [ ] Service provides `update()` method to modify tokens
- [ ] Service provides `remove()` method to delete tokens
- [ ] Service implements `IPagableService<InvitationToken>` interface
- [ ] Service calls backend API endpoints under `/api/invitationToken`

**Service Interface:**

```typescript
export class InvitationTokenService implements IPagableService<InvitationToken> {
  get(): Observable<InvitationToken[]>;
  getById(options: { invitationTokenId: string }): Observable<InvitationToken>;
  create(options: { request: CreateInvitationTokenRequest }): Observable<CreateInvitationTokenResponse>;
  update(options: { request: UpdateInvitationTokenRequest }): Observable<UpdateInvitationTokenResponse>;
  remove(options: { invitationTokenId: string }): Observable<RemoveInvitationTokenResponse>;
}
```

**Invitation Token Model:**

```typescript
interface InvitationToken {
  invitationTokenId: string;
  value: string;
  expiry?: Date;
  type: InvitationTokenType;
}
```

---

### REQ-FE-INV-002: Invitation Token State Management

**Requirement:** The system shall manage invitation token state using NgRx Component Store.

**Acceptance Criteria:**
- [ ] Store maintains list of invitation tokens
- [ ] Store maintains selected invitation token
- [ ] Store provides effects for create, update, remove operations
- [ ] Store handles loading and error states
- [ ] Store exposes selectors for reactive state access
- [ ] Store integrates with InvitationTokenService

**Store State:**

```typescript
interface InvitationTokenState {
  invitationTokens: InvitationToken[];
  invitationToken?: InvitationToken;
  loading?: boolean;
  error?: any;
}
```

---

## 6. Session Management Requirements

### REQ-FE-SESS-001: Current User Initialization

**Requirement:** The system shall attempt to restore user session from stored tokens on application startup.

**Acceptance Criteria:**
- [ ] App component calls `tryToInitializeCurrentUser()` on initialization
- [ ] Method retrieves stored access token from localStorage
- [ ] Method calls backend to fetch current user if token exists
- [ ] Method combines user and profile data
- [ ] Method initializes theme settings
- [ ] Failed initialization clears invalid tokens
- [ ] Current user observable is available app-wide

**Session Initialization:**

```typescript
ngOnInit() {
  this.tryToInitializeCurrentUser();
}

private tryToInitializeCurrentUser(): void {
  const accessToken = this._localStorageService.get({ key: accessTokenKey });

  if (accessToken) {
    forkJoin({
      user: this._userService.getCurrent(),
      profile: this._profileService.getCurrent()
    }).subscribe(
      ({ user, profile }) => {
        this._authService.setCurrentUser(user);
        this._profileService.setCurrentProfile(profile);
        this.initializeTheme();
      },
      error => {
        this._localStorageService.put({ key: accessTokenKey, value: null });
      }
    );
  }
}
```

---

### REQ-FE-SESS-002: Auto-Logout on Token Expiration

**Requirement:** The system shall automatically log out users when their JWT token expires or becomes invalid.

**Acceptance Criteria:**
- [ ] System detects 401 Unauthorized responses from API
- [ ] 401 errors trigger immediate token clearance
- [ ] User is redirected to login page
- [ ] Current user state is cleared
- [ ] User receives appropriate feedback about session expiration
- [ ] Attempted URL is saved for post-login redirection

---

## 7. Authorization & Access Control Requirements

### REQ-FE-AUTHZ-001: User Model with Roles

**Requirement:** The system shall maintain a user model that includes role and privilege information.

**Acceptance Criteria:**
- [ ] User model includes userId property
- [ ] User model includes username property
- [ ] User model includes roles collection
- [ ] User model includes defaultProfileId property
- [ ] Roles include associated privileges
- [ ] Model supports serialization from API responses

**User Model:**

```typescript
interface User {
  userId: string;
  username: string;
  roles: Role[];
  defaultProfileId: string;
}
```

---

### REQ-FE-AUTHZ-002: Role and Privilege Models

**Requirement:** The system shall define role and privilege models matching backend authorization structure.

**Acceptance Criteria:**
- [ ] Role model includes roleId, name, and privileges
- [ ] Privilege model includes privilegeId, roleId, aggregate, and accessRight
- [ ] AccessRight enum matches backend values (None, Read, Write, Create, Delete)
- [ ] Models support nested relationships
- [ ] Models are type-safe with TypeScript

**Role Model:**

```typescript
interface Role {
  roleId: string;
  name: string;
  privileges: Privilege[];
  aggregatePrivileges: AggregatePrivilege[];
}
```

**Privilege Model:**

```typescript
interface Privilege {
  privilegeId: string;
  roleId: string;
  aggregate: string;
  accessRight: AccessRight;
}
```

**Access Right Enum:**

```typescript
enum AccessRight {
  None = 0,
  Read = 1,
  Write = 2,
  Create = 3,
  Delete = 4
}
```

---

### REQ-FE-AUTHZ-003: Privilege Checking Service

**Requirement:** The system shall provide methods to check user privileges for specific aggregates and operations.

**Acceptance Criteria:**
- [ ] Service provides `hasReadWritePrivileges$()` observable method
- [ ] Method accepts aggregate name as parameter
- [ ] Method returns Observable<boolean> for reactive UI binding
- [ ] Method checks current user's roles for required privileges
- [ ] Method verifies both Read and Write access rights
- [ ] Method returns false if user lacks privileges

**Privilege Check Implementation:**

```typescript
export class AuthService {
  hasReadWritePrivileges$(aggregate: string): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => {
        if (!user) return false;

        return this._hasPrivilege(user, aggregate, AccessRight.Read) &&
               this._hasPrivilege(user, aggregate, AccessRight.Write);
      })
    );
  }

  private _hasPrivilege(user: User, aggregate: string, accessRight: AccessRight): boolean {
    return user.roles.some(role =>
      role.privileges.some(p =>
        p.aggregate === aggregate && p.accessRight === accessRight
      )
    );
  }
}
```

---

### REQ-FE-AUTHZ-004: Role-Based UI Rendering

**Requirement:** The system shall conditionally render UI elements based on user privileges using Angular directives.

**Acceptance Criteria:**
- [ ] Navigation menu items are conditionally displayed
- [ ] Menu visibility is controlled by `*ngIf` with privilege check observables
- [ ] Users only see features they have permission to access
- [ ] UI updates reactively when user privileges change
- [ ] No protected features are exposed to unauthorized users

**Privilege-Based UI Examples:**

```html
<!-- Messages menu item -->
<a *ngIf="hasReadWritePrivileges$(Aggregate.Message) | async"
   routerLink="/workspace/messages">
  Messages
</a>

<!-- Board Members menu item -->
<a *ngIf="hasReadWritePrivileges$(Aggregate.BoardMember) | async"
   routerLink="/workspace/board-members">
  Board Members
</a>

<!-- Users menu item (admin only) -->
<a *ngIf="hasReadWritePrivileges$(Aggregate.User) | async"
   routerLink="/workspace/users">
  Users
</a>

<!-- Roles menu item (admin only) -->
<a *ngIf="hasReadWritePrivileges$(Aggregate.Role) | async"
   routerLink="/workspace/roles">
  Roles
</a>
```

**Protected Features:**

| Feature | Aggregate | Access Rights Required |
|---------|-----------|------------------------|
| Messages | Message | Read + Write |
| Board Members | BoardMember | Read + Write |
| By Laws | ByLaw | Read + Write |
| Maintenance Requests | MaintenanceRequest | Read + Write |
| Members | Member | Read + Write |
| Notices | Notice | Read + Write |
| Reports | Report | Read + Write |
| Staff Members | StaffMember | Read + Write |
| Users | User | Read + Write |
| Roles | Role | Read + Write |
| Settings | Theme | Read + Write |
| Content | JsonContent | Read + Write |

---

### REQ-FE-AUTHZ-005: Privilege Management Service

**Requirement:** The system shall provide a service for managing privileges including CRUD operations.

**Acceptance Criteria:**
- [ ] Service provides methods for privilege CRUD operations
- [ ] Service calls backend API endpoints under `/api/privilege`
- [ ] Service supports privilege creation for roles
- [ ] Service supports privilege modification
- [ ] Service supports privilege deletion
- [ ] Service integrates with privilege store for state management

---

### REQ-FE-AUTHZ-006: Privilege State Management

**Requirement:** The system shall manage privilege state.

**Acceptance Criteria:**
- [ ] Store maintains privilege collection
- [ ] Store provides effects for create, update, remove operations
- [ ] Store handles loading and error states
- [ ] Store exposes selectors for reactive access
- [ ] Store integrates with PrivilegeService

---

## 8. User Profile Management Requirements

### REQ-FE-PROFILE-001: Profile Model

**Requirement:** The system shall define a comprehensive profile model containing user personal information and relationships.

**Acceptance Criteria:**
- [ ] Profile model includes profileId
- [ ] Profile model includes userId
- [ ] Profile model includes firstname and lastname
- [ ] Profile model includes avatarDigitalAssetId
- [ ] Profile model includes phoneNumber
- [ ] Profile model includes address
- [ ] Profile model includes messages collection
- [ ] Model supports serialization from API

**Profile Model:**

```typescript
interface Profile {
  profileId: string;
  userId: string;
  firstname: string;
  lastname: string;
  avatarDigitalAssetId?: string;
  phoneNumber?: string;
  address?: Address;
  messages?: Message[];
}
```

---

### REQ-FE-PROFILE-002: Profile Service

**Requirement:** The system shall provide a service for profile management including retrieval, creation, and updates.

**Acceptance Criteria:**
- [ ] Service provides `getCurrent()` method for authenticated user's profile
- [ ] Service provides `get()` method for all profiles
- [ ] Service provides `getById()` method for specific profile
- [ ] Service provides `create()` method for registration
- [ ] Service provides `update()` method for profile modifications
- [ ] Service provides `updateAvatar()` method for avatar changes
- [ ] Service calls backend API endpoints under `/api/profile`

**Service Interface:**

```typescript
export class ProfileService {
  getCurrent(): Observable<Profile>;
  get(): Observable<Profile[]>;
  getById(options: { profileId: string }): Observable<Profile>;
  create(options: { request: CreateProfileRequest }): Observable<CreateProfileResponse>;
  update(options: { request: UpdateProfileRequest }): Observable<UpdateProfileResponse>;
  updateAvatar(options: { profileId: string, digitalAssetId: string }): Observable<UpdateProfileAvatarResponse>;
}
```

---

### REQ-FE-PROFILE-003: Profile Component

**Requirement:** The system shall provide a profile component for viewing and editing user profile information.

**Acceptance Criteria:**
- [ ] Component displays current user's profile information
- [ ] Component supports avatar upload and update
- [ ] Component displays user's maintenance requests
- [ ] Component displays user's notices
- [ ] Component displays user's bylaws
- [ ] Component displays user's reports
- [ ] Component integrates with AuthService for current user

**Profile Component Features:**

```typescript
export class ProfileComponent implements OnInit {
  public profile$: Observable<Profile>;
  public maintenanceRequests$: Observable<MaintenanceRequest[]>;
  public notices$: Observable<Notice[]>;
  public bylaws$: Observable<ByLaw[]>;

  ngOnInit() {
    this.profile$ = this._profileService.getCurrent();
  }

  public handleAvatarChange(digitalAssetId: string): void {
    this._profileService.updateAvatar({
      profileId: this.profileId,
      digitalAssetId
    }).subscribe();
  }
}
```

---

### REQ-FE-PROFILE-004: Profile State Management

**Requirement:** The system shall manage profile state using NgRx Component Store.

**Acceptance Criteria:**
- [ ] Store maintains profile collection
- [ ] Store maintains current profile
- [ ] Store provides effects for create, update operations
- [ ] Store handles loading and error states
- [ ] Store exposes selectors for reactive access
- [ ] Store integrates with ProfileService

---

## 9. Password Management Requirements

### REQ-FE-PWD-001: Password Change Feature

**Requirement:** The system should provide password change functionality for authenticated users.


**Acceptance Criteria:**
- [ ] Password change form with old password, new password, and confirmation fields
- [ ] Form validation for password strength requirements
- [ ] API integration with backend password change endpoint
- [ ] Success/error feedback to user
- [ ] Automatic re-authentication after password change

---

### REQ-FE-PWD-002: Password Reset Feature

**Requirement:** The system should provide password reset functionality for users who forgot their passwords.

**Acceptance Criteria:**
- [ ] Password reset request form with email field
- [ ] Email verification and reset link generation
- [ ] Password reset form with new password and confirmation
- [ ] Integration with backend password reset endpoints
- [ ] Redirect to login after successful reset

---

## 10. User Interface Requirements

### REQ-FE-UI-001: User List Component

**Requirement:** The system shall provide a component to display a list of all users for administrative purposes.

**Acceptance Criteria:**
- [ ] Component displays all users in a table or list format
- [ ] Component is accessible only to users with User aggregate privileges
- [ ] Component supports navigation to user detail view
- [ ] Component integrates with UserService

---

### REQ-FE-UI-002: User Detail Component

**Requirement:** The system shall provide a component to view detailed information about a specific user.


**Acceptance Criteria:**
- [ ] Component displays user details including username, roles, and profiles
- [ ] Component is accessible only to authorized users
- [ ] Component supports navigation to edit mode
- [ ] Component integrates with UserService

---

### REQ-FE-UI-003: User Editor Component

**Requirement:** The system shall provide a component for creating and editing user information.

**Acceptance Criteria:**
- [ ] Component implements `ControlValueAccessor` for form integration
- [ ] Component implements `Validator` interface
- [ ] Component provides form fields for userId and name
- [ ] Component is reusable in different contexts
- [ ] Component integrates with Angular reactive forms

---

### REQ-FE-UI-004: Role Management Components

**Requirement:** The system shall provide components for viewing, creating, and editing roles.

**Acceptance Criteria:**
- [ ] Role list component displays all system roles
- [ ] Role detail component shows role information and associated privileges
- [ ] Role editor component allows creating/editing roles
- [ ] Components are accessible only to users with Role aggregate privileges
- [ ] Components integrate with RoleService

---

### REQ-FE-UI-005: Aggregate Privilege Component

**Requirement:** The system shall provide a component for displaying and managing aggregate-level privileges.

**Acceptance Criteria:**
- [ ] Component displays privilege information
- [ ] Component is reusable across different contexts
- [ ] Component integrates with privilege models
- [ ] Component supports privilege assignment/removal

---

## 11. State Management Requirements

### REQ-FE-STATE-001: User State Management

**Requirement:** The system shall manage user state using NgRx Component Store.

**Acceptance Criteria:**
- [ ] Store maintains users collection
- [ ] Store maintains selected user
- [ ] Store provides effects for create, update, remove operations
- [ ] Store handles loading and error states
- [ ] Store exposes selectors: `getUsers()`, `getUserById()`
- [ ] Store integrates with UserService

**Store State:**

```typescript
interface UserState {
  users?: User[];
  user?: User;
  loading?: boolean;
  error?: any;
}
```

**Store Effects:**

```typescript
export class UserStore extends ComponentStore<UserState> {
  createUser = this.effect<CreateUserRequest>((request$) =>
    request$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(request =>
        this._userService.create({ request }).pipe(
          tap(() => this.patchState({ loading: false })),
          catchError(error => {
            this.patchState({ error, loading: false });
            return EMPTY;
          })
        )
      )
    )
  );

  updateUser = this.effect<UpdateUserRequest>(...);
  removeUser = this.effect<RemoveUserRequest>(...);
}
```

---

### REQ-FE-STATE-002: Role State Management

**Requirement:** The system shall manage role state using NgRx Component Store.

**Acceptance Criteria:**
- [ ] Store maintains roles collection
- [ ] Store maintains selected role
- [ ] Store provides effects for CRUD operations
- [ ] Store handles loading and error states
- [ ] Store exposes selectors for reactive access
- [ ] Store integrates with RoleService

---

### REQ-FE-STATE-003: Reactive State Patterns

**Requirement:** The system shall use reactive programming patterns with RxJS for state management.

**Acceptance Criteria:**
- [ ] Observables are used for asynchronous data streams
- [ ] Subjects are used for state broadcasting
- [ ] Operators like map, switchMap, catchError are used appropriately
- [ ] Subscriptions are properly managed to prevent memory leaks
- [ ] Async pipe is used in templates for automatic subscription management

---

## 12. Validation Requirements

### REQ-FE-VAL-001: Login Form Validation

**Requirement:** The system shall validate login form inputs before submission.

**Acceptance Criteria:**
- [ ] Username field is required
- [ ] Password field is required
- [ ] Form submission is disabled when invalid
- [ ] Validation errors are displayed to user
- [ ] Validation is reactive (real-time feedback)

**Validation Rules:**

| Field | Validators | Error Messages |
|-------|-----------|----------------|
| username | Required | "Username is required" |
| password | Required | "Password is required" |

---

### REQ-FE-VAL-002: Registration Form Validation

**Requirement:** The system shall validate registration form inputs including async username uniqueness check.

**Acceptance Criteria:**
- [ ] All required fields are validated
- [ ] Email format is validated
- [ ] Username uniqueness is validated asynchronously
- [ ] Password confirmation matches password
- [ ] Validation errors are displayed clearly
- [ ] Form submission is disabled when invalid

**Validation Rules:**

| Field | Validators | Async Validators | Error Messages |
|-------|-----------|------------------|----------------|
| invitationToken | Required | None | "Invitation token is required" |
| firstname | Required | None | "First name is required" |
| lastname | Required | None | "Last name is required" |
| email | Required, Email | Username exists | "Valid email is required", "Username already exists" |
| password | Required | None | "Password is required" |
| passwordConfirmation | Required | None | "Password confirmation is required" |

---

### REQ-FE-VAL-003: Custom Validators

**Requirement:** The system shall provide custom validators for complex validation scenarios.

**Acceptance Criteria:**
- [ ] Custom validators follow Angular validator pattern
- [ ] Async validators return observables
- [ ] Validators are reusable across forms
- [ ] Validators integrate with Angular form validation system
- [ ] Validators provide meaningful error objects

---

## Appendix A: API Endpoints Used by Frontend

### Authentication Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | /api/user/token | Login | { username, password } | { token, refreshToken, userId } |
| GET | /api/user/current | Get current user | None | User |
| GET | /api/user/exists/{username} | Check username | None | boolean |

### User Management Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/user | Get all users |
| GET | /api/user/{id} | Get user by ID |
| POST | /api/user | Create user |
| PUT | /api/user | Update user |
| DELETE | /api/user/{id} | Delete user |

### Profile Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/profile/current | Get current profile |
| GET | /api/profile | Get all profiles |
| GET | /api/profile/{id} | Get profile by ID |
| POST | /api/profile | Create profile (registration) |
| PUT | /api/profile | Update profile |
| PUT | /api/profile/{id}/avatar | Update avatar |

### Role & Privilege Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/role | Get all roles |
| POST | /api/role | Create role |
| PUT | /api/role | Update role |
| DELETE | /api/role/{id} | Delete role |
| GET | /api/privilege | Get all privileges |
| POST | /api/privilege | Create privilege |
| PUT | /api/privilege | Update privilege |
| DELETE | /api/privilege/{id} | Delete privilege |

### Invitation Token Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/invitationToken | Get all tokens |
| GET | /api/invitationToken/{id} | Get token by ID |
| POST | /api/invitationToken | Create token |
| PUT | /api/invitationToken | Update token |
| DELETE | /api/invitationToken/{id} | Delete token |

---

## Appendix B: LocalStorage Keys

| Key | Purpose | Data Type |
|-----|---------|-----------|
| {project}:accessTokenKey | JWT access token | string |
| {project}:usernameKey | Current username | string |
| {project}:loginCredentialsKey | Saved login credentials (Remember Me) | { username: string, password: string } |
| {project}:currentUserKey | Current user object | User |
| {project}:currentProfileKey | Current profile object | Profile |

---

## Appendix C: Component Architecture

### Core Services

- **AuthService**: Authentication and authorization logic
- **LocalStorageService**: Browser storage management
- **NavigationService**: Routing and navigation
- **UserService**: User API client
- **ProfileService**: Profile API client
- **RoleService**: Role API client
- **PrivilegeService**: Privilege API client
- **InvitationTokenService**: Invitation token API client

### HTTP Interceptors

- **HeadersInterceptor**: Adds JWT token to requests
- **JwtInterceptor**: Handles 401 errors and auto-logout

### Route Guards

- **AuthGuard**: Protects workspace routes

### State Stores (NgRx Component Store)

- **UserStore**: User state management
- **ProfileStore**: Profile state management
- **RoleStore**: Role state management
- **PrivilegeStore**: Privilege state management
- **InvitationTokenStore**: Invitation token state management

### Feature Components

#### Authentication
- LoginComponent
- LoginFormComponent
- CreateAccountComponent
- CreateAccountFormComponent

#### User Management
- UserListComponent
- UserDetailComponent
- UserEditorComponent

#### Role Management
- RoleListComponent
- RoleDetailComponent
- RoleEditorComponent

#### Profile
- ProfileComponent

#### Shared
- SidenavComponent (logout button)
- AggregatePrivilegeComponent

---

## Appendix D: Security Considerations

### Implemented Security Controls

1. **Token-Based Authentication**
   - JWT tokens stored in localStorage
   - Tokens automatically included in API requests
   - Auto-logout on token expiration

2. **Route Protection**
   - AuthGuard prevents unauthorized access to workspace
   - Post-login redirection to attempted URL

3. **Role-Based Access Control**
   - UI elements hidden based on user privileges
   - Privilege checks using observables for reactivity
   - Granular access rights (Read, Write, Create, Delete)

4. **Input Validation**
   - Required field validation
   - Email format validation
   - Async username uniqueness validation
   - Password confirmation matching

5. **Error Handling**
   - 401 errors trigger logout and redirect
   - Invalid tokens are cleared automatically
   - User-friendly error messages



---

## Appendix E: TypeScript Models Summary

### Authentication Models

```typescript
interface AuthenticateResponse {
  userId: string;
  token: string;
  refreshToken: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}
```

### User Models

```typescript
interface User {
  userId: string;
  username: string;
  roles: Role[];
  defaultProfileId: string;
}

interface CreateUserRequest {
  username: string;
  password: string;
  roles: string[];
}

interface UpdateUserRequest {
  userId: string;
  username: string;
  roles: string[];
}
```

### Profile Models

```typescript
interface Profile {
  profileId: string;
  userId: string;
  firstname: string;
  lastname: string;
  avatarDigitalAssetId?: string;
  phoneNumber?: string;
  address?: Address;
  messages?: Message[];
}

interface CreateProfileRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  invitationToken: string;
  firstname: string;
  lastname: string;
  avatarDigitalAssetId?: string;
}
```

### Authorization Models

```typescript
interface Role {
  roleId: string;
  name: string;
  privileges: Privilege[];
  aggregatePrivileges: AggregatePrivilege[];
}

interface Privilege {
  privilegeId: string;
  roleId: string;
  aggregate: string;
  accessRight: AccessRight;
}

enum AccessRight {
  None = 0,
  Read = 1,
  Write = 2,
  Create = 3,
  Delete = 4
}
```

### Invitation Models

```typescript
interface InvitationToken {
  invitationTokenId: string;
  value: string;
  expiry?: Date;
  type: InvitationTokenType;
}

enum InvitationTokenType {
  TBD
}
```


