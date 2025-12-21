# Bidder Feature - Frontend Specification

## Overview

The Bidder frontend feature handles vendor registration, profile viewing, and bidder discovery. Bidders can select their service type (Caterer, Photographer, etc.) during registration.

## Architecture

- **Framework:** AngularJS 1.4.8
- **Component System:** ngX custom components
- **State Management:** Flux-like pattern

## Routes

| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| /bidder/register | wb-bidder-registration | Bidder signup | Anonymous |
| /bidder/myprofile | wb-bidder-my-profile | View own profile | Bidder |
| /bidder/profile/:id | wb-bidder-profile | View bidder profile | Authenticated |
| /vendors | wb-vendors | Browse all bidders | Authenticated |

## Components

### wb-bidder-registration

**Location:** `/_src/app/components/wb-bidder-registration.js`

**Description:** Container for bidder registration flow.

---

### wb-bidder-registration-form

**Location:** `/_src/app/components/wb-bidder-registration-form.js`

**Description:** Registration form for new bidders/vendors.

**Form Fields:**

| Field | Type | Placeholder | Validation |
|-------|------|-------------|------------|
| firstname | text | First Name | Required |
| lastname | text | Last Name | Required |
| email | email | Email | Required, Email format |
| password | password | Password | Required |
| confirmPassword | password | Confirm Password | Must match |
| companyName | text | Company Name | Optional |
| description | textarea | Description | Optional |
| bidderType | select | Bidder Type | Required |

**Bidder Type Options:**

| Value | Display Name |
|-------|--------------|
| 0 | Caterer |
| 1 | Photographer |
| 2 | Make Up Artist |
| 3 | Event Planner |
| 4 | Disc Jockey |

**Acceptance Criteria:**
- AC1: All required fields validated
- AC2: Bidder type selection is required
- AC3: Fetches bidder types from API
- AC4: Shows loading during submission
- AC5: Redirects to login on success

---

### wb-bidder-my-profile

**Location:** `/_src/app/components/wb-bidder-my-profile.js`

**Description:** Bidder's own profile page.

**Display Sections:**

| Section | Content |
|---------|---------|
| Profile Info | Name, Company, Type |
| Description | Business description |
| Submitted Bids | List of bids placed |
| Gallery | Portfolio images |

**Acceptance Criteria:**
- AC1: Shows bidder's profile information
- AC2: Displays company name and description
- AC3: Lists submitted bids
- AC4: Shows gallery if available

---

### wb-bidder-profile

**Location:** `/_src/app/components/wb-bidder-profile.js`

**Description:** Public view of a bidder's profile.

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| id | number | Bidder ID from route |

**Acceptance Criteria:**
- AC1: Fetches bidder by ID
- AC2: Displays public profile information
- AC3: Shows contact button for messaging
- AC4: Displays portfolio gallery

---

### wb-bidder-item

**Location:** `/_src/app/components/wb-bidder-item.js`

**Description:** Bidder card for list views.

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| model | BidderDto | Bidder data |

**Display Fields:**

| Field | Description |
|-------|-------------|
| Company Name | Business name |
| Bidder Type | Service category |
| Description | Brief description |

---

### wb-vendors

**Location:** `/_src/app/components/wb-vendors.js`

**Description:** Browse all bidders/vendors.

**Acceptance Criteria:**
- AC1: Lists all approved bidders
- AC2: Filterable by bidder type
- AC3: Links to bidder profile

## Service Layer

### bidderService

**Location:** `/_src/app/services/bidderService.js`

**Methods:**

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| add(options) | POST | /api/bidder/add | Register bidder |
| getAll() | GET | /api/bidder/getAll | Get all bidders |
| getTypes() | GET | /api/bidder/getTypes | Get bidder types |
| getById(options) | GET | /api/bidder/getById | Get bidder by ID |
| getByProfileId(options) | GET | /api/bidder/getByProfileId | Get by profile |
| getByBidId(options) | GET | /api/bidder/getByBidId | Get bidder from bid |

**Sample Code:**

```javascript
function bidderService($q, apiEndpoint, fetch) {
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

    self.getTypes = function () {
        var deferred = $q.defer();
        fetch.fromService({
            method: "GET",
            url: self.baseUri + "/getTypes"
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.getById = function (options) {
        var deferred = $q.defer();
        fetch.fromService({
            method: "GET",
            url: self.baseUri + "/getById",
            params: { id: options.id }
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.baseUri = apiEndpoint.getBaseUrl() + "/bidder";
    return self;
}
```

## State Management

### bidderStore

**Location:** `/_src/app/stores/bidderStore.js`

**State:**

| Property | Type | Description |
|----------|------|-------------|
| bidders | Array | List of bidders |
| types | Array | Bidder type options |
| currentBidder | Object | Currently viewed bidder |

## Domain Model

### Bidder

```javascript
{
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    companyName: string,
    description: string,
    profileId: number,
    bidderType: number,
    isApproved: boolean
}
```

### BidderType

```javascript
{
    name: string,    // e.g., "Caterer"
    value: string    // e.g., "0"
}
```

### BidderRegistrationRequest

```javascript
{
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    confirmPassword: string,
    companyName: string,
    description: string,
    bidderType: number
}
```

## User Flows

### Registration Flow

```
Anonymous user visits /bidder/register
            |
            v
    Fetch bidder types from API
            |
            v
    Registration form displayed
            |
            v
    User fills in:
    - Personal info (name, email, password)
    - Company info (name, description)
    - Selects bidder type
            |
            v
    User clicks Register
            |
            v
    bidderService.add() called
            |
            v
    Backend creates:
    - User record
    - Account record (AccountType.Bidder)
    - Profile record (ProfileType based on bidder type)
    - Bidder record
            |
            v
    On success:
    - Redirect to login page
            |
            v
    Bidder waits for admin approval
```

### Browse Vendors Flow

```
User navigates to /vendors
            |
            v
    bidderService.getAll() called
            |
            v
    List of approved bidders displayed
            |
            v
    User clicks on bidder
            |
            v
    Navigate to /bidder/profile/:id
            |
            v
    Bidder profile displayed
            |
            v
    User can:
    - View profile details
    - Send message
    - View portfolio
```

## Bidder Type Display Names

| Type | Display Name | Category |
|------|--------------|----------|
| Caterer | Caterer | Food & Beverage |
| Photographer | Photographer | Photography |
| MakeUpArtist | Make Up Artist | Beauty |
| EventPlanner | Event Planner | Coordination |
| DiscJockey | Disc Jockey | Entertainment |

## Acceptance Criteria Summary

| ID | Criteria | Status |
|----|----------|--------|
| BDF-01 | Bidder can register | Implemented |
| BDF-02 | Bidder type selection required | Implemented |
| BDF-03 | Types fetched from API | Implemented |
| BDF-04 | Bidder can view own profile | Implemented |
| BDF-05 | Customers can view bidder profiles | Implemented |
| BDF-06 | Browse all vendors | Implemented |
| BDF-07 | Filter vendors by type | Partial |
| BDF-08 | Contact bidder from profile | Implemented |
