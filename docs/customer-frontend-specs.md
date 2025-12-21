# Customer Feature - Frontend Specification

## Overview

The Customer frontend feature handles customer registration, profile viewing, and customer-specific functionality within the Wedding Bidders platform.

## Architecture

- **Framework:** AngularJS 1.4.8
- **Component System:** ngX custom components
- **State Management:** Flux-like pattern

## Routes

| Route | Component | Description | Access |
|-------|-----------|-------------|--------|
| /customer/register | wb-customer-registration | Customer signup | Anonymous |
| /customer/myprofile | wb-customer-my-profile | View own profile | Customer |

## Components

### wb-customer-registration

**Location:** `/_src/app/components/wb-customer-registration.js`

**Description:** Container for customer registration flow.

**Template Structure:**

```html
<div class="customer-registration">
    <customer-registration-form></customer-registration-form>
</div>
```

**Acceptance Criteria:**
- AC1: Accessible without authentication
- AC2: Redirects to login on successful registration
- AC3: Shows error messages for validation failures

---

### wb-customer-registration-form

**Location:** `/_src/app/components/wb-customer-registration-form.js`

**Description:** Registration form for new customers.

**Form Fields:**

| Field | Type | Placeholder | Validation |
|-------|------|-------------|------------|
| firstname | text | First Name | Required |
| lastname | text | Last Name | Required |
| email | email | Email | Required, Email format |
| password | password | Password | Required, Min length |
| confirmPassword | password | Confirm Password | Must match password |

**Template:**

```html
<form class="customerRegistrationForm" name="registrationForm">
    <text-form-control placeholder='"First Name"'
                        model="vm.firstname">
    </text-form-control>
    <text-form-control placeholder='"Last Name"'
                        model="vm.lastname">
    </text-form-control>
    <text-form-control placeholder='"Email"'
                        model="vm.email">
    </text-form-control>
    <text-form-control placeholder='"Password"'
                        model="vm.password"
                        type="password">
    </text-form-control>
    <text-form-control placeholder='"Confirm Password"'
                        model="vm.confirmPassword"
                        type="password">
    </text-form-control>
    <button data-ng-click="vm.tryToRegister()">Register</button>
</form>
```

**Acceptance Criteria:**
- AC1: All fields required
- AC2: Email must be valid format
- AC3: Passwords must match
- AC4: Shows loading state during submission
- AC5: Displays server validation errors

---

### wb-customer-my-profile

**Location:** `/_src/app/components/wb-customer-my-profile.js`

**Description:** Customer's profile page showing their information and weddings.

**Display Sections:**

| Section | Content |
|---------|---------|
| Profile Info | Name, Email |
| Weddings | List of customer's weddings |
| Bids Received | Bids on customer's weddings |

**Acceptance Criteria:**
- AC1: Shows customer's profile information
- AC2: Lists their weddings
- AC3: Shows bids received on weddings
- AC4: Provides link to create new wedding

---

### wb-customer-weddings

**Location:** `/_src/app/components/wb-customer-weddings.js`

**Description:** List of weddings belonging to the customer.

---

### wb-customer-bids

**Location:** `/_src/app/components/wb-customer-bids.js`

**Description:** Bids received on customer's weddings.

## Service Layer

### customerService

**Location:** `/_src/app/services/customerService.js`

**Methods:**

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| add(options) | POST | /api/customer/add | Register customer |
| getAll() | GET | /api/customer/getAll | Get all customers (admin) |

**Sample Code:**

```javascript
function customerService($q, apiEndpoint, fetch) {
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

    self.getAll = function () {
        var deferred = $q.defer();
        fetch.fromService({
            method: "GET",
            url: self.baseUri + "/getAll"
        }).then(function (results) {
            deferred.resolve(results.data);
        });
        return deferred.promise;
    };

    self.baseUri = apiEndpoint.getBaseUrl() + "/customer";
    return self;
}
```

## Domain Model

### Customer

```javascript
{
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    profileId: number
}
```

### CustomerRegistrationRequest

```javascript
{
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    confirmPassword: string
}
```

## User Flows

### Registration Flow

```
Anonymous user visits /customer/register
            |
            v
    Registration form displayed
            |
            v
    User fills in:
    - First name
    - Last name
    - Email
    - Password
    - Confirm password
            |
            v
    User clicks Register
            |
            v
    customerService.add() called
            |
            v
    Backend creates:
    - User record
    - Account record
    - Profile record
    - Customer record
            |
            v
    On success:
    - Redirect to login page
    - Show success message
            |
            v
    On error:
    - Display validation errors
    - Email already exists
    - Password mismatch
```

### View Profile Flow

```
Customer navigates to /customer/myprofile
            |
            v
    Profile data loaded
            |
            v
    Display:
    - Profile information
    - Weddings list
    - Received bids
```

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| firstname | Required | First name is required |
| lastname | Required | Last name is required |
| email | Required, Email | Valid email required |
| password | Required, MinLength | Password must be at least 6 characters |
| confirmPassword | Must match password | Passwords do not match |

## Acceptance Criteria Summary

| ID | Criteria | Status |
|----|----------|--------|
| CF-01 | Customer can register | Implemented |
| CF-02 | Form validates all fields | Implemented |
| CF-03 | Email uniqueness checked | Implemented |
| CF-04 | Password confirmation required | Implemented |
| CF-05 | Redirect to login after registration | Implemented |
| CF-06 | Customer can view profile | Implemented |
| CF-07 | Profile shows weddings | Implemented |
| CF-08 | Profile shows received bids | Implemented |
