# Issue Feature - Backend Specification

## Overview

The Issue feature provides a support ticket system for users to report problems, request help, or provide feedback. Issues are tracked with status and can be managed by administrators.

## Data Model

### Issue Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| Subject | string | Issue title | Required |
| Content | string | Issue description | Required |
| IssueStatus | IssueStatus | Current status | Enum |
| ReportedById | int | Foreign key to Profile | Required, FK |
| ReportedBy | Profile | Navigation property | Lazy loaded |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |
| CreatedDate | DateTime | Creation timestamp | Inherited from BaseEntity |
| LastModifiedDate | DateTime | Last update timestamp | Inherited from BaseEntity |

### IssueStatus Enum

| Value | Name | Description |
|-------|------|-------------|
| 0 | New | Newly created issue |
| 1 | Open | Issue being worked on |
| 2 | Resolved | Issue has been resolved |

## DTOs

### IssueDto

```csharp
public class IssueDto
{
    public int Id { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }
    public IssueStatus IssueStatus { get; set; }
    public int ReportedById { get; set; }
    public DateTime CreatedDate { get; set; }

    public IssueDto(Issue issue)
    {
        Id = issue.Id;
        Subject = issue.Subject;
        Content = issue.Content;
        IssueStatus = issue.IssueStatus;
        ReportedById = issue.ReportedById;
        CreatedDate = issue.CreatedDate;
    }
}
```

### IssueRequestDto

```csharp
public class IssueRequestDto
{
    public string Subject { get; set; }
    public string Content { get; set; }
}
```

## API Endpoints

### GET /api/issue/getAll

**Description:** Retrieves all issues in the system for administrative review.

**Authorization:** Requires `System` role

**Response:**

```json
[
  {
    "id": 1,
    "subject": "Cannot submit bid",
    "content": "When I try to submit a bid, I get an error message...",
    "issueStatus": 0,
    "reportedById": 5,
    "createdDate": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "subject": "Payment not processing",
    "content": "My credit card is being declined...",
    "issueStatus": 1,
    "reportedById": 8,
    "createdDate": "2024-01-14T15:45:00"
  }
]
```

**Acceptance Criteria:**
- AC1: Only users with System role can access
- AC2: Returns all issues regardless of status
- AC3: Each issue includes reporter information
- AC4: Used for admin support dashboard

**Sample Code:**

```csharp
[HttpGet]
[Route("getAll")]
[Authorize(Roles = "System")]
public IHttpActionResult Get()
    => Ok(uow.Issues.GetAll().ToList().Select(x => new IssueDto(x)));
```

---

### POST /api/issue/add

**Description:** Creates a new support issue.

**Authorization:** Requires authentication

**Request Body:**

```json
{
  "subject": "Cannot submit bid",
  "content": "When I try to submit a bid for wedding #5, I receive an error message saying 'Invalid request'. I have tried multiple times but the issue persists."
}
```

**Response:** 200 OK

**Acceptance Criteria:**
- AC1: Creates new issue with status = New
- AC2: Associates issue with current user's profile
- AC3: Subject and Content are required
- AC4: Returns 200 OK on success

**Sample Code:**

```csharp
[HttpPost]
[Route("add")]
public IHttpActionResult Add(IssueRequestDto dto)
{
    var currentProfile = uow.Accounts
        .GetAll()
        .Include(x => x.Profiles)
        .Where(x => x.Email == User.Identity.Name)
        .Single()
        .Profiles.First();

    var issue = new Issue()
    {
        ReportedById = currentProfile.Id,
        Subject = dto.Subject,
        Content = dto.Content,
        IssueStatus = IssueStatus.New
    };

    uow.Issues.Add(issue);
    uow.SaveChanges();

    return Ok();
}
```

## SignalR Integration

### IssueHub

The issue feature can integrate with SignalR for real-time notifications to administrators.

**Hub Path:** `/signalr/hubs/issue`

**Events:**

| Event | Trigger | Payload |
|-------|---------|---------|
| onIssueCreated | New issue submitted | `{ Data: IssueDto }` |
| onIssueUpdated | Issue status changed | `{ Data: IssueDto }` |

## Entity Configuration

```csharp
public class Issue: BaseEntity
{
    public Issue() { }

    public string Subject { get; set; }
    public string Content { get; set; }
    public IssueStatus IssueStatus { get; set; }

    [ForeignKey("ReportedBy")]
    public int ReportedById { get; set; }
    public Profile ReportedBy { get; set; }
}
```

## Relationships

```
Issue (N) -----> (1) Profile (ReportedBy)
```

## Issue Lifecycle

```
User submits issue
        |
        v
IssueStatus = New
        |
        v
Admin reviews issue
        |
        v
IssueStatus = Open
        |
        v
Issue resolved
        |
        v
IssueStatus = Resolved
```

## Business Rules

1. **Profile Association:** Issues are linked to the reporter's profile
2. **Initial Status:** New issues start with IssueStatus = New
3. **Status Progression:** Issues progress from New to Open to Resolved
4. **Subject Required:** Issues must have a subject line
5. **Content Required:** Issues must have descriptive content

## UI Integration

Issues are reported from the frontend via the "Report an Issue" component:

| Route | Component |
|-------|-----------|
| /reportanissue | wb-report-an-issue |

## Admin Features

Administrators can:
- View all issues across the system
- See reporter information
- Track issue creation dates
- Filter by status

## Security Considerations

1. **Profile Verification:** Issues are automatically linked to the current user
2. **Admin Only View:** Only System role can view all issues
3. **No Edit by Users:** Users cannot modify issues after submission

## Dependencies

- **WeddingBiddersUow:** Unit of Work for data access
- **SignalR IssueHub:** For real-time admin notifications
- **Entity Framework:** For data persistence
