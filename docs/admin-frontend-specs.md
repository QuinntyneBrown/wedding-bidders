# Admin Feature - Frontend Specification

## Overview

The Admin frontend feature provides administrative tools for managing customers, bidders, weddings, issues, and system content. Only users with System role can access these features.

## Architecture

- **Framework:** AngularJS 1.4.8
- **Component System:** ngX custom components
- **Access Control:** System role required

## Routes

| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| /admin | wb-admin | Admin dashboard | System |
| /admin/customers | wb-admin-customers | Customer management | System |
| /admin/bidders | wb-admin-bidders | Bidder management | System |
| /admin/weddings | wb-admin-weddings | Wedding management | System |

## Components

### wb-admin

**Location:** `/_src/app/components/admin/wb-admin.js`

**Description:** Main admin dashboard with navigation to admin sections.

**Template Structure:**

```html
<div class="admin">
    <h1>Admin Dashboard</h1>
    <nav class="admin-nav">
        <a href="/admin/customers">Customers</a>
        <a href="/admin/bidders">Bidders</a>
        <a href="/admin/weddings">Weddings</a>
    </nav>
    <div class="admin-content">
        <!-- Dashboard widgets -->
        <div class="widget">
            <h3>Total Customers</h3>
            <span>{{ vm.customerCount }}</span>
        </div>
        <div class="widget">
            <h3>Total Bidders</h3>
            <span>{{ vm.bidderCount }}</span>
        </div>
        <div class="widget">
            <h3>Total Weddings</h3>
            <span>{{ vm.weddingCount }}</span>
        </div>
    </div>
</div>
```

**Acceptance Criteria:**
- AC1: Only accessible by System role
- AC2: Shows summary statistics
- AC3: Links to management sections
- AC4: Redirects non-admin users

---

### wb-admin-customers

**Location:** `/_src/app/components/admin/wb-admin-customers.js`

**Description:** Customer management list.

**Features:**

| Feature | Description |
|---------|-------------|
| List | Display all customers |
| Search | Filter by name/email |
| View | See customer details |

**Template Structure:**

```html
<div class="admin-customers">
    <h2>Customer Management</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr ng-repeat="customer in vm.customers">
                <td>{{ customer.id }}</td>
                <td>{{ customer.firstname }} {{ customer.lastname }}</td>
                <td>{{ customer.email }}</td>
                <td>
                    <admin-customer model="customer"></admin-customer>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```

**Acceptance Criteria:**
- AC1: Lists all customers
- AC2: Shows customer details
- AC3: Pagination for large lists
- AC4: Search/filter capability

---

### wb-admin-customer

**Location:** `/_src/app/components/admin/wb-admin-customer.js`

**Description:** Single customer row/detail in admin view.

---

### wb-admin-bidders

**Location:** `/_src/app/components/admin/wb-admin-bidders.js`

**Description:** Bidder management list with approval functionality.

**Features:**

| Feature | Description |
|---------|-------------|
| List | Display all bidders |
| Approve | Approve pending bidders |
| View | See bidder details |
| Filter | By bidder type |

**Acceptance Criteria:**
- AC1: Lists all bidders
- AC2: Shows approval status
- AC3: Can approve/reject bidders
- AC4: Filter by bidder type

---

### wb-admin-bidder

**Location:** `/_src/app/components/admin/wb-admin-bidder.js`

**Description:** Single bidder row/detail with approval controls.

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| model | BidderDto | Bidder data |

**Actions:**

| Action | Description |
|--------|-------------|
| Approve | Set IsApproved = true |
| Reject | Set IsApproved = false |

---

### wb-admin-weddings

**Location:** `/_src/app/components/admin/wb-admin-weddings.js`

**Description:** Wedding management with delete capability.

**Features:**

| Feature | Description |
|---------|-------------|
| List | Display all weddings |
| Delete | Soft delete wedding |
| View | See wedding details |

**Acceptance Criteria:**
- AC1: Lists all weddings
- AC2: Shows wedding details
- AC3: Can delete weddings
- AC4: Confirms before delete

---

### admin-wedding

**Location:** `/_src/app/components/admin/admin-wedding.js`

**Description:** Single wedding row in admin list.

---

### wb-admin-issues

**Location:** `/_src/app/components/admin/wb-admin-issues.js`

**Description:** Issue tracking and management.

**Features:**

| Feature | Description |
|---------|-------------|
| List | Display all issues |
| Status | View/update status |
| Details | See issue content |

**Status Options:**

| Status | Description |
|--------|-------------|
| New | Newly submitted |
| Open | Being investigated |
| Resolved | Issue resolved |

---

### wb-admin-conversations

**Location:** `/_src/app/components/admin/wb-admin-converstations.js`

**Description:** View all conversations for moderation.

**Acceptance Criteria:**
- AC1: Lists all conversations
- AC2: Shows participants
- AC3: View message history
- AC4: Moderation capability

---

### wb-admin-slide

**Location:** `/_src/app/components/admin/wb-admin-slide.js`

**Description:** Manage homepage banner/carousel slides.

## Service Integration

Admin components use existing services with System-role endpoints:

| Service | Endpoint | Description |
|---------|----------|-------------|
| customerService | getAll() | Get all customers |
| bidderService | getAll() | Get all bidders |
| weddingService | getAll() | Get all weddings |
| weddingService | remove() | Delete wedding |
| issueService | getAll() | Get all issues |

## Access Control

### Route Guard

```javascript
{
    path: "/admin",
    component: "admin",
    canActivate: function(profileStore) {
        return profileStore.currentProfile.profileType === PROFILE_TYPE.INTERNAL;
    }
}
```

### API Authorization

All admin endpoints require System role:

```csharp
[Authorize(Roles = "System")]
```

## User Flows

### Customer Management Flow

```
Admin navigates to /admin/customers
            |
            v
    customerService.getAll()
            |
            v
    Customer list displayed
            |
            v
    Admin can:
    - View customer details
    - See customer's weddings
    - See received bids
```

### Bidder Approval Flow

```
Admin navigates to /admin/bidders
            |
            v
    bidderService.getAll()
            |
            v
    Bidder list displayed
            |
            v
    For each pending bidder:
            |
    +-------+-------+
    |               |
    v               v
Approve          Reject
    |               |
    v               v
IsApproved      IsApproved
= true          = false
    |               |
    v               v
Bidder can      Bidder cannot
access system   access system
```

### Wedding Deletion Flow

```
Admin navigates to /admin/weddings
            |
            v
    weddingService.getAll()
            |
            v
    Wedding list displayed
            |
            v
    Admin clicks Delete
            |
            v
    Confirm dialog
            |
    +-------+-------+
    |               |
    v               v
Confirm          Cancel
    |
    v
weddingService.remove()
    |
    v
Wedding soft deleted
(IsDeleted = true)
```

### Issue Management Flow

```
Admin navigates to /admin (dashboard)
            |
            v
    issueService.getAll()
            |
            v
    Issue list displayed
            |
            v
    Admin clicks on issue
            |
            v
    View issue details:
    - Subject
    - Content
    - Reporter
    - Status
            |
            v
    Admin can update status:
    New -> Open -> Resolved
```

## Dashboard Widgets

| Widget | Data Source | Description |
|--------|-------------|-------------|
| Customer Count | customerService.getAll().length | Total customers |
| Bidder Count | bidderService.getAll().length | Total bidders |
| Wedding Count | weddingService.getAll().length | Total weddings |
| Pending Issues | issueService.getAll() (filter New) | Unresolved issues |

## Acceptance Criteria Summary

| ID | Criteria | Status |
|----|----------|--------|
| ADM-01 | Admin dashboard accessible | Implemented |
| ADM-02 | Customer list view | Implemented |
| ADM-03 | Bidder list view | Implemented |
| ADM-04 | Bidder approval | Partial |
| ADM-05 | Wedding list view | Implemented |
| ADM-06 | Wedding deletion | Implemented |
| ADM-07 | Issue tracking | Implemented |
| ADM-08 | Conversation moderation | Implemented |
| ADM-09 | Access restricted to System role | Implemented |
