# Bidding Feature - Frontend Specification

## Overview

The Bidding frontend feature enables bidders to submit bids on weddings and allows customers to view bids received on their weddings.

## Architecture

- **Framework:** AngularJS 1.4.8
- **Component System:** ngX custom components
- **State Management:** Flux-like pattern with Actions, Stores, Dispatcher

## Routes

| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| /bids | wb-bids | View bids for current profile | Authenticated |
| /bid/create/:weddingId | wb-bid-edit | Create bid for wedding | Bidder |

## Components

### wb-bids

**Location:** `/_src/app/components/wb-bids.js`

**Description:** Displays bids relevant to the current user. For customers, shows bids on their weddings. For bidders, shows their submitted bids.

**Template Structure:**

```html
<div class="bids">
    <bid-item ng-repeat="bid in vm.bids" model="bid"></bid-item>
</div>
```

**Acceptance Criteria:**
- AC1: Fetches bids for current profile on init
- AC2: Shows loading state while fetching
- AC3: Displays empty state if no bids
- AC4: Renders bid-item for each bid

---

### wb-bid-item

**Location:** `/_src/app/components/wb-bid-item.js`

**Description:** Displays a single bid in list view.

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| model | BidDto | Bid data object |

**Display Fields:**

| Field | Description |
|-------|-------------|
| Price | Bid amount |
| Description | Bid proposal details |
| WeddingId | Associated wedding |

---

### wb-bid-edit

**Location:** `/_src/app/components/wb-bid-edit.js`

**Description:** Container for bid creation/editing.

**URL Parameters:**

| Parameter | Description |
|-----------|-------------|
| weddingId | Wedding to bid on |

---

### wb-bid-form

**Location:** `/_src/app/components/wb-bid-form.js`

**Description:** Form for submitting a bid.

**Inputs:**

| Input | Type | Description |
|-------|------|-------------|
| weddingId | number | Wedding to bid on |
| successCallback | function | Called on successful submission |

**Form Fields:**

| Field | Control | Binding |
|-------|---------|---------|
| Price | text-form-control | vm.price |
| Description | text-area-form-control | vm.description |

**Template:**

```html
<form class="bidForm" name="bidForm">
    <text-form-control placeholder='"Price"'
                        model="vm.price">
    </text-form-control>
    <text-area-form-control placeholder='"Description"'
                             model="vm.description">
    </text-area-form-control>
    <button data-ng-click="vm.tryToAdd()">Add</button>
</form>
```

**Acceptance Criteria:**
- AC1: Price and description are required
- AC2: WeddingId is passed as input
- AC3: Success callback invoked after submission
- AC4: Form clears after successful submission

**Sample Code:**

```javascript
ngX.Component({
    selector: "bid-form",
    component: function BidFormComponent(bid) {
        var self = this;

        self.tryToAdd = function () {
            bid.addAsync({
                weddingId: self.weddingId,
                price: self.price,
                description: self.description
            }).then(function () {
                if(self.successCallback)
                    self.successCallback();
            });
        };

        return self;
    },
    providers: ["bid"],
    inputs: ["weddingId", "successCallback"],
    template: [
        "<form class='bidForm' name='bidForm'>",
        "   <text-form-control placeholder='\"Price\"' model='vm.price'></text-form-control>",
        "   <text-area-form-control placeholder='\"Description\"' model='vm.description'></text-area-form-control>",
        "   <button data-ng-click='vm.tryToAdd()'>Add</button>",
        "</form>"
    ]
});
```

---

### wb-customer-bids

**Location:** `/_src/app/components/wb-customer-bids.js`

**Description:** Customer-specific view of bids on their weddings.

**Acceptance Criteria:**
- AC1: Shows all bids on customer's weddings
- AC2: Groups bids by wedding
- AC3: Allows navigation to bidder profile

## Service Layer

### bidService

**Location:** `/_src/app/services/bidService.js`

**Methods:**

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| add(options) | POST | /api/bid/add | Submit a bid |
| getAllByWeddingId(options) | GET | /api/bid/getAllByWeddingId | Get bids for wedding |
| getAllByCatererId(options) | GET | /api/bid/getAllByCatererId | Get bids by bidder |
| getAllByCurrentProfile() | GET | /api/bid/getAllByCurrentProfile | Get bids for current user |

**Sample Code:**

```javascript
function bidService($q, apiEndpoint, fetch) {
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

    self.getAllByWeddingId = function (options) {
        var deferred = $q.defer();
        fetch.fromService({
            method: "GET",
            url: self.baseUri + "/getAllByWeddingId",
            params: { id: options.id }
        }).then(function (results) {
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

    self.baseUri = apiEndpoint.getBaseUrl() + "/bid";
    return self;
}
```

## Domain Model

### Bid

**Location:** `/_src/app/domain/bid.js`

```javascript
{
    id: number,
    weddingId: number,
    bidderId: number,
    price: number,
    description: string
}
```

## Real-time Updates

### SignalR Integration

```javascript
var bidHub = $.connection.bidHub;

bidHub.client.onBiddAdded = function(response) {
    // Handle new bid notification
    bidStore.addBid(response.Data);
    dispatcher.emit({ actionType: "BID_ADDED" });
};
```

## Styling

```css
.bidForm button {
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

### Submit Bid Flow

```
Bidder views available wedding
            |
            v
    Clicks "Submit Bid" / navigates to /bid/create/:weddingId
            |
            v
    Bid form displayed
            |
            v
    Bidder enters:
    - Price (amount)
    - Description (proposal)
            |
            v
    Clicks Add button
            |
            v
    bid.addAsync() called
            |
            v
    bidService.add() makes API call
            |
            v
    On success:
    - successCallback invoked
    - Navigate back to weddings
    - SignalR broadcasts bid to all clients
```

### View Bids Flow (Customer)

```
Customer navigates to /bids
            |
            v
    wb-bids component initializes
            |
            v
    bidService.getAllByCurrentProfile()
            |
            v
    Backend returns bids on customer's weddings
            |
            v
    Bid list rendered with wb-bid-item components
            |
            v
    Customer can view bidder details
```

### View Bids Flow (Bidder)

```
Bidder navigates to /bids
            |
            v
    wb-bids component initializes
            |
            v
    bidService.getAllByCurrentProfile()
            |
            v
    Backend returns bidder's submitted bids
            |
            v
    Bid list rendered with wb-bid-item components
```

## Form Controls

### text-form-control

Custom form control for text input with styling.

```html
<text-form-control placeholder="'Label'" model="vm.field"></text-form-control>
```

### text-area-form-control

Custom form control for multi-line text input.

```html
<text-area-form-control placeholder="'Label'" model="vm.field"></text-area-form-control>
```

## Acceptance Criteria Summary

| ID | Criteria | Status |
|----|----------|--------|
| BF-01 | Bidder can submit a bid | Implemented |
| BF-02 | Bidder enters price and description | Implemented |
| BF-03 | Customer can view bids on weddings | Implemented |
| BF-04 | Bidder can view their submitted bids | Implemented |
| BF-05 | Real-time bid notifications | Implemented |
| BF-06 | Navigation to bidder profile from bid | Implemented |
| BF-07 | Form validation | Partial |
