# Payment Feature - Frontend Specification

## Overview

The Payment frontend feature handles subscription payments using Stripe integration. Users can upgrade their account from Free to Paid status by entering credit card details.

## Architecture

- **Framework:** AngularJS 1.4.8
- **Component System:** ngX custom components
- **Payment Provider:** Stripe.js
- **Angular Integration:** angular-payments library

## Routes

| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| /payment | wb-payment | Payment/subscription page | Authenticated |
| /myaccount | wb-my-account | Account settings | Authenticated |

## Components

### wb-payment

**Location:** `/_src/app/components/wb-payment.js`

**Description:** Payment page with Stripe credit card form.

**Dependencies:**
- Stripe.js (loaded from CDN)
- angular-payments module

**Template Structure:**

```html
<div class="payment">
    <h2>Upgrade Your Account</h2>
    <p>Get access to premium features for $180 CAD</p>

    <form class="paymentForm" name="paymentForm"
          stripe-form="vm.handleStripe">

        <div class="form-group">
            <label>Card Number</label>
            <input type="text"
                   payments-format="card"
                   payments-validate="card"
                   data-ng-model="vm.cardNumber"
                   name="cardNumber">
        </div>

        <div class="form-group">
            <label>Expiry</label>
            <input type="text"
                   payments-format="expiry"
                   payments-validate="expiry"
                   data-ng-model="vm.expiry"
                   name="expiry">
        </div>

        <div class="form-group">
            <label>CVC</label>
            <input type="text"
                   payments-format="cvc"
                   payments-validate="cvc"
                   data-ng-model="vm.cvc"
                   name="cvc">
        </div>

        <button type="submit">Pay $180 CAD</button>
    </form>
</div>
```

**Acceptance Criteria:**
- AC1: Displays payment form with card fields
- AC2: Card number formatting with validation
- AC3: Expiry date formatting with validation
- AC4: CVC formatting with validation
- AC5: Creates Stripe token on submit
- AC6: Calls backend with token
- AC7: Shows success/error messages
- AC8: Redirects on successful payment

**Sample Code:**

```javascript
ngX.Component({
    selector: "payment",
    component: function PaymentComponent($scope, subscriptionService) {
        var self = this;

        self.handleStripe = function(status, response) {
            if (response.error) {
                self.error = response.error.message;
            } else {
                self.processing = true;
                subscriptionService.charge({
                    data: { token: response.id }
                }).then(function() {
                    self.success = true;
                    // Redirect to dashboard
                }).catch(function(error) {
                    self.error = "Payment failed. Please try again.";
                }).finally(function() {
                    self.processing = false;
                });
            }
        };

        return self;
    },
    providers: ["subscriptionService"]
});
```

---

### wb-my-billing

**Location:** `/_src/app/components/wb-my-billing.js`

**Description:** Billing information and subscription status.

**Display Fields:**

| Field | Description |
|-------|-------------|
| Account Status | Free, Paid, or Unpaid |
| Subscription Expiry | If applicable |
| Last Payment | Date and amount |

**Acceptance Criteria:**
- AC1: Shows current account status
- AC2: Displays subscription details if paid
- AC3: Shows upgrade button if free/unpaid
- AC4: Links to payment page

---

### wb-my-account

**Location:** `/_src/app/components/wb-my-account.js`

**Description:** Account settings page.

**Sections:**

| Section | Content |
|---------|---------|
| Profile | Basic user info |
| Billing | Subscription status |
| Settings | Account preferences |

## Service Layer

### subscriptionService

**Location:** `/_src/app/services/subscriptionService.js`

**Methods:**

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| charge(options) | POST | /api/subscription/charge | Process payment |

**Sample Code:**

```javascript
function subscriptionService($q, apiEndpoint, fetch) {
    var self = this;

    self.charge = function (options) {
        var deferred = $q.defer();
        fetch.fromService({
            method: "POST",
            url: self.baseUri + "/charge",
            data: options.data
        }).then(function (results) {
            deferred.resolve(results.data);
        }).catch(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    self.baseUri = apiEndpoint.getBaseUrl() + "/subscription";
    return self;
}
```

### accountService

**Location:** `/_src/app/services/accountService.js`

**Methods:**

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| getCurrent() | GET | /api/account/current | Get account info |
| getBilling() | GET | /api/account/billing | Get billing info |

## Stripe Integration

### Configuration

```html
<!-- In index.html -->
<script src="https://js.stripe.com/v2/"></script>

<script>
    Stripe.setPublishableKey('pk_live_xxxxx');
</script>
```

### angular-payments Directives

| Directive | Purpose |
|-----------|---------|
| payments-format="card" | Formats card number with spaces |
| payments-validate="card" | Validates card number (Luhn) |
| payments-format="expiry" | Formats as MM/YY |
| payments-validate="expiry" | Validates expiry date |
| payments-format="cvc" | Formats CVC (3-4 digits) |
| payments-validate="cvc" | Validates CVC |
| stripe-form | Handles form submission to Stripe |

### Token Flow

```
User enters card details
            |
            v
    Form submitted
            |
            v
    angular-payments validates fields
            |
            v
    Stripe.js creates token
    (Card details sent directly to Stripe)
            |
            v
    Token returned to callback
            |
            v
    Token sent to backend
    (Card details never touch our server)
            |
            v
    Backend charges via Stripe API
            |
            v
    Account status updated
```

## User Flows

### Payment Flow

```
User navigates to /payment
            |
            v
    Payment form displayed
            |
            v
    User enters:
    - Card number
    - Expiry date
    - CVC
            |
            v
    User clicks Pay
            |
            v
    Stripe.js validates and tokenizes
            |
    +-------+-------+
    |               |
    v               v
Validation      Token created
error               |
    |               v
    v           Send to backend
Show error          |
message             v
                Backend charges
                    |
            +-------+-------+
            |               |
            v               v
        Success          Error
            |               |
            v               v
        Update          Show error
        account         message
        status
            |
            v
        Redirect to
        dashboard
```

### View Billing Flow

```
User navigates to /myaccount
            |
            v
    accountService.getBilling()
            |
            v
    Display billing info:
    - Account status
    - Subscription expiry
    - Payment history
            |
            v
    If Free/Unpaid:
    Show "Upgrade" button
            |
            v
    Click navigates to /payment
```

## Payment Details

| Item | Value |
|------|-------|
| Amount | $180.00 CAD |
| Currency | CAD |
| Description | Membership Payment |
| Receipt | Sent to user's email |

## Error Handling

| Error | Message |
|-------|---------|
| card_declined | Your card was declined |
| expired_card | Your card has expired |
| incorrect_cvc | Your CVC is incorrect |
| processing_error | An error occurred. Please try again |

## Acceptance Criteria Summary

| ID | Criteria | Status |
|----|----------|--------|
| PAY-01 | Card form displays | Implemented |
| PAY-02 | Card validation | Implemented |
| PAY-03 | Stripe tokenization | Implemented |
| PAY-04 | Token sent to backend | Implemented |
| PAY-05 | Success redirect | Implemented |
| PAY-06 | Error display | Implemented |
| PAY-07 | Billing info display | Implemented |
| PAY-08 | Account status update | Implemented |
