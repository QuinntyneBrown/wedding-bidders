# Customer Feature - Backend Specification

## Overview

The Customer feature manages customer registration and profile retrieval. Customers are users who create wedding events and receive bids from vendors.

## Data Model

### Customer Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated, inherited from Person |
| Firstname | string | Customer's first name | Inherited from Person |
| Lastname | string | Customer's last name | Inherited from Person |
| Email | string | Customer's email | Inherited from Person, used for login |
| ProfileId | int? | Foreign key to Profile | Nullable, FK |
| Profile | Profile | Navigation property | Lazy loaded |
| Weddings | ICollection<Wedding> | Customer's weddings | Navigation property |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |
| CreatedDate | DateTime | Creation timestamp | Inherited from BaseEntity |
| LastModifiedDate | DateTime | Last update timestamp | Inherited from BaseEntity |

### Inheritance Hierarchy

```
BaseEntity
    |
    v
  Person (Firstname, Lastname, Email)
    |
    v
 Customer (ProfileId, Weddings)
```

## DTOs

### CustomerDto

```csharp
public class CustomerDto
{
    public int Id { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Email { get; set; }
    public int? ProfileId { get; set; }

    public CustomerDto(Customer customer)
    {
        Id = customer.Id;
        Firstname = customer.Firstname;
        Lastname = customer.Lastname;
        Email = customer.Email;
        ProfileId = customer.ProfileId;
    }
}
```

### CustomerRegistrationRequestDto

```csharp
public class CustomerRegistrationRequestDto
{
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }
}
```

### CustomerRegistrationResponseDto

```csharp
public class CustomerRegistrationResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public int? CustomerId { get; set; }
}
```

## API Endpoints

### GET /api/customer/current

**Description:** Retrieves the current authenticated customer's information.

**Authorization:** Requires authentication

**Response:**

```json
{
  "id": 1,
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "profileId": 5
}
```

**Acceptance Criteria:**
- AC1: Returns customer record matching the authenticated user's email
- AC2: Returns 401 if user is not authenticated
- AC3: Returns 404 if no customer found for the email

**Sample Code:**

```csharp
[HttpGet]
[Route("current")]
public IHttpActionResult Current() => Ok(service.GetByEmail(Username));
```

---

### GET /api/customer/getAll

**Description:** Retrieves all customers in the system.

**Authorization:** Requires `System` role

**Response:**

```json
[
  {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "profileId": 5
  },
  {
    "id": 2,
    "firstname": "Jane",
    "lastname": "Smith",
    "email": "jane.smith@example.com",
    "profileId": 8
  }
]
```

**Acceptance Criteria:**
- AC1: Only users with System role can access this endpoint
- AC2: Returns all customer records
- AC3: Each customer is converted to CustomerDto

**Sample Code:**

```csharp
[HttpGet]
[Route("getAll")]
[Authorize(Roles = "System")]
public IHttpActionResult GetAll()
    => Ok(repository
    .GetAll()
    .ToList()
    .Select(x => new CustomerDto(x)));
```

---

### POST /api/customer/add

**Description:** Registers a new customer account.

**Authorization:** Anonymous (no authentication required)

**Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "customerId": 1
}
```

**Acceptance Criteria:**
- AC1: Email must be unique in the system
- AC2: Password and ConfirmPassword must match
- AC3: Creates User, Account, Profile, and Customer records
- AC4: Password is encrypted before storage
- AC5: Profile is created with ProfileType = Customer
- AC6: Returns success status and new customer ID

**Sample Code:**

```csharp
[AllowAnonymous]
[HttpPost]
[Route("add")]
public IHttpActionResult TryToRegister(CustomerRegistrationRequestDto dto)
     => Ok(this.service.TryToRegister(dto));
```

## Service Layer

### ICustomerService

```csharp
public interface ICustomerService
{
    CustomerDto GetByEmail(string email);
    CustomerRegistrationResponseDto TryToRegister(CustomerRegistrationRequestDto dto);
}
```

### CustomerService Implementation

The CustomerService handles:

1. **GetByEmail:** Looks up customer by email address
2. **TryToRegister:** Orchestrates the registration process including:
   - Email validation and uniqueness check
   - Password validation and encryption
   - User record creation
   - Account record creation (AccountType = Customer)
   - Profile record creation (ProfileType = Customer)
   - Customer record creation and linking

## Registration Flow

```
CustomerRegistrationRequestDto
           |
           v
    Validate Email Unique
           |
           v
    Validate Passwords Match
           |
           v
    Encrypt Password
           |
           v
    Create User Record
           |
           v
    Create Account Record (AccountType.Customer)
           |
           v
    Create Profile Record (ProfileType.Customer)
           |
           v
    Create Customer Record
           |
           v
    Link Customer to Profile
           |
           v
    Return CustomerRegistrationResponseDto
```

## Entity Configuration

```csharp
public class Customer: Person
{
    public Customer()
    {
        this.Weddings = new HashSet<Wedding>();
    }

    [ForeignKey("Profile")]
    public int? ProfileId { get; set; }
    public ICollection<Wedding> Weddings { get; set; }
    public Profile Profile { get; set; }
}
```

## Relationships

```
Customer (1) -----> (N) Wedding
Customer (1) -----> (1) Profile
Profile  (1) -----> (1) Account
Account  (1) -----> (1) User
```

## Business Rules

1. **Unique Email:** Each customer must have a unique email address
2. **Password Requirements:** Passwords are encrypted using EncryptionService
3. **Profile Association:** Every customer has exactly one Profile
4. **Account Type:** Customer accounts are created with AccountType.Customer
5. **Profile Type:** Customer profiles are created with ProfileType.Customer
6. **Wedding Ownership:** Customers can create multiple weddings

## Security Considerations

1. **Password Encryption:** Passwords are hashed before storage
2. **Anonymous Registration:** The add endpoint allows anonymous access for registration
3. **Role-Based Access:** GetAll requires System role for admin access
4. **Email as Identifier:** Email is used as the primary identifier for login

## Dependencies

- **CustomerService:** Business logic for customer operations
- **EncryptionService:** For password hashing
- **WeddingBiddersUow:** Unit of Work for data access
- **Entity Framework:** For data persistence
