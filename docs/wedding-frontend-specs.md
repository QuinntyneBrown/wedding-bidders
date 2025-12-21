# Wedding Feature - Frontend Specification

## Overview

The Wedding frontend feature enables customers to create, view, and manage their wedding events. Bidders can browse available weddings matching their service category.

## Architecture

- **Framework:** AngularJS 1.4.8
- **Component System:** ngX custom components
- **State Management:** Flux-like pattern with Actions, Stores, Dispatcher

## Routes

| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| /weddings | wb-weddings | List weddings for current profile | Authenticated |
| /wedding/create | wb-edit-wedding | Create new wedding | Customer |
| /wedding/edit/:id | wb-edit-wedding | Edit existing wedding | Customer |

## Components

### wb-weddings

**Location:** `/_src/app/components/wb-weddings.js`

**Description:** Displays a list of weddings for the current user's profile. For customers, shows their weddings. For bidders, shows available weddings matching their type.

**Template Structure:**

```html
<div class="weddings">
    <wedding-item ng-repeat="wedding in vm.weddings"
                  model="wedding">
    </wedding-item>
</div>
```

**Acceptance Criteria:**
- AC1: Fetches weddings on component initialization
- AC2: Displays loading indicator while fetching
- AC3: Shows empty state message if no weddings
- AC4: Renders wedding-item for each wedding
- AC5: Refreshes on wedding added/removed events

---

### wb-wedding-item

**Location:** `/_src/app/components/wb-wedding-item.js`

**Description:** Displays a single wedding in the list view.

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| model | WeddingDto | Wedding data object |

**Display Fields:**

| Field | Description |
|-------|-------------|
| Location | Wedding venue location |
| Date | Wedding date |
| Number of Guests | Expected guest count |
| Number of Hours | Event duration |

**Acceptance Criteria:**
- AC1: Displays all wedding details
- AC2: Formats date appropriately
- AC3: Links to wedding detail/edit page

---

### wb-edit-wedding

**Location:** `/_src/app/components/wb-edit-wedding.js`

**Description:** Container component for creating/editing weddings.

**Acceptance Criteria:**
- AC1: Loads existing wedding data when editing
- AC2: Shows create form for new weddings
- AC3: Handles navigation after save

---

### wb-edit-wedding-form

**Location:** `/_src/app/components/wb-edit-wedding-form.js`

**Description:** Form component for wedding data entry.

**Form Fields:**

| Field | Type | Placeholder | Binding |
|-------|------|-------------|---------|
| numberOfGuests | text | Number Of Guests | vm.numberOfGuests |
| location | text | Location | vm.location |
| numberOfHours | text | Number Of Hours | vm.numberOfHours |
| date | date-picker | - | vm.date |
| categories | checkboxes | - | vm.bidderTypes |

**Template:**

```html
<form class="editWeddingForm" name="editWeddingForm">
    <div class="formControl">
        <input class="inputField" type="text"
               data-ng-model="vm.numberOfGuests"
               placeholder="Number Of Guests">
    </div>
    <div class="formControl">
        <input class="inputField" type="text"
               data-ng-model="vm.location"
               placeholder="Location">
    </div>
    <div class="formControl">
        <input class="inputField" type="text"
               data-ng-model="vm.numberOfHours"
               placeholder="Number Of Hours">
    </div>
    <div class="formControl">
        <date-picker model="vm.date"></date-picker>
    </div>
    <div>
        <label ng-repeat="bidderType in vm.bidderTypes">
            <input type="checkbox"
                   data-ng-model="bidderType.checked">
            {{ bidderType.displayName }}
        </label>
    </div>
    <button data-ng-click="vm.add()">Create</button>
</form>
```

**Acceptance Criteria:**
- AC1: All fields are required for submission
- AC2: Categories populated from bidder types
- AC3: Date picker allows date selection
- AC4: Submit creates wedding via weddingActions
- AC5: Success triggers navigation via dispatcher event

**Sample Code:**

```javascript
self.add = function () {
    self.addActionId = self.weddingActions.add({
        numberOfGuests: self.numberOfGuests,
        location: self.location,
        numberOfHours: self.numberOfHours,
        date: self.date,
        categories: self.getCategories()
    });
};

self.getCategories = function () {
    var categories = [];
    self.bidderTypes.forEach(function (bidderType) {
        if (bidderType.checked) {
            categories.push({ name: bidderType.displayName });
        }
    });
    return categories;
};
```

## Service Layer

### weddingService

**Location:** `/_src/app/services/weddingService.js`

**Methods:**

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| add(options) | POST | /api/wedding/add | Create wedding |
| remove(options) | DELETE | /api/wedding/remove | Delete wedding |
| getAll() | GET | /api/wedding/getAll | Get all weddings |
| getAllByCustomerId(options) | GET | /api/wedding/getAllByCustomerId | Get by customer |
| getById(options) | GET | /api/wedding/getById | Get single wedding |
| getAllByCurrentProfile() | GET | /api/wedding/getAllByCurrentProfile | Get for current user |

**Sample Code:**

```javascript
function weddingService($q, apiEndpoint, fetch) {
    var self = this;

    self.add = function (options) {
        var deferred = $q.defer();
        fetch.fromService({
            method: "POST",
            url: self.baseUri + "/add",
            data: options.data
        }).then(function(results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.getAllByCurrentProfile = function () {
        var deferred = $q.defer();
        fetch.fromService({
            method: "GET",
            url: self.baseUri + "/getAllByCurrentProfile"
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.baseUri = apiEndpoint.getBaseUrl() + "/wedding";
    return self;
}
```

## State Management

### weddingActions

**Location:** `/_src/app/actions/weddingActions.js`

**Actions:**

| Action | Description |
|--------|-------------|
| add | Create new wedding |
| remove | Delete wedding |
| getAll | Fetch all weddings |
| getById | Fetch single wedding |

### weddingStore

**Location:** `/_src/app/stores/weddingStore.js`

**State:**

| Property | Type | Description |
|----------|------|-------------|
| weddings | Array | List of wedding objects |
| currentWedding | Object | Currently selected wedding |

## Domain Model

### Wedding

**Location:** `/_src/app/domain/wedding.js`

```javascript
{
    id: number,
    numberOfGuests: number,
    numberOfHours: number,
    location: string,
    date: Date,
    categories: Category[]
}
```

### Category

```javascript
{
    name: string
}
```

## Real-time Updates

### SignalR Integration

The wedding feature subscribes to real-time updates:

```javascript
var weddingHub = $.connection.weddingHub;

weddingHub.client.onWeddingAdded = function(response) {
    // Add new wedding to store
    weddingStore.addWedding(response.Data);
    dispatcher.emit({ actionType: "WEDDING_ADDED" });
};
```

## Routing Configuration

```javascript
{
    path: "/weddings",
    component: "weddings"
}

{
    path: "/wedding/create",
    component: "edit-wedding"
}

{
    path: "/wedding/edit/:id",
    component: "edit-wedding"
}
```

## Styling

**Form Styles:**

```css
.editWeddingForm { }

.inputField {
    padding-left: 15px;
}

.formControl input {
    line-height: 30px;
    height: 30px;
    border: 1px solid #575656;
    padding-left: 7px;
    text-align: left;
    width: 200px;
}

.formControl {
    margin-bottom: 15px;
}

.editWeddingForm button {
    background-color: #222;
    color: #FFF;
    border: 0px solid;
    font-size: 11px;
    height: 30px;
    line-height: 30px;
    padding-left: 7px;
    padding-right: 7px;
    width: 50px;
}
```

## User Flows

### Create Wedding Flow

```
Customer navigates to /wedding/create
            |
            v
    Edit wedding form displayed
            |
            v
    Customer fills in details:
    - Number of guests
    - Location
    - Duration
    - Date
    - Service categories (checkboxes)
            |
            v
    Customer clicks Create
            |
            v
    weddingActions.add() called
            |
            v
    weddingService.add() makes API call
            |
            v
    On success:
    - Dispatcher emits MODEL_ADDED
    - Navigate to weddings list
```

### View Weddings Flow

```
User navigates to /weddings
            |
            v
    wb-weddings component initializes
            |
            v
    weddingService.getAllByCurrentProfile()
            |
            v
    Wedding list rendered
            |
            v
    For each wedding: wb-wedding-item displayed
```

## Acceptance Criteria Summary

| ID | Criteria | Status |
|----|----------|--------|
| WF-01 | Customer can create a new wedding | Implemented |
| WF-02 | Customer can view their weddings | Implemented |
| WF-03 | Customer can select service categories | Implemented |
| WF-04 | Bidders see weddings matching their type | Implemented |
| WF-05 | Date picker allows date selection | Implemented |
| WF-06 | Real-time updates via SignalR | Implemented |
| WF-07 | Form validation before submission | Partial |
