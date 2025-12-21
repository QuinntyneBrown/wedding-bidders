# Wedding Feature - Backend Specification

## Overview

The Wedding feature allows customers to create and manage wedding events that bidders can view and submit bids for. This is a core domain entity in the Wedding Bidders platform.

## Data Model

### Wedding Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| NumberOfGuests | int | Expected number of wedding guests | Required |
| NumberOfHours | int | Duration of wedding event | Required |
| Location | string | Venue location | Required |
| Date | DateTime | Wedding date | Required |
| CustomerId | int? | Foreign key to Customer | Nullable |
| Categories | ICollection<Category> | Service categories needed | Navigation property |
| Bids | ICollection<Bid> | Bids received | Navigation property |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |
| CreatedDate | DateTime | Creation timestamp | Inherited from BaseEntity |
| LastModifiedDate | DateTime | Last update timestamp | Inherited from BaseEntity |

### Category Entity

| Property | Type | Description |
|----------|------|-------------|
| Id | int | Primary key |
| Name | string | Category name (e.g., "Caterer", "Photographer") |

## API Endpoints

### GET /api/wedding/getAll

**Description:** Retrieves all non-deleted weddings in the system.

**Authorization:** Requires `System` role

**Response:**

```json
[
  {
    "id": 1,
    "numberOfGuests": 150,
    "numberOfHours": 6,
    "location": "Toronto, ON",
    "date": "2024-06-15T00:00:00"
  }
]
```

**Acceptance Criteria:**
- AC1: Only users with System role can access this endpoint
- AC2: Deleted weddings (IsDeleted=true) are excluded
- AC3: Results are ordered by Date ascending

---

### GET /api/wedding/getAllByCustomerId

**Description:** Retrieves all weddings for a specific customer.

**Authorization:** Requires authentication

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| id | int | Query | Yes |

**Response:**

```json
[
  {
    "id": 1,
    "numberOfGuests": 150,
    "numberOfHours": 6,
    "location": "Toronto, ON"
  }
]
```

**Acceptance Criteria:**
- AC1: Only returns weddings where CustomerId matches the provided id
- AC2: Deleted weddings are excluded
- AC3: Returns empty array if no weddings found

---

### GET /api/wedding/getById

**Description:** Retrieves a single wedding by ID.

**Authorization:** Requires authentication

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| id | int | Query | Yes |

**Response:**

```json
{
  "id": 1,
  "numberOfGuests": 150,
  "numberOfHours": 6,
  "location": "Toronto, ON"
}
```

**Acceptance Criteria:**
- AC1: Returns wedding details for the specified ID
- AC2: Returns 404 if wedding not found or is deleted
- AC3: Throws exception if multiple matches (data integrity violation)

---

### GET /api/wedding/getAllByCurrentProfile

**Description:** Retrieves weddings relevant to the current user's profile. For customers, returns their own weddings. For bidders, returns weddings matching their bidder type category.

**Authorization:** Requires authentication

**Response:**

```json
[
  {
    "id": 1,
    "numberOfGuests": 150,
    "numberOfHours": 6,
    "location": "Toronto, ON",
    "date": "2024-06-15T00:00:00"
  }
]
```

**Acceptance Criteria:**
- AC1: For Customer profiles, returns only weddings they created
- AC2: For Bidder profiles, returns weddings that include their BidderType as a category
- AC3: Category matching is case-insensitive with whitespace removed
- AC4: Deleted weddings are excluded
- AC5: Returns empty array if no matching weddings found

**Sample Code:**

```csharp
if (profile.ProfileType == ProfileType.Customer) {
    var customer = uow.Customers.GetAll()
        .Where(x => x.Email == Username).First();
    weddings = uow.Weddings.GetAll()
        .Include(x => x.Categories)
        .Where(x => x.CustomerId == customer.Id && x.IsDeleted == false)
        .ToList();
} else {
    var bidder = uow.Bidders.GetAll()
        .Where(x => x.Email == Username).First();
    foreach(var wedding in repository.GetAll()
        .Include(x => x.Categories)
        .Where(x => x.IsDeleted == false).ToList()) {
        foreach(var category in wedding.Categories) {
            if(category.Name.Replace(" ", string.Empty).ToLower()
               == bidder.BidderType.ToString().ToLower())
                weddings.Add(wedding);
        }
    }
}
```

---

### POST /api/wedding/add

**Description:** Creates a new wedding event.

**Authorization:** Requires authentication (Customer role implied)

**Request Body:**

```json
{
  "numberOfGuests": 150,
  "numberOfHours": 6,
  "location": "Toronto, ON",
  "date": "2024-06-15T00:00:00",
  "categories": [
    { "name": "Caterer" },
    { "name": "Photographer" }
  ]
}
```

**Response:**

```json
{
  "id": 1,
  "numberOfGuests": 150,
  "numberOfHours": 6,
  "location": "Toronto, ON",
  "date": "2024-06-15T00:00:00"
}
```

**Acceptance Criteria:**
- AC1: Wedding is associated with the current user's Customer record
- AC2: All specified categories are created and linked to the wedding
- AC3: SignalR notification is broadcast to all connected clients
- AC4: Created wedding ID is returned in the response

**Real-time Integration:**

```csharp
var context = GlobalHost.ConnectionManager.GetHubContext<WeddingHub>();
context.Clients.All.onWeddingAdded(new { Data = dto });
```

---

### PUT /api/wedding/update

**Description:** Updates an existing wedding.

**Authorization:** Requires authentication

**Request Body:**

```json
{
  "id": 1,
  "numberOfGuests": 175,
  "numberOfHours": 8,
  "location": "Toronto, ON"
}
```

**Acceptance Criteria:**
- AC1: Wedding with matching ID is updated
- AC2: Only editable fields are modified
- AC3: LastModifiedDate is automatically updated

---

### DELETE /api/wedding/remove

**Description:** Soft deletes a wedding.

**Authorization:** Requires `System` role

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| id | int | Query | Yes |

**Acceptance Criteria:**
- AC1: Only users with System role can delete weddings
- AC2: Wedding is soft deleted (IsDeleted = true)
- AC3: Associated bids and categories remain in database
- AC4: Returns 200 OK on success

## SignalR Integration

### WeddingHub

The wedding feature integrates with SignalR for real-time updates.

**Events:**

| Event | Trigger | Payload |
|-------|---------|---------|
| onWeddingAdded | New wedding created | `{ Data: WeddingDto }` |

**Client Subscription:**
```javascript
weddingHub.client.onWeddingAdded = function(response) {
    // Handle new wedding notification
};
```

## Business Rules

1. **Customer Ownership:** Only customers can create weddings
2. **Category-Based Matching:** Bidders only see weddings that match their service category
3. **Soft Delete:** Weddings are never permanently deleted; they are flagged as IsDeleted
4. **Date Ordering:** Wedding lists are typically ordered by date for relevance

## Dependencies

- **CustomerService:** For resolving current user's customer record
- **SignalR WeddingHub:** For real-time notifications
- **Entity Framework:** For data persistence
- **Unity Container:** For dependency injection
