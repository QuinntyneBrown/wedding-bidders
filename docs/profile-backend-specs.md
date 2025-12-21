# Profile Feature - Backend Specification

## Overview

The Profile feature manages user profiles, which represent the identity of users within the Wedding Bidders platform. Profiles determine what content users can access and how they interact with the system.

## Data Model

### Profile Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| AccountId | int? | Foreign key to Account | Nullable, FK |
| Name | string | Display name | Optional |
| Account | Account | Navigation property | Lazy loaded |
| ProfileType | ProfileType | Type of profile | Enum, Required |
| IsPersonalized | bool | Personalization completed | Default false |
| IsApproved | bool | Admin approval status | Default false |
| Conversations | ICollection<Conversation> | User's conversations | Navigation property |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |
| CreatedDate | DateTime | Creation timestamp | Inherited from BaseEntity |

### ProfileType Enum

| Value | Name | Description |
|-------|------|-------------|
| 0 | Customer | Wedding customer profile |
| 1 | Caterer | Caterer bidder profile |
| 2 | Photographer | Photographer bidder profile |
| 3 | MakeUpArtist | Makeup artist bidder profile |
| 4 | EventPlanner | Event planner bidder profile |
| 5 | Internal | System/Admin profile |
| 6 | DiscJockey | DJ bidder profile |

## DTOs

### ProfileDto

```csharp
public class ProfileDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ProfileType ProfileType { get; set; }
    public bool IsPersonalized { get; set; }
    public bool IsApproved { get; set; }
    public string AccountEmail { get; set; }
    public string AccountFirstname { get; set; }
    public string AccountLastname { get; set; }

    public ProfileDto(Profile profile)
    {
        Id = profile.Id;
        Name = profile.Name;
        ProfileType = profile.ProfileType;
        IsPersonalized = profile.IsPersonalized;
        IsApproved = profile.IsApproved;
        if (profile.Account != null)
        {
            AccountEmail = profile.Account.Email;
            AccountFirstname = profile.Account.Firstname;
            AccountLastname = profile.Account.Lastname;
        }
    }
}
```

## API Endpoints

### GET /api/profile/Current

**Description:** Retrieves the current authenticated user's profile.

**Authorization:** Requires authentication

**Response:**

```json
{
  "id": 5,
  "name": "John's Profile",
  "profileType": 0,
  "isPersonalized": true,
  "isApproved": true,
  "accountEmail": "john@example.com",
  "accountFirstname": "John",
  "accountLastname": "Doe"
}
```

**Acceptance Criteria:**
- AC1: Returns the primary profile for the authenticated user
- AC2: Includes account information (email, name)
- AC3: Returns 401 if not authenticated

**Sample Code:**

```csharp
[HttpGet]
[Route("Current")]
public IHttpActionResult Current() => Ok(service.GetCurrentProfile(Request));
```

---

### POST /api/profile

**Description:** Updates the IsPersonalized flag for the current user's profile.

**Authorization:** Requires authentication

**Request Body:** None (flag is set to true)

**Response:** 200 OK

**Acceptance Criteria:**
- AC1: Sets IsPersonalized = true for current user's profile
- AC2: Used after user completes profile personalization flow
- AC3: Returns 200 OK on success

**Sample Code:**

```csharp
[HttpPost]
public IHttpActionResult UpdateIsPersonalizedFlag()
{
    service.UpdateIsPersonalizedFlag(Request);
    return Ok();
}
```

---

### GET /api/profile/GetByBidId

**Description:** Retrieves the profile of the bidder who submitted a specific bid.

**Authorization:** Requires authentication

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| bidId | int | Query | Yes |

**Response:**

```json
{
  "id": 10,
  "name": "Mike's Catering",
  "profileType": 1,
  "isPersonalized": true,
  "isApproved": true,
  "accountEmail": "mike@catering.com",
  "accountFirstname": "Mike",
  "accountLastname": "Chef"
}
```

**Acceptance Criteria:**
- AC1: Returns profile of bidder associated with the bid
- AC2: Includes account information
- AC3: Uses eager loading for performance

**Sample Code:**

```csharp
[HttpGet]
[Route("GetByBidId")]
public IHttpActionResult GetByBidId(int bidId)
    => Ok(new ProfileDto(this.uow.Bidders
                    .GetAll()
                    .Include(x => x.Bids)
                    .Include(x => x.Profile)
                    .Include("Profile.Account")
                    .Where(x => x.Bids.Any(b => b.Id == bidId))
                    .Single().Profile));
```

---

### GET /api/profile/getProfileById

**Description:** Retrieves a profile by its ID.

**Authorization:** Requires authentication

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| id | int | Query | Yes |

**Response:**

```json
{
  "id": 5,
  "name": "John's Profile",
  "profileType": 0,
  "isPersonalized": true,
  "isApproved": true,
  "accountEmail": "john@example.com",
  "accountFirstname": "John",
  "accountLastname": "Doe"
}
```

**Acceptance Criteria:**
- AC1: Returns profile with matching ID
- AC2: Includes account information
- AC3: Throws exception if not found

---

### GET /api/profile/GetOthers

**Description:** Retrieves profiles of users the current user can message. For customers, returns bidders who have bid on their weddings. For bidders, returns customers whose weddings they have bid on.

**Authorization:** Requires authentication

**Response:**

```json
[
  {
    "id": 10,
    "name": "Mike's Catering",
    "profileType": 1,
    "isPersonalized": true,
    "isApproved": true,
    "accountEmail": "mike@catering.com",
    "accountFirstname": "Mike",
    "accountLastname": "Chef"
  }
]
```

**Acceptance Criteria:**
- AC1: For Customers, returns bidder profiles who bid on their weddings
- AC2: For Bidders, returns customer profiles of weddings they bid on
- AC3: Only includes non-deleted weddings
- AC4: Returns empty array if no contacts found

**Sample Code:**

```csharp
[HttpGet]
[Route("GetOthers")]
public IHttpActionResult GetOthers()
{
    var currentProfile = uow.Accounts
        .GetAll()
        .Include(x => x.Profiles)
        .Where(x => x.Email == User.Identity.Name)
        .Single().Profiles.First();

    var results = new List<ProfileDto>();

    if (currentProfile.ProfileType == ProfileType.Customer) {
        var bidderProfileIds = uow.Weddings
            .GetAll()
            .Include(x => x.Bids)
            .Include(x => x.Customer)
            .Include("Bids.Bidder")
            .Where(x => x.Customer.ProfileId == currentProfile.Id)
            .Select(x => x.Bids)
            .SelectMany(b => b.Select(g => g.Bidder.ProfileId.Value)).ToList();

        results = this.uow.Profiles
            .GetAll()
            .Include(x => x.Account)
            .Where(x => bidderProfileIds.Contains(x.Id))
            .ToList()
            .Select(x => new ProfileDto(x)).ToList();

        return Ok(results);
    }

    var customerProfileIds = uow.Bids
        .GetAll()
        .Include(x => x.Bidder)
        .Include(x => x.Wedding)
        .Include("Wedding.Customer")
        .Include("Wedding.Customer.Profile")
        .Include("Bidder.Profile")
        .Where(x => x.Bidder.Profile.Id == currentProfile.Id
               && x.Wedding.IsDeleted == false)
        .Select(x => x.Wedding)
        .Select(w => w.Customer.Profile.Id)
        .ToList();

    results = this.uow.Profiles
        .GetAll()
        .Include(x => x.Account)
        .Where(x => customerProfileIds.Contains(x.Id))
        .ToList()
        .Select(x => new ProfileDto(x)).ToList();

    return Ok(results);
}
```

## Entity Configuration

```csharp
public class Profile : BaseEntity
{
    public Profile()
    {
        this.Conversations = new HashSet<Conversation>();
    }

    [ForeignKey("Account")]
    public int? AccountId { get; set; }
    public string Name { get; set; }
    public Account Account { get; set; }
    public ProfileType ProfileType { get; set; }
    public bool IsPersonalized { get; set; }
    public bool IsApproved { get; set; }
    public ICollection<Conversation> Conversations { get; set; }
}
```

## Relationships

```
Profile (N) -----> (1) Account
Profile (1) <---- (1) Customer
Profile (1) <---- (1) Bidder
Profile (N) <----> (N) Conversation (Many-to-Many)
```

## Contact Discovery Flow

### For Customers

```
Customer's Profile
       |
       v
Get Customer's Weddings
       |
       v
Get Bids on Weddings
       |
       v
Extract Bidder Profiles
       |
       v
Return as contacts
```

### For Bidders

```
Bidder's Profile
       |
       v
Get Bidder's Bids
       |
       v
Get Weddings bid on
       |
       v
Extract Customer Profiles
       |
       v
Return as contacts
```

## Business Rules

1. **One Profile Per Account:** Each account has a primary profile
2. **Profile Type Immutable:** Profile type is set at registration and doesn't change
3. **Personalization Flow:** IsPersonalized tracks onboarding completion
4. **Approval Workflow:** IsApproved controls bidder activation
5. **Contact Discovery:** Users can only message those they have business relationships with

## Service Layer

### IProfileService

```csharp
public interface IProfileService
{
    ProfileDto GetCurrentProfile(HttpRequestMessage request);
    void UpdateIsPersonalizedFlag(HttpRequestMessage request);
}
```

## Dependencies

- **ProfileService:** Business logic for profile operations
- **WeddingBiddersUow:** Unit of Work for data access
- **Entity Framework:** For data persistence and eager loading
