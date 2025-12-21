# Messaging Feature - Frontend Specification

## Overview

The Messaging frontend feature enables direct communication between customers and bidders. Users can view their contacts and exchange messages in a conversation-style interface.

## Architecture

- **Framework:** AngularJS 1.4.8
- **Component System:** ngX custom components
- **State Management:** Flux-like pattern

## Routes

| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| /messages | wb-messages | Message inbox/contacts | Authenticated |
| /messages/:otherProfileId | wb-conversation | Conversation view | Authenticated |

## Components

### wb-messages

**Location:** `/_src/app/components/wb-messages.js`

**Description:** Displays list of contacts the user can message. For customers, shows bidders who bid on their weddings. For bidders, shows customers whose weddings they bid on.

**Template Structure:**

```html
<div class="messages">
    <h2>Messages</h2>
    <div class="contacts">
        <message-item ng-repeat="profile in vm.profiles"
                      model="profile">
        </message-item>
    </div>
</div>
```

**Acceptance Criteria:**
- AC1: Fetches contacts via profileService.getOtherBidders()
- AC2: Shows empty state if no contacts
- AC3: Each contact links to conversation view
- AC4: Shows contact name and profile type

---

### wb-message-item

**Location:** `/_src/app/components/wb-message-item.js`

**Description:** Single contact item in the messages list.

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| model | ProfileDto | Contact profile data |

**Display Fields:**

| Field | Description |
|-------|-------------|
| Name | Contact's name |
| ProfileType | Customer or Bidder type |
| Email | Contact's email |

**Acceptance Criteria:**
- AC1: Displays contact information
- AC2: Links to /messages/:otherProfileId

---

### wb-conversation

**Location:** `/_src/app/components/wb-conversation.js`

**Description:** Full conversation view with a specific contact.

**URL Parameters:**

| Parameter | Description |
|-----------|-------------|
| otherProfileId | Profile ID of conversation partner |

**Template Structure:**

```html
<div class="conversation">
    <div class="message-list">
        <div ng-repeat="message in vm.messages"
             class="message"
             ng-class="{'sent': message.fromProfileId == vm.currentProfileId,
                       'received': message.fromProfileId != vm.currentProfileId}">
            <p>{{ message.content }}</p>
        </div>
    </div>
    <message-form other-profile-id="vm.otherProfileId"
                  on-sent="vm.refreshMessages()">
    </message-form>
</div>
```

**Acceptance Criteria:**
- AC1: Fetches messages for conversation on init
- AC2: Displays messages in chronological order
- AC3: Distinguishes sent vs received messages
- AC4: Shows message compose form
- AC5: Refreshes on new message sent

---

### wb-message-form

**Location:** `/_src/app/components/wb-message-form.js`

**Description:** Form for composing and sending messages.

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| otherProfileId | number | Recipient's profile ID |
| onSent | function | Callback after sending |

**Form Fields:**

| Field | Type | Binding |
|-------|------|---------|
| content | textarea | vm.content |

**Template:**

```html
<form class="messageForm" name="messageForm">
    <text-area-form-control placeholder='"Type your message..."'
                             model="vm.content">
    </text-area-form-control>
    <button data-ng-click="vm.send()">Send</button>
</form>
```

**Acceptance Criteria:**
- AC1: Content is required
- AC2: Sends message via messageService.add()
- AC3: Clears form after successful send
- AC4: Calls onSent callback

## Service Layer

### messageService

**Location:** `/_src/app/services/messageService.js`

**Methods:**

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| add(options) | POST | /api/message/add | Send message |
| getAllForCurrentProfile() | GET | /api/message/getAllForCurrentProfile | Get all messages |
| getByOtherProfileId(options) | GET | /api/message/getByOtherProfileId | Get conversation |
| getAllIssues() | GET | /api/message/allIssues | Get issues (admin) |

**Sample Code:**

```javascript
function messageService($q, apiEndpoint, fetch) {
    var self = this;

    self.add = function (options) {
        var deferred = $q.defer();
        fetch.fromService({
            method: "POST",
            url: self.baseUri + "/add",
            data: options.data
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.getByOtherProfileId = function (options) {
        var deferred = $q.defer();
        fetch.fromService({
            method: "GET",
            url: self.baseUri + "/getByOtherProfileId",
            params: { otherProfileId: options.otherProfileId }
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.baseUri = apiEndpoint.getBaseUrl() + "/message";
    return self;
}
```

## Domain Model

### Message

```javascript
{
    id: number,
    conversationId: number,
    toProfileId: number,
    fromProfileId: number,
    subject: string,
    content: string,
    isRead: boolean
}
```

### SendMessageRequest

```javascript
{
    otherProfileId: number,
    content: string
}
```

## Real-time Updates

### SignalR Integration

```javascript
var messageHub = $.connection.messageHub;

messageHub.client.onMessageReceived = function(response) {
    // Handle new message notification
    if (response.Data.toProfileId == currentProfileId) {
        // Show notification
        // Refresh conversation if active
    }
};
```

## User Flows

### View Contacts Flow

```
User navigates to /messages
            |
            v
    profileService.getOtherBidders() called
            |
            v
    Backend returns profiles based on user type:
    - Customers: bidders who bid on their weddings
    - Bidders: customers whose weddings they bid on
            |
            v
    Contact list displayed
            |
            v
    User clicks contact
            |
            v
    Navigate to /messages/:otherProfileId
```

### Send Message Flow

```
User in conversation view
            |
            v
    Types message in form
            |
            v
    Clicks Send
            |
            v
    messageService.add() called
            |
            v
    Backend:
    - Creates/finds conversation
    - Adds message to conversation
            |
            v
    On success:
    - Clear form
    - Refresh message list
    - onSent callback
```

### Receive Message Flow

```
SignalR onMessageReceived event
            |
            v
    Check if message is for current user
            |
            v
    If in active conversation:
    - Add message to list
    - Scroll to bottom
            |
            v
    If not in conversation:
    - Show notification
    - Update unread count
```

## Message Display

### Sent Messages

```css
.message.sent {
    background-color: #e3f2fd;
    text-align: right;
    margin-left: 20%;
}
```

### Received Messages

```css
.message.received {
    background-color: #f5f5f5;
    text-align: left;
    margin-right: 20%;
}
```

## Acceptance Criteria Summary

| ID | Criteria | Status |
|----|----------|--------|
| MF-01 | User can view contacts | Implemented |
| MF-02 | Contact list based on relationships | Implemented |
| MF-03 | User can open conversation | Implemented |
| MF-04 | User can send message | Implemented |
| MF-05 | Messages displayed chronologically | Implemented |
| MF-06 | Sent/received visually distinct | Implemented |
| MF-07 | Real-time message updates | Partial |
| MF-08 | Message read status | Backend only |
