# Bidder Feature - Backend Specification

## Overview

The Bidder feature manages vendor registration, profile retrieval, and bidder type enumeration. Bidders are service providers (caterers, photographers, etc.) who submit bids on wedding events.

## Data Model

### Bidder Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated, inherited from Person |
| Firstname | string | Bidder's first name | Inherited from Person |
| Lastname | string | Bidder's last name | Inherited from Person |
| Email | string | Bidder's email | Inherited from Person, used for login |
| CompanyName | string | Business/Company name | Optional |
| Description | string | Business description | Optional |
| ProfileId | int? | Foreign key to Profile | Nullable, FK |
| Profile | Profile | Navigation property | Lazy loaded |
| BidderType | BidderType | Type of service provided | Enum, Required |
| IsApproved | bool | Admin approval status | Default false |
| Galleries | ICollection<Gallery> | Portfolio galleries | Navigation property |
| Bids | ICollection<Bid> | Submitted bids | Navigation property |

### BidderType Enum

| Value | Name | Description |
|-------|------|-------------|
| 0 | Caterer | Food and beverage services |
| 1 | Photographer | Photography services |
| 2 | MakeUpArtist | Makeup and styling services |
| 3 | EventPlanner | Event coordination services |
| 4 | DiscJockey | DJ and music services |

### Specialized Bidder Types (Inheritance)

```
BaseEntity
    |
    v
  Person
    |
    v
  Bidder
    |
    +---> Caterer
    +---> Photographer
    +---> MakeUpArtist
    +---> EventPlanner
    +---> DiscJockey
```

## DTOs

### BidderDto

```csharp
public class BidderDto
{
    public int Id { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Email { get; set; }
    public string CompanyName { get; set; }
    public string Description { get; set; }
    public int? ProfileId { get; set; }
    public BidderType BidderType { get; set; }
    public bool IsApproved { get; set; }

    public BidderDto(Bidder bidder)
    {
        Id = bidder.Id;
        Firstname = bidder.Firstname;
        Lastname = bidder.Lastname;
        Email = bidder.Email;
        CompanyName = bidder.CompanyName;
        Description = bidder.Description;
        ProfileId = bidder.ProfileId;
        BidderType = bidder.BidderType;
        IsApproved = bidder.IsApproved;
    }
}
```

### BidderRegistrationRequestDto

```csharp
public class BidderRegistrationRequestDto
{
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }
    public string CompanyName { get; set; }
    public string Description { get; set; }
    public int BidderType { get; set; }
}
```

### BidderRegistrationResponseDto

```csharp
public class BidderRegistrationResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public int? BidderId { get; set; }
}
```

## API Endpoints

### GET /api/bidder/current

**Description:** Retrieves the current authenticated bidder's information.

**Authorization:** Requires authentication

**Response:**

```json
{
  "id": 1,
  "firstname": "Mike",
  "lastname": "Chef",
  "email": "mike@catering.com",
  "companyName": "Mike's Catering",
  "description": "Premium wedding catering services",
  "profileId": 10,
  "bidderType": 0,
  "isApproved": true
}
```

**Acceptance Criteria:**
- AC1: Returns bidder record matching the authenticated user's email
- AC2: Returns 401 if user is not authenticated
- AC3: Returns 404 if no bidder found for the email

**Sample Code:**

```csharp
[HttpGet]
[Route("current")]
public IHttpActionResult Current()
{
    var username = Request.GetRequestContext().Principal.Identity.Name;
    return Ok(service.GetByEmail(username));
}
```

---

### GET /api/bidder/getAll

**Description:** Retrieves all bidders in the system.

**Authorization:** Requires `System` role

**Response:**

```json
[
  {
    "id": 1,
    "firstname": "Mike",
    "lastname": "Chef",
    "email": "mike@catering.com",
    "companyName": "Mike's Catering",
    "description": "Premium wedding catering services",
    "bidderType": 0,
    "isApproved": true
  }
]
```

**Acceptance Criteria:**
- AC1: Only users with System role can access
- AC2: Returns all bidder records
- AC3: Each bidder is converted to BidderDto

---

### GET /api/bidder/getById

**Description:** Retrieves a specific bidder by ID.

**Authorization:** Requires authentication

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| id | int | Query | Yes |

**Response:**

```json
{
  "id": 1,
  "firstname": "Mike",
  "lastname": "Chef",
  "email": "mike@catering.com",
  "companyName": "Mike's Catering",
  "description": "Premium wedding catering services",
  "bidderType": 0,
  "isApproved": true
}
```

**Acceptance Criteria:**
- AC1: Returns bidder with matching ID
- AC2: Throws exception if bidder not found

---

### GET /api/bidder/GetByBidId

**Description:** Retrieves the bidder who submitted a specific bid.

**Authorization:** Requires authentication

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| bidId | int | Query | Yes |

**Response:**

```json
{
  "id": 1,
  "firstname": "Mike",
  "lastname": "Chef",
  "companyName": "Mike's Catering",
  "bidderType": 0
}
```

**Acceptance Criteria:**
- AC1: Returns bidder associated with the bid
- AC2: Uses eager loading to include Bids collection
- AC3: Throws exception if bid not found

**Sample Code:**

```csharp
[HttpGet]
[Route("GetByBidId")]
public IHttpActionResult GetByBidId(int bidId)
    => Ok(new BidderDto(this.uow.Bidders
        .GetAll()
        .Include(x => x.Bids)
        .Where(x => x.Bids.Any(b => b.Id == bidId))
        .Single()));
```

---

### GET /api/bidder/GetByProfileId

**Description:** Retrieves a bidder by their profile ID.

**Authorization:** Requires authentication

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| profileId | int | Query | Yes |

**Response:**

```json
{
  "id": 1,
  "firstname": "Mike",
  "lastname": "Chef",
  "companyName": "Mike's Catering",
  "profileId": 10,
  "bidderType": 0
}
```

**Acceptance Criteria:**
- AC1: Returns bidder with matching ProfileId
- AC2: Throws exception if not found

---

### GET /api/bidder/gettypes

**Description:** Retrieves all available bidder types.

**Authorization:** Anonymous (no authentication required)

**Response:**

```json
[
  { "name": "Caterer", "value": "0" },
  { "name": "Photographer", "value": "1" },
  { "name": "MakeUpArtist", "value": "2" },
  { "name": "EventPlanner", "value": "3" },
  { "name": "DiscJockey", "value": "4" }
]
```

**Acceptance Criteria:**
- AC1: Returns all BidderType enum values
- AC2: Each type includes name and numeric value
- AC3: No authentication required

**Sample Code:**

```csharp
[HttpGet]
[AllowAnonymous]
[Route("gettypes")]
public IHttpActionResult GetTypes()
{
    ICollection<Dictionary<string, string>> results = new HashSet<Dictionary<string, string>>();
    foreach (var item in Enum.GetValues(typeof(BidderType)))
    {
        var dictionary = new Dictionary<string, string>();
        dictionary.Add("name", item.ToString());
        dictionary.Add("value", Convert.ToString((int)item));
        results.Add(dictionary);
    }
    return Ok(results);
}
```

---

### POST /api/bidder/add

**Description:** Registers a new bidder account.

**Authorization:** Anonymous (no authentication required)

**Request Body:**

```json
{
  "firstname": "Mike",
  "lastname": "Chef",
  "email": "mike@catering.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "companyName": "Mike's Catering",
  "description": "Premium wedding catering services",
  "bidderType": 0
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "bidderId": 1
}
```

**Acceptance Criteria:**
- AC1: Email must be unique in the system
- AC2: Password and ConfirmPassword must match
- AC3: BidderType must be valid enum value
- AC4: Creates User, Account, Profile, and Bidder records
- AC5: Password is encrypted before storage
- AC6: IsApproved defaults to false (requires admin approval)
- AC7: ProfileType is set based on BidderType

## Entity Configuration

```csharp
public class Bidder: Person
{
    public Bidder()
    {
        this.Galleries = new HashSet<Gallery>();
        this.Bids = new HashSet<Bid>();
    }

    public string CompanyName { get; set; }
    public string Description { get; set; }

    [ForeignKey("Profile")]
    public int? ProfileId { get; set; }
    public Profile Profile { get; set; }

    public ICollection<Gallery> Galleries { get; set; }
    public ICollection<Bid> Bids { get; set; }
    public BidderType BidderType { get; set; }
    public bool IsApproved { get; set; }
}
```

## ProfileType to BidderType Mapping

| BidderType | ProfileType |
|------------|-------------|
| Caterer | Caterer |
| Photographer | Photographer |
| MakeUpArtist | MakeUpArtist |
| EventPlanner | EventPlanner |
| DiscJockey | DiscJockey |

## Relationships

```
Bidder (1) -----> (N) Bid
Bidder (1) -----> (N) Gallery
Bidder (1) -----> (1) Profile
Profile  (1) -----> (1) Account
Account  (1) -----> (1) User
```

## Business Rules

1. **Unique Email:** Each bidder must have a unique email address
2. **Bidder Type Required:** Every bidder must specify their service type
3. **Approval Workflow:** New bidders start with IsApproved = false
4. **Company Optional:** Company name and description are optional
5. **Gallery Support:** Bidders can have multiple portfolio galleries
6. **Category Matching:** Bidders only see weddings matching their type

## Dependencies

- **BidderService:** Business logic for bidder operations
- **EncryptionService:** For password hashing
- **WeddingBiddersUow:** Unit of Work for data access
- **Entity Framework:** For data persistence
