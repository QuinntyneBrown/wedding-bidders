# Wedding Bidders

A comprehensive platform that facilitates vendors bidding on weddings and events, connecting customers with service providers in a competitive marketplace.

## Overview

Wedding Bidders is a full-stack application built with .NET and Angular that enables:
- Customers to create wedding/event listings and receive competitive bids from vendors
- Vendors (caterers, photographers, DJs, event planners, etc.) to bid on events
- Real-time messaging and bidding through SignalR
- Subscription-based vendor accounts with Stripe integration
- Comprehensive admin tools for platform management

## Architecture

### Backend (.NET)

The backend follows a clean architecture pattern with three main projects:

- **WeddingBidders.Core** - Domain models, aggregates, and core business logic
- **WeddingBidders.Infrastructure** - EF Core implementation, migrations, and data access
- **WeddingBidders.Api** - REST API, MediatR commands/queries, and controllers

**Key Technologies:**
- .NET 8+
- Entity Framework Core
- MediatR for CQRS pattern
- SignalR for real-time communication
- JWT authentication
- SQL Express

### Frontend (Angular)

Modern Angular workspace using Material Design:

- **Location:** `src/WeddingBidders.WebApp`
- **Project:** `wedding-bidders`
- **UI Framework:** Angular Material (Material 3 guidelines)
- **State Management:** RxJS (no NgRx or signals)
- **Styling:** SCSS with BEM methodology and design tokens

**Key Technologies:**
- Angular 21+
- Angular Material
- RxJS
- Jest for unit testing
- Playwright for E2E testing

## Project Structure

```
wedding-bidders/
├── src/
│   ├── WeddingBidders.Api/           # REST API and controllers
│   ├── WeddingBidders.Core/          # Domain models and business logic
│   ├── WeddingBidders.Infrastructure/ # Data access and EF Core
│   └── WeddingBidders.WebApp/        # Angular frontend workspace
├── docs/                              # Technical specifications
│   ├── specs/                         # Implementation specifications
│   ├── *-backend-specs.md            # Backend feature specs
│   └── *-frontend-specs.md           # Frontend feature specs
└── README.md
```

## Getting Started

### Prerequisites

- .NET 8 SDK or later
- Node.js 20+ and npm 10+
- SQL Server Express (or SQL Server)
- Git

### Backend Setup

1. Navigate to the API project:
   ```bash
   cd src/WeddingBidders.Api
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Update database connection string in configuration files

4. Apply migrations:
   ```bash
   dotnet ef database update
   ```

5. Run the API:
   ```bash
   dotnet run
   ```

### Frontend Setup

1. Navigate to the web app:
   ```bash
   cd src/WeddingBidders.WebApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the backend API URL in the application configuration

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser to `http://localhost:4200`

## Features

### For Customers
- Create and manage wedding/event listings
- Receive and compare bids from multiple vendors
- Real-time messaging with vendors
- Review vendor profiles and galleries
- Manage event details and requirements

### For Vendors
- Browse available weddings and events
- Submit competitive bids
- Manage bidder profiles with descriptions and galleries
- Real-time notifications for new opportunities
- Subscription-based access with Stripe payments

### For Administrators
- Manage users (customers and bidders)
- Monitor platform activity
- Handle support issues
- Oversee conversations and bids
- Manage subscriptions and payments

## Testing

### Frontend Tests

```bash
# Unit tests with Jest
npm test

# Watch mode
npm run test:watch

# E2E tests with Playwright
npm run e2e

# E2E with UI mode
npm run e2e:ui
```

### Backend Tests

```bash
# Run all tests
dotnet test
```

## Documentation

Detailed specifications are available in the `/docs` directory:

- [Implementation Specifications](docs/specs/implementstion-specs.md) - System-wide technical guidelines
- **Identity:** [Backend](docs/specs/identity-backend-specs.md) | [Frontend](docs/specs/identity-frontend-specs.md)
- **Bidding:** [Backend](docs/bidding-backend-specs.md) | [Frontend](docs/bidding-frontend-specs.md)
- **Messaging:** [Backend](docs/messaging-backend-specs.md) | [Frontend](docs/messaging-frontend-specs.md)
- **Weddings:** [Backend](docs/wedding-backend-specs.md) | [Frontend](docs/wedding-frontend-specs.md)
- **Profiles:** [Backend](docs/profile-backend-specs.md) | [Frontend](docs/profile-frontend-specs.md)
- **Payments:** [Frontend](docs/payment-frontend-specs.md)
- **Customer:** [Backend](docs/customer-backend-specs.md) | [Frontend](docs/customer-frontend-specs.md)
- **Bidder:** [Backend](docs/bidder-backend-specs.md) | [Frontend](docs/bidder-frontend-specs.md)
- **Admin:** [Frontend](docs/admin-frontend-specs.md)
- **Accounts:** [Backend](docs/account-backend-specs.md)
- **Issues:** [Backend](docs/issue-backend-specs.md)
- **Subscriptions:** [Backend](docs/subscription-backend-specs.md)

## Technical Highlights

- **Flattened Namespaces** - Simplified project structure
- **No AutoMapper** - Manual mapping with extension methods for better control
- **One Type Per File** - Enhanced code organization and maintainability
- **CQRS Pattern** - Clean separation of commands and queries using MediatR
- **Real-time Features** - SignalR hubs for bidding, messaging, and notifications
- **Mobile-First Responsive Design** - Optimized for all device sizes
- **Material 3 Design System** - Consistent, modern UI/UX

## Contributing

This project follows strict architectural guidelines documented in the specifications. Please review the [Implementation Specifications](docs/specs/implementstion-specs.md) before contributing.

## License

Copyright (c) Quinntyne Brown. All rights reserved.

Licensed under the MIT License. See [LICENSE.txt](LICENSE.txt) for details.