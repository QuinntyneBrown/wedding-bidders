# Profile Feature - Frontend Specification

## Overview

The Profile frontend feature manages user profile viewing, personalization, and profile-type based routing. It handles the display of user information and profile customization flows.

## Architecture

- **Framework:** AngularJS 1.4.8
- **Component System:** ngX custom components
- **State Management:** Flux-like pattern

## Routes

| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| /myprofile | (redirect) | Redirects to role-specific profile | Authenticated |
| /customer/myprofile | wb-customer-my-profile | Customer profile | Customer |
| /bidder/myprofile | wb-bidder-my-profile | Bidder profile | Bidder |
| /personalize | wb-personalize | Profile personalization | Authenticated |

## Components

### wb-personalize

**Location:** `/_src/app/components/wb-personalize.js`

**Description:** Profile personalization flow for first-time users.

**Purpose:** Guides new users through setting up their profile after registration.

**Template Structure:**

```html
<div class="personalize">
    <h2>Complete Your Profile</h2>
    <form class="personalizeForm">
        <!-- Profile customization fields -->
        <button data-ng-click="vm.complete()">Complete Setup</button>
    </form>
</div>
```

**Acceptance Criteria:**
- AC1: Shows after registration/first login
- AC2: Collects additional profile information
- AC3: Updates IsPersonalized flag on completion
- AC4: Redirects to dashboard after completion

---

### wb-manage-profiles

**Location:** `/_src/app/components/wb-manage-profiles.js`

**Description:** Manage multiple profiles (if supported).

**Acceptance Criteria:**
- AC1: Lists user's profiles
- AC2: Allows switching active profile
- AC3: Shows profile type for each

## Service Layer

### profileService

**Location:** `/_src/app/services/profileService.js`

**Methods:**

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| getCurrentProfile() | GET | /api/profile/current | Get current profile |
| getByBidId(options) | GET | /api/profile/getByBidId | Get profile from bid |
| updateIsPersonalizedFlag() | POST | /api/profile | Mark personalized |
| getOtherBidders() | GET | /api/profile/getOthers | Get contacts |
| getProfileById(options) | GET | /api/profile/getProfileById | Get profile by ID |

**Sample Code:**

```javascript
function profileService($q, apiEndpoint, fetch) {
    var self = this;

    self.getCurrentProfile = function () {
        var deferred = $q.defer();
        fetch.fromService({
            method: "GET",
            url: self.baseUri + "/current"
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.updateIsPersonalizedFlag = function () {
        var deferred = $q.defer();
        fetch.fromService({
            method: "POST",
            url: self.baseUri
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.getOtherBidders = function () {
        var deferred = $q.defer();
        fetch.fromService({
            method: "GET",
            url: self.baseUri + "/getOthers"
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.getProfileById = function (options) {
        var deferred = $q.defer();
        fetch.fromService({
            method: "GET",
            url: self.baseUri + "/getProfileById",
            params: { id: options.id }
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.baseUri = apiEndpoint.getBaseUrl() + "/profile";
    return self;
}
```

## Domain Model

### Profile

```javascript
{
    id: number,
    name: string,
    profileType: number,
    isPersonalized: boolean,
    isApproved: boolean,
    accountEmail: string,
    accountFirstname: string,
    accountLastname: string
}
```

### ProfileType Constants

```javascript
var PROFILE_TYPE = {
    CUSTOMER: 0,
    CATERER: 1,
    PHOTOGRAPHER: 2,
    MAKE_UP_ARTIST: 3,
    EVENT_PLANNER: 4,
    INTERNAL: 5,
    DISC_JOCKEY: 6
};
```

## State Management

### profileStore

**State:**

| Property | Type | Description |
|----------|------|-------------|
| currentProfile | Profile | Current user's profile |
| isLoaded | boolean | Profile data loaded |

## User Flows

### Profile Redirect Flow

```
User navigates to /myprofile
            |
            v
    Get current profile
            |
            v
    Check profile type
            |
    +-------+-------+
    |               |
    v               v
Customer         Bidder
    |               |
    v               v
Redirect to      Redirect to
/customer/       /bidder/
myprofile        myprofile
```

### Personalization Flow

```
New user logs in
            |
            v
    Check IsPersonalized flag
            |
    +-------+-------+
    |               |
    v               v
Not personalized   Personalized
    |               |
    v               v
Redirect to     Continue to
/personalize    dashboard
            |
            v
    Complete personalization
            |
            v
    profileService.updateIsPersonalizedFlag()
            |
            v
    IsPersonalized = true
            |
            v
    Redirect to dashboard
```

### Contact Discovery Flow

```
User views messages
            |
            v
    profileService.getOtherBidders()
            |
            v
    Backend determines contacts based on profile type:
            |
    +-------+-------+
    |               |
    v               v
Customer         Bidder
    |               |
    v               v
Returns bidders  Returns customers
who bid on       whose weddings
their weddings   they bid on
```

## Route Guards

### canActivate

Routes can check profile type for access control:

```javascript
{
    path: "/customer/myprofile",
    component: "customer-my-profile",
    canActivate: function(profileStore) {
        return profileStore.currentProfile.profileType === PROFILE_TYPE.CUSTOMER;
    }
}
```

## Acceptance Criteria Summary

| ID | Criteria | Status |
|----|----------|--------|
| PF-01 | User can view their profile | Implemented |
| PF-02 | Profile redirect by type | Implemented |
| PF-03 | Personalization flow | Implemented |
| PF-04 | IsPersonalized flag updated | Implemented |
| PF-05 | Contact discovery | Implemented |
| PF-06 | Profile by ID lookup | Implemented |
| PF-07 | Route guards by profile type | Implemented |
