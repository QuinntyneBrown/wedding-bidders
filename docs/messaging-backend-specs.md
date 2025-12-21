# Messaging Feature - Backend Specification

## Overview

The Messaging feature enables direct communication between customers and bidders. Messages are organized into conversations, allowing participants to discuss wedding details and negotiate bids.

## Data Model

### Message Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| ConversationId | int? | Foreign key to Conversation | Nullable, FK |
| ToProfileId | int? | Recipient profile ID | Nullable |
| FromProfileId | int? | Sender profile ID | Nullable |
| Subject | string | Message subject | Optional |
| Content | string | Message body | Required |
| IsRead | bool | Read status flag | Default false |
| Conversation | Conversation | Navigation property | Lazy loaded |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |
| CreatedDate | DateTime | Creation timestamp | Inherited from BaseEntity |
| LastModifiedDate | DateTime | Last update timestamp | Inherited from BaseEntity |

### Conversation Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| Messages | ICollection<Message> | Messages in conversation | Navigation property |
| Profiles | ICollection<Profile> | Participants | Many-to-many |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |
| CreatedDate | DateTime | Creation timestamp | Inherited from BaseEntity |

## DTOs

### MessageDto

```csharp
public class MessageDto
{
    public int Id { get; set; }
    public int? ConversationId { get; set; }
    public int? ToProfileId { get; set; }
    public int? FromProfileId { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }
    public bool IsRead { get; set; }

    public MessageDto(Message message)
    {
        Id = message.Id;
        ConversationId = message.ConversationId;
        ToProfileId = message.ToProfileId;
        FromProfileId = message.FromProfileId;
        Subject = message.Subject;
        Content = message.Content;
        IsRead = message.IsRead;
    }
}
```

### SendMessageRequestDto

```csharp
public class SendMessageRequestDto
{
    public int OtherProfileId { get; set; }
    public string Content { get; set; }
}
```

### ConversationDto

```csharp
public class ConversationDto
{
    public int Id { get; set; }
    public IEnumerable<MessageDto> Messages { get; set; }
    public IEnumerable<ProfileDto> Profiles { get; set; }
}
```

## API Endpoints

### GET /api/message/getByOtherProfileId

**Description:** Retrieves all messages in a conversation with another user.

**Authorization:** Requires authentication

**Parameters:**

| Name | Type | Location | Required |
|------|------|----------|----------|
| otherProfileId | int | Query | Yes |

**Response:**

```json
[
  {
    "id": 1,
    "conversationId": 5,
    "toProfileId": 10,
    "fromProfileId": 3,
    "subject": null,
    "content": "Hi, I'm interested in your catering services.",
    "isRead": true
  },
  {
    "id": 2,
    "conversationId": 5,
    "toProfileId": 3,
    "fromProfileId": 10,
    "subject": null,
    "content": "Thank you for your interest! What date is your wedding?",
    "isRead": true
  }
]
```

**Acceptance Criteria:**
- AC1: Returns all messages in the conversation between current user and specified profile
- AC2: Returns empty array if no conversation exists
- AC3: Conversation lookup considers both participant directions
- AC4: Messages are returned in creation order

**Sample Code:**

```csharp
[HttpGet]
[Route("getByOtherProfileId")]
public IHttpActionResult GetByOtherProfileId(int otherProfileId)
{
    IEnumerable<MessageDto> response = new List<MessageDto>();

    var currentProfile = uow.Accounts
        .GetAll()
        .Include(x => x.Profiles)
        .Where(x => x.Email == User.Identity.Name)
        .Single().Profiles.First();

    var conversation = uow.Conversations
        .GetAll()
        .Include(x => x.Messages)
        .Where(x => x.Profiles.Any(p => p.Id == currentProfile.Id)
               && x.Profiles.Any(p => p.Id == otherProfileId))
        .FirstOrDefault();

    if (conversation != null)
        response = conversation.Messages.Select(x => new MessageDto(x));

    return Ok(response);
}
```

---

### POST /api/message/add

**Description:** Sends a new message to another user.

**Authorization:** Requires authentication

**Request Body:**

```json
{
  "otherProfileId": 10,
  "content": "Hi, I'm interested in your catering services for my wedding on June 15th."
}
```

**Response:**

```json
{
  "id": 3,
  "conversationId": 5,
  "toProfileId": 10,
  "fromProfileId": 3,
  "subject": null,
  "content": "Hi, I'm interested in your catering services for my wedding on June 15th.",
  "isRead": false
}
```

**Acceptance Criteria:**
- AC1: Creates a new conversation if one doesn't exist between the participants
- AC2: Adds message to existing conversation if found
- AC3: Sets FromProfileId to current user's profile
- AC4: Sets ToProfileId to the specified other profile
- AC5: New messages have IsRead = false
- AC6: Returns the created message with ID

**Sample Code:**

```csharp
[HttpPost]
[Route("add")]
public IHttpActionResult Send(SendMessageRequestDto dto)
{
    var currentProfile = uow.Accounts
        .GetAll()
        .Include(x => x.Profiles)
        .Where(x => x.Email == User.Identity.Name)
        .Single().Profiles.First();

    var conversation = uow.Conversations
        .GetAll()
        .Where(x => x.Profiles.Any(p => p.Id == currentProfile.Id))
        .Where(x => x.Profiles.Any(p => p.Id == dto.OtherProfileId))
        .FirstOrDefault();

    if (conversation == null)
    {
        conversation = new Conversation();
        conversation.Profiles.Add(currentProfile);
        conversation.Profiles.Add(uow.Profiles.GetById(dto.OtherProfileId));
        uow.Conversations.Add(conversation);
    }

    var message = new Message();
    message.FromProfileId = currentProfile.Id;
    message.ToProfileId = dto.OtherProfileId;
    message.Content = dto.Content;
    conversation.Messages.Add(message);

    uow.SaveChanges();

    return Ok(new MessageDto(message));
}
```

---

### GET /api/conversation/getAll

**Description:** Retrieves all conversations in the system.

**Authorization:** Requires `System` role

**Response:**

```json
[
  {
    "id": 1,
    "messages": [...],
    "profiles": [...]
  }
]
```

**Acceptance Criteria:**
- AC1: Only users with System role can access
- AC2: Returns all conversations with messages and profiles
- AC3: Used for admin monitoring

## SignalR Integration

### MessageHub

The messaging feature supports real-time message delivery via SignalR.

**Hub Path:** `/signalr/hubs/message`

**Events:**

| Event | Trigger | Payload |
|-------|---------|---------|
| onMessageReceived | New message sent | `{ Data: MessageDto }` |

**Client Subscription:**

```javascript
var messageHub = $.connection.messageHub;
messageHub.client.onMessageReceived = function(response) {
    // Handle new message notification
    console.log('New message:', response.Data);
};
```

## Entity Configuration

### Message

```csharp
public class Message: BaseEntity
{
    public Message() { }

    [ForeignKey("Conversation")]
    public int? ConversationId { get; set; }
    public int? ToProfileId { get; set; }
    public int? FromProfileId { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }
    public bool IsRead { get; set; }
    public Conversation Conversation { get; set; }
}
```

### Conversation

```csharp
public class Conversation: BaseEntity
{
    public Conversation()
    {
        this.Messages = new HashSet<Message>();
        this.Profiles = new HashSet<Profile>();
    }

    public ICollection<Message> Messages { get; set; }
    public ICollection<Profile> Profiles { get; set; }
}
```

## Relationships

```
Conversation (1) -----> (N) Message
Conversation (N) <----> (N) Profile (Many-to-Many)
Message (N) -----> (1) Profile (From)
Message (N) -----> (1) Profile (To)
```

## Message Flow

```
Customer wants to contact Bidder
           |
           v
    POST /api/message/add
           |
           v
    Lookup existing conversation
           |
    +------+------+
    |             |
    v             v
No conversation   Conversation exists
    |             |
    v             v
Create new        Use existing
conversation      conversation
    |             |
    +------+------+
           |
           v
    Create message record
           |
           v
    Link to conversation
           |
           v
    Save changes
           |
           v
    Return MessageDto
```

## Business Rules

1. **Two-Party Conversations:** Conversations are between exactly two profiles
2. **Automatic Conversation Creation:** New conversations are created on first message
3. **Bidirectional Lookup:** Conversations are found regardless of who initiated
4. **Read Status Tracking:** Messages track whether they've been read
5. **Profile-Based Messaging:** Users message via profile IDs, not user IDs
6. **No Subject Required:** Subject field is optional

## Security Considerations

1. **Profile Verification:** Users can only send messages as themselves
2. **Conversation Access:** Users can only access their own conversations
3. **Admin Access:** System role can view all conversations for moderation

## Dependencies

- **MessageService:** Business logic for message operations
- **SignalR MessageHub:** For real-time notifications
- **WeddingBiddersUow:** Unit of Work for data access
- **Entity Framework:** For data persistence
