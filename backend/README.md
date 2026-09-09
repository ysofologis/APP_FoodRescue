# Food Rescue Backend — NestJS DDD

NestJS backend for the Community Food Rescue & Redistribution Network.

## Architecture

- **Bounded Contexts**: donor, recipient, logistics, trust, analytics
- **Pattern**: Hexagonal / Ports & Adapters
- **Database**: SQLite (File Mode) for dev, swappable for production
- **Events**: NestJS EventEmitter2 for domain events
- **Testing**: Jest + Supertest

## Project Structure

```
src/
├── donor/              # Bounded Context: Donor Management
│   ├── domain/
│   │   ├── aggregates/     # Rich domain models
│   │   ├── value-objects/  # Immutable value types
│   │   ├── events/         # Domain events
│   │   ├── repositories/   # Repository interfaces
│   │   └── services/       # Domain services
│   ├── application/
│   │   ├── commands/       # Command handlers (CQRS)
│   │   ├── queries/        # Query handlers (CQRS)
│   │   └── dto/            # Data transfer objects
│   └── infrastructure/
│       ├── repositories/   # DB implementations
│       └── event-publishers/
├── recipient/          # Bounded Context: Recipient & Matching
├── logistics/          # Bounded Context: Logistics & Transport
├── trust/              # Bounded Context: Trust & Verification
├── analytics/          # Bounded Context: Impact Analytics
└── shared/             # Shared kernel, API contracts, config
```

## Getting Started

```bash
cd backend
npm install
npm run start:dev
```

## Key Domain Events

- `donor.created` — New donor registered
- `food-listing.created` — Food listing created by donor
- `food-listing.claimed` — Recipient claimed a listing
- `distribution.run.created` — New logistics run scheduled
- `impact.recorded` — Impact metrics recorded
