# Subscription Feature - Backend Specification

## Overview

The Subscription feature handles payment processing for premium memberships using Stripe. Users can upgrade their account status from Free to Paid by completing a payment.

## Data Model

### Subscription Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| AccountId | int | Foreign key to Account | Required |
| PlanId | int | Foreign key to Plan | Required |
| EffectiveDate | DateTime | Subscription start date | Required |
| ExpiryDate | DateTime | Subscription end date | Required |
| Payments | ICollection<Payment> | Associated payments | Navigation property |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |

### Payment Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| AccountId | int | Foreign key to Account | Required |
| Amount | float | Payment amount | Required |
| DateTime | DateTime | Payment timestamp | Required |
| IsDeleted | bool | Soft delete flag | Inherited from BaseEntity |

### Plan Entity

| Property | Type | Description | Constraints |
|----------|------|-------------|-------------|
| Id | int | Primary key | Auto-generated |
| Description | string | Plan description | Required |
| Price | decimal | Plan price | Required |
| Subscriptions | ICollection<Subscription> | Plan subscriptions | Navigation property |

## DTOs

### SubscriptionChargeDto

```csharp
public class SubscriptionChargeDto
{
    public string Token { get; set; }  // Stripe token
}
```

## API Endpoints

### POST /api/subscription/charge

**Description:** Processes a payment using Stripe and upgrades the user's account status.

**Authorization:** Requires authentication

**Request Body:**

```json
{
  "token": "tok_visa_xxxxxxxxxxxx"
}
```

**Response:** 200 OK

**Acceptance Criteria:**
- AC1: Processes payment via Stripe API
- AC2: Charges $180 CAD for membership
- AC3: Updates AccountStatus to Paid on success
- AC4: Sends receipt email to user
- AC5: Returns 200 OK on successful payment
- AC6: Throws exception if Stripe charge fails

**Sample Code:**

```csharp
[HttpPost]
[Route("charge")]
public IHttpActionResult Charge(SubscriptionChargeDto subscriptionChargeDto)
{
    this.subscriptionService.Charge(User.Identity.Name, subscriptionChargeDto);
    return Ok();
}
```

## Service Implementation

### SubscriptionService

```csharp
public class SubscriptionService : ISubscriptionService
{
    public SubscriptionService(IWeddingBiddersUow uow)
    {
        this.uow = uow;
    }

    public void Charge(string username, SubscriptionChargeDto subscriptionChargeDto)
    {
        var chargeOptions = new StripeChargeCreateOptions()
        {
            Amount = 18000,  // $180.00 in cents
            Currency = "cad",
            Source = new StripeSourceOptions() {
                TokenId = subscriptionChargeDto.Token
            },
            Description = "Membership Payment",
            ReceiptEmail = username
        };

        var chargeService = new StripeChargeService();
        var stripeCharge = chargeService.Create(chargeOptions);

        var user = uow.Users.GetAll()
            .Include(x => x.Accounts)
            .Include("Accounts.Profiles")
            .Single(x => x.Username == username);

        var account = user.Accounts.First();
        account.AccountStatus = AccountStatus.Paid;
        uow.SaveChanges();
    }

    protected readonly IWeddingBiddersUow uow;
}
```

## Stripe Integration

### Configuration

Stripe API keys are configured in the application settings:

```csharp
// In Startup or Configuration
StripeConfiguration.SetApiKey("sk_live_xxxxx");
```

### Charge Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Amount | 18000 | $180.00 CAD (in cents) |
| Currency | cad | Canadian Dollars |
| Description | Membership Payment | Charge description |
| ReceiptEmail | (user's email) | Email for receipt |

### Stripe Token Flow

```
Frontend (Credit Card Form)
           |
           v
    Stripe.js tokenization
           |
           v
    Token sent to backend
           |
           v
    POST /api/subscription/charge
           |
           v
    StripeChargeService.Create()
           |
           v
    Account status updated
```

## Payment Flow

```
User on Payment Page
        |
        v
Enter credit card details
        |
        v
Stripe.js creates token
        |
        v
POST /api/subscription/charge
        |
        v
SubscriptionService.Charge()
        |
        +---> Create Stripe charge
        |
        +---> Update AccountStatus = Paid
        |
        v
Return success to frontend
        |
        v
Redirect to dashboard
```

## Entity Configuration

### Subscription

```csharp
public class Subscription : BaseEntity
{
    public int AccountId { get; set; }
    public int PlanId { get; set; }
    public DateTime EffectiveDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public ICollection<Payment> Payments { get; set; }
}
```

### Payment

```csharp
public class Payment : BaseEntity
{
    public int AccountId { get; set; }
    public float Amount { get; set; }
    public DateTime DateTime { get; set; }
}
```

## Relationships

```
Account (1) -----> (N) Subscription
Subscription (1) -----> (N) Payment
Plan (1) -----> (N) Subscription
```

## Business Rules

1. **Fixed Price:** Membership costs $180 CAD
2. **Stripe Tokens:** Frontend must generate Stripe token before calling API
3. **Email Receipt:** Stripe sends receipt to user's email
4. **Account Update:** Successful payment updates AccountStatus to Paid
5. **Error Handling:** Stripe errors should be properly handled and reported

## AccountStatus Transition

| From | To | Trigger |
|------|-----|---------|
| Free | Paid | Successful payment |
| Unpaid | Paid | Successful payment |

## Error Handling

Potential Stripe errors to handle:

| Error | Description |
|-------|-------------|
| card_declined | Card was declined |
| expired_card | Card has expired |
| incorrect_cvc | CVC code incorrect |
| processing_error | Processing error at Stripe |
| insufficient_funds | Insufficient funds |

## Security Considerations

1. **Token-Based:** Credit card details never touch the server
2. **HTTPS Required:** All payment requests must use HTTPS
3. **Server-Side Keys:** Stripe secret key only used server-side
4. **PCI Compliance:** Stripe handles PCI compliance

## Frontend Integration

The payment page uses Angular Payments for Stripe integration:

| Component | Purpose |
|-----------|---------|
| wb-payment | Payment page container |
| angular-payments | Stripe.js wrapper |

## Dependencies

- **Stripe SDK:** `Stripe.net` NuGet package
- **SubscriptionService:** Payment processing logic
- **WeddingBiddersUow:** Unit of Work for data access
- **Entity Framework:** For data persistence
