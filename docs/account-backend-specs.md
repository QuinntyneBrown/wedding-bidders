# Account Feature - Backend Specification

## Overview

The Account feature manages user accounts, which contain user credentials, billing information, and profile associations. Accounts represent the authentication and subscription layer of the system.

## Data Model

### Account Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| Firstname | string | User's first name | Required |
| Lastname | string | User's last name | Required |
| Email | string | User's email (login) | Required, Unique |
| AccountType | AccountType | Type of account | Enum, Required |
| UserId | int? | Foreign key to User | Nullable, FK |
| DefaultProfileId | int? | Default profile ID | Nullable |
| Profiles | ICollection<Profile> | Associated profiles | Navigation property |
| User | User | Navigation property | Lazy loaded |
| AccountStatus | AccountStatus | Subscription status | Enum |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |
| CreatedDate | DateTime | Creation timestamp | Inherited from BaseEntity |

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
    public int Id { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Email { get; set; }
    public AccountType AccountType { get; set; }
    public AccountStatus AccountStatus { get; set; }
    public int? DefaultProfileId { get; set; }
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
  "id": 1,
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "accountType": 1,
  "accountStatus": 1,
  "defaultProfileId": 5
}
```

**Acceptance Criteria:**
- AC1: Returns account for authenticated user
- AC2: Includes account type and status
- AC3: Returns 401 if not authenticated

**Sample Code:**

```csharp
[HttpGet]
[Route("current")]
public IHttpActionResult Current() => Ok(service.GetCurrentAccount(Request));
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

**Sample Code:**

```csharp
[HttpGet]
[Route("billing")]
public IHttpActionResult Billing() => Ok(service.GetBilling(Request));
```

## Entity Configuration

```csharp
public class Account : BaseEntity
{
    public Account()
    {
        this.Profiles = new HashSet<Profile>();
    }

    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Email { get; set; }
    public AccountType AccountType { get; set; }

    [ForeignKey("User")]
    public int? UserId { get; set; }
    public int? DefaultProfileId { get; set; }
    public ICollection<Profile> Profiles { get; set; }
    public User User { get; set; }
    public AccountStatus AccountStatus { get; set; }
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

### IAccountService

```csharp
public interface IAccountService
{
    AccountDto GetCurrentAccount(HttpRequestMessage request);
    BillingDto GetBilling(HttpRequestMessage request);
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
public class User : BaseEntity
{
    public string Username { get; set; }
    public string Password { get; set; }  // Encrypted
    public ICollection<Account> Accounts { get; set; }
    public ICollection<Role> Roles { get; set; }
}
```

### Subscription Entity

```csharp
public class Subscription : BaseEntity
{
    public int AccountId { get; set; }
    public int PlanId { get; set; }
    public DateTime EffectiveDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public ICollection<Payment> Payments { get; set; }
}
```

### Payment Entity

```csharp
public class Payment : BaseEntity
{
    public int AccountId { get; set; }
    public float Amount { get; set; }
    public DateTime DateTime { get; set; }
}
```

## Security Considerations

1. **Password Storage:** Passwords are encrypted in the User entity
2. **Email Privacy:** Account email is only visible to the account owner and admins
3. **Billing Access:** Only account owners can view their billing information

## Dependencies

- **AccountService:** Business logic for account operations
- **WeddingBiddersUow:** Unit of Work for data access
- **Entity Framework:** For data persistence
