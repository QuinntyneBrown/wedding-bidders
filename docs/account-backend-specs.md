# Account Feature - Backend Specification

## Overview

The Account feature manages user accounts, which contain user credentials, billing information, and profile associations. Accounts represent the authentication and subscription layer of the system.

## Technology Stack

- **.NET 8.0** - Target framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core 8.0** - ORM for data access
- **MediatR 12.2.0** - CQRS pattern implementation
- **JWT Authentication** - Token-based authentication
- **Serilog** - Structured logging

## Architecture Pattern

This feature uses **Vertical Slice Architecture** with:
- **CQRS (Command Query Responsibility Segregation)** via MediatR
- **Feature-based organization** (all related code in Features/Accounts)
- **Minimal API-style controllers** acting as thin HTTP endpoints
- **Request/Handler pattern** for business logic

## Data Model

### Account Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| AccountId | Guid | Primary key | Auto-generated |
| Firstname | string | User's first name | Required |
| Lastname | string | User's last name | Required |
| Email | string | User's email (login) | Required, Unique |
| AccountType | AccountType | Type of account | Enum, Required |
| UserId | Guid? | Foreign key to User | Nullable, FK |
| DefaultProfileId | Guid? | Default profile ID | Nullable |
| Profiles | ICollection<Profile> | Associated profiles | Navigation property |
| User | User | Navigation property | Nullable |
| AccountStatus | AccountStatus | Subscription status | Enum |
| IsDeleted | bool | Soft delete flag | Default false |
| CreatedDate | DateTime | Creation timestamp | Auto-generated |
| LastModifiedDate | DateTime? | Last modification timestamp | Nullable |

### AccountType Enum

| Value | Name | Description |
|-------|------|-------------|
| 0 | Bidder | Vendor/Service provider account |
| 1 | Customer | Wedding customer account |
| 2 | Internal | System/Admin account |

### AccountStatus Enum

| Value | Name | Description |
|-------|------|-------------|
| 0 | Free | Free tier (limited features) |
| 1 | Paid | Active paid subscription |
| 2 | Unpaid | Subscription lapsed |

## DTOs

### AccountDto

```csharp
public class AccountDto
{
    public Guid AccountId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public AccountType AccountType { get; set; }
    public AccountStatus AccountStatus { get; set; }
    public Guid? DefaultProfileId { get; set; }
}
```

### BillingDto

```csharp
public class BillingDto
{
    public AccountStatus AccountStatus { get; set; }
    public DateTime? SubscriptionExpiry { get; set; }
    public decimal? LastPaymentAmount { get; set; }
    public DateTime? LastPaymentDate { get; set; }
}
```

## API Endpoints

### GET /api/account/current

**Description:** Retrieves the current authenticated user's account information.

**Authorization:** Requires authentication

**Response:**

```json
{
  "accountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "accountType": 1,
  "accountStatus": 1,
  "defaultProfileId": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

**Acceptance Criteria:**
- AC1: Returns account for authenticated user
- AC2: Includes account type and status
- AC3: Returns 401 if not authenticated

**Implementation:**

**Controller** ([AccountController.cs](../src/WeddingBidders.Api/Controllers/AccountController.cs)):
```csharp
[HttpGet("current")]
[Authorize]
public async Task<ActionResult<AccountDto>> GetCurrentAccount()
{
    var account = await _mediator.Send(new GetCurrentAccountRequest());
    if (account == null)
    {
        return NotFound(new { message = "Account not found" });
    }
    return Ok(account);
}
```

**Request/Handler** ([GetCurrentAccount.cs](../src/WeddingBidders.Api/Features/Accounts/GetCurrentAccount.cs)):
```csharp
public class GetCurrentAccountRequest : IRequest<AccountDto?> { }

public class GetCurrentAccountHandler : IRequestHandler<GetCurrentAccountRequest, AccountDto?>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public async Task<AccountDto?> Handle(GetCurrentAccountRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
            return null;

        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Email.ToLower() == username.ToLower(), cancellationToken);

        return account?.ToDto();
    }
}
```

---

### GET /api/account/billing

**Description:** Retrieves billing information for the current user's account.

**Authorization:** Requires authentication

**Response:**

```json
{
  "accountStatus": 1,
  "subscriptionExpiry": "2025-01-15T00:00:00",
  "lastPaymentAmount": 180.00,
  "lastPaymentDate": "2024-01-15T00:00:00"
}
```

**Acceptance Criteria:**
- AC1: Returns billing status for authenticated user
- AC2: Includes subscription expiry date if applicable
- AC3: Includes last payment details if available

**Implementation:**

**Controller** ([AccountController.cs](../src/WeddingBidders.Api/Controllers/AccountController.cs)):
```csharp
[HttpGet("billing")]
[Authorize]
public async Task<ActionResult<BillingDto>> GetBilling()
{
    var billing = await _mediator.Send(new GetBillingRequest());
    if (billing == null)
    {
        return NotFound(new { message = "Billing information not found" });
    }
    return Ok(billing);
}
```

## Entity Configuration

**Location:** [Account.cs](../src/WeddingBidders.Core/Model/AccountAggregate/Account.cs)

```csharp
public class Account
{
    public Guid AccountId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public AccountType AccountType { get; set; }
    public AccountStatus AccountStatus { get; set; }
    public Guid? UserId { get; set; }
    public Guid? DefaultProfileId { get; set; }
    public User? User { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
}
```

## Relationships

```
Account (1) -----> (N) Profile
Account (N) -----> (1) User
Account (1) <---- (N) Subscription
Account (1) <---- (N) Payment
```

## Account Hierarchy

```
User (Authentication)
    |
    v
Account (Identity & Billing)
    |
    v
Profile (Business Identity)
    |
    +---> Customer
    +---> Bidder
```

## Service Layer

This feature uses **MediatR** for implementing the CQRS pattern. Business logic is handled by request handlers rather than traditional service classes.

### Request/Handler Pattern

**Requests** (located in [Features/Accounts](../src/WeddingBidders.Api/Features/Accounts/)):
- `GetCurrentAccountRequest` - Query to retrieve current user's account
- `GetBillingRequest` - Query to retrieve billing information

**Handlers**:
- `GetCurrentAccountHandler` - Handles account retrieval logic
- `GetBillingHandler` - Handles billing retrieval logic

### Extension Methods

```csharp
public static class AccountExtensions
{
    public static AccountDto ToDto(this Account account)
    {
        return new AccountDto
        {
            AccountId = account.AccountId,
            Firstname = account.Firstname,
            Lastname = account.Lastname,
            Email = account.Email,
            AccountType = account.AccountType,
            AccountStatus = account.AccountStatus,
            DefaultProfileId = account.DefaultProfileId
        };
    }
}
```

## Account Status Workflow

```
New Registration
       |
       v
AccountStatus = Free
       |
       v
User pays subscription
       |
       v
AccountStatus = Paid
       |
       v
Subscription expires
       |
       v
AccountStatus = Unpaid
```

## Business Rules

1. **One User Per Account:** Each account is linked to exactly one User for authentication
2. **Multiple Profiles:** Accounts can theoretically have multiple profiles
3. **Default Profile:** DefaultProfileId indicates the primary/active profile
4. **Email as Identifier:** Email is used for login and must be unique
5. **Account Type Immutable:** Account type is set at registration
6. **Status Updates:** AccountStatus changes based on subscription payments

## Related Entities

### User Entity

```csharp
public class User
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;  // Hashed
    public ICollection<Account> Accounts { get; set; } = new List<Account>();
    public ICollection<Role> Roles { get; set; } = new List<Role>();
}
```

### Subscription Entity

```csharp
public class Subscription
{
    public Guid SubscriptionId { get; set; }
    public Guid AccountId { get; set; }
    public Guid PlanId { get; set; }
    public DateTime EffectiveDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
```

### Payment Entity

```csharp
public class Payment
{
    public Guid PaymentId { get; set; }
    public Guid AccountId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
}
```

## Security Considerations

1. **Password Storage:** Passwords are encrypted in the User entity
2. **Email Privacy:** Account email is only visible to the account owner and admins
3. **Billing Access:** Only account owners can view their billing information

## Dependencies

### NuGet Packages
- **MediatR (12.2.0)** - CQRS pattern implementation
- **Microsoft.EntityFrameworkCore (8.0.0)** - ORM for data persistence
- **Microsoft.AspNetCore.Authentication.JwtBearer (8.0.0)** - JWT authentication
- **FluentValidation.AspNetCore (11.3.0)** - Request validation
- **Serilog.AspNetCore (8.0.0)** - Structured logging

### Project References
- **WeddingBidders.Core** - Domain entities and interfaces
- **WeddingBidders.Infrastructure** - Data access implementation

### Key Services
- **IWeddingBiddersContext** - Database context interface
- **IHttpContextAccessor** - Access to HTTP context for user identity
- **IMediator** - MediatR interface for sending requests

## .NET 8 Features Used

### Modern C# Features
- **Nullable Reference Types** - Enabled via `<Nullable>enable</Nullable>`
- **Implicit Usings** - Enabled via `<ImplicitUsings>enable</ImplicitUsings>`
- **Collection Expressions** - Using `new List<T>()` initialization
- **String Initialization** - Using `string.Empty` for default values

### ASP.NET Core Features
- **Minimal API Style** - Controllers as thin HTTP endpoints
- **Native Dependency Injection** - Using `builder.Services.Add*`
- **Top-level Statements** - Program.cs without Main method
- **Global Using Directives** - Implicit common namespace imports

### Authentication & Authorization
- **JWT Bearer Authentication** - Built-in ASP.NET Core authentication
- **[Authorize] Attribute** - Declarative authorization on endpoints
- **Claims-based Identity** - User identity from JWT claims

### Logging
- **Serilog Integration** - Structured logging with context enrichment
- **Request Logging Middleware** - Automatic HTTP request logging with user tracking

## Project Structure

```
WeddingBidders.Api/
├── Controllers/
│   └── AccountController.cs          # HTTP endpoints
├── Features/
│   └── Accounts/
│       ├── GetCurrentAccount.cs      # Query handler
│       ├── GetBilling.cs             # Query handler
│       └── AccountDto.cs             # DTOs and extensions
├── Authorization/                    # Authorization handlers
├── Behaviours/                       # MediatR pipeline behaviors
└── Program.cs                        # Application startup

WeddingBidders.Core/
└── Model/
    └── AccountAggregate/
        ├── Account.cs                # Domain entity
        └── Enums/
            ├── AccountType.cs
            └── AccountStatus.cs
```
