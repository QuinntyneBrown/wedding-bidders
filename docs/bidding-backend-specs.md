# Bidding Feature - Backend Specification

## Overview

The Bidding feature enables vendors (bidders) to submit competitive bids on wedding events. This is the core marketplace mechanism that connects customers with service providers.

## Data Model

### Bid Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| WeddingId | int? | Foreign key to Wedding | Nullable, FK |
| BidderId | int? | Foreign key to Bidder | Nullable, FK |
| Description | string | Bid proposal details | Required |
| Price | float | Bid amount | Required |
| Wedding | Wedding | Navigation property | Lazy loaded |
| Bidder | Bidder | Navigation property | Lazy loaded |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |
| CreatedDate | DateTime | Creation timestamp | Inherited from BaseEntity |
| LastModifiedDate | DateTime | Last update timestamp | Inherited from BaseEntity |

## DTOs

### BidRequestDto

```csharp
public class BidRequestDto
{
    public int WeddingId { get; set; }
    public float Price { get; set; }
    public string Description { get; set; }
}
```

### BidResponseDto

```csharp
public class BidResponseDto
{
    public int Id { get; set; }
    public int WeddingId { get; set; }
    public int BidderId { get; set; }
    public float Price { get; set; }
    public string Description { get; set; }
}
```

### BidDto

```csharp
public class BidDto
{
    public int Id { get; set; }
    public float Price { get; set; }
    public string Description { get; set; }
    public int? WeddingId { get; set; }
}
```

## API Endpoints

### POST /api/bid/add

**Description:** Creates a new bid on a wedding event.

**Authorization:** Requires authentication (Bidder role implied)

**Request Body:**

```json
{
  "weddingId": 1,
  "price": 5000.00,
  "description": "Full catering service including appetizers, main course, and dessert for 150 guests."
}
```

**Response:**

```json
{
  "id": 1,
  "weddingId": 1,
  "bidderId": 5,
  "price": 5000.00,
  "description": "Full catering service including appetizers, main course, and dessert for 150 guests."
}
```

**Acceptance Criteria:**
- AC1: Bid is associated with the current user's Bidder record (looked up by email)
- AC2: WeddingId must reference a valid wedding
- AC3: Price must be a positive value
- AC4: Description should detail the bid proposal
- AC5: SignalR notification is broadcast to all connected clients
- AC6: Created bid with ID is returned

**Sample Code:**

```csharp
[HttpPost]
[Route("add")]
public IHttpActionResult TryToAddBid(BidRequestDto dto)
{
    var bidder = this.uow.Bidders.GetAll()
        .Where(x => x.Email.ToLower() == Username.ToLower()).Single();

    var bid = new Bid() {
        BidderId = bidder.Id,
        Description = dto.Description,
        WeddingId = dto.WeddingId,
        Price = dto.Price
    };

    this.repository.Add(bid);
    this.uow.SaveChanges();

    var response = new BidResponseDto(bid);
    var context = GlobalHost.ConnectionManager.GetHubContext<BidHub>();
    context.Clients.All.onBiddAdded(new { Data = response });
    return Ok(response);
}
```

---

### GET /api/bid/getAllByWeddingId

**Description:** Retrieves all bids submitted for a specific wedding.

**Authorization:** None specified (likely requires authentication)

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| id | int | Query | Yes |

**Response:**

```json
[
  {
    "id": 1,
    "price": 5000.00,
    "description": "Full catering service...",
    "weddingId": 1
  },
  {
    "id": 2,
    "price": 4500.00,
    "description": "Premium photography package...",
    "weddingId": 1
  }
]
```

**Acceptance Criteria:**
- AC1: Returns all bids where WeddingId matches the provided id
- AC2: Returns empty array if no bids found
- AC3: Each bid includes id, price, description, and weddingId

---

### GET /api/bid/getAllByCatererId

**Description:** Retrieves all bids submitted by a specific bidder.

**Note:** The endpoint name says "Caterer" but it works for any bidder type.

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| id | int | Query | Yes |

**Response:**

```json
[
  {
    "id": 1,
    "price": 5000.00,
    "description": "Full catering service...",
    "weddingId": 1
  }
]
```

**Acceptance Criteria:**
- AC1: Returns all bids where BidderId matches the provided id
- AC2: Returns empty array if no bids found
- AC3: Works for all bidder types, not just caterers

---

### GET /api/bid/getAllByCurrentProfile

**Description:** Retrieves bids relevant to the current user's profile. For customers, returns all bids on their weddings. For bidders, returns their own bids.

**Authorization:** Requires authentication

**Response:**

```json
[
  {
    "id": 1,
    "price": 5000.00,
    "description": "Full catering service...",
    "weddingId": 1
  }
]
```

**Acceptance Criteria:**
- AC1: For Customer profiles, returns all bids on all their weddings
- AC2: For Bidder profiles, returns all bids they have submitted
- AC3: Results include nested wedding and bid data
- AC4: Returns empty array if no bids found

**Sample Code:**

```csharp
[HttpGet]
[Route("getAllByCurrentProfile")]
public IHttpActionResult GetAllByCurrentProfile()
{
    var profile = uow.Accounts
        .GetAll()
        .Include(x => x.Profiles)
        .Where(x => x.Email == Username)
        .First()
        .Profiles.First();

    var dtos = new List<BidDto>();

    if (profile.ProfileType == ProfileType.Customer)
    {
        var customer = uow.Customers.GetAll()
            .Where(x => x.ProfileId == profile.Id)
            .Include(x => x.Weddings)
            .Include("Weddings.Bids")
            .First();

        foreach (var wedding in customer.Weddings)
        {
            foreach(var bid in wedding.Bids)
            {
                dtos.Add(new BidDto(bid));
            }
        }
    }
    else
    {
        var bidder = uow.Bidders.GetAll()
            .Where(x => x.Email.ToLower() == Username.ToLower()).First();
        var bids = uow.Bids.GetAll()
            .Where(x => x.BidderId == bidder.Id);
        foreach (var bid in bids)
        {
            dtos.Add(new BidDto(bid));
        }
    }

    return Ok(dtos);
}
```

## SignalR Integration

### BidHub

The bidding feature integrates with SignalR for real-time bid notifications.

**Hub Path:** `/signalr/hubs/bid`

**Events:**

| Event | Trigger | Payload |
|-------|---------|---------|
| onBiddAdded | New bid created | `{ Data: BidResponseDto }` |

**Client Subscription Example:**

```javascript
var bidHub = $.connection.bidHub;
bidHub.client.onBiddAdded = function(response) {
    // Handle new bid notification
    console.log('New bid received:', response.Data);
};
```

## Business Rules

1. **Single Bidder Per Bid:** Each bid is associated with exactly one bidder
2. **Bidder Lookup:** Bidder is identified by email from the current user context
3. **Real-time Updates:** All connected clients receive bid notifications
4. **Profile-Based Filtering:** Bid visibility depends on user's profile type
5. **No Bid Modification:** Once submitted, bids cannot be modified (no update endpoint)
6. **Price as Float:** Prices are stored as floating-point numbers

## Relationships

```
Bid (N) -----> (1) Wedding
Bid (N) -----> (1) Bidder
```

## Entity Configuration

```csharp
public class Bid: BaseEntity
{
    [ForeignKey("Wedding")]
    public int? WeddingId { get; set; }

    [ForeignKey("Bidder")]
    public int? BidderId { get; set; }

    public string Description { get; set; }
    public float Price { get; set; }
    public Bidder Bidder { get; set; }
    public Wedding Wedding { get; set; }
}
```

## Dependencies

- **BidderService:** For resolving current user's bidder record
- **SignalR BidHub:** For real-time notifications
- **WeddingBiddersUow:** Unit of Work for data access
- **Entity Framework:** For data persistence and eager loading
