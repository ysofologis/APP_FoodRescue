# Community Food Rescue & Redistribution Network

Portfolio DDD Demonstration (NestJS + Angular)

## Project Structure

```
food_rescue_network/
├── backend/          # NestJS DDD backend
│   ├── src/
│   │   ├── donor/        # Bounded context: Donor Management
│   │   ├── recipient/    # Bounded context: Recipient & Matching
│   │   ├── logistics/    # Bounded context: Logistics & Transport
│   │   ├── trust/        # Bounded context: Trust & Verification
│   │   ├── analytics/    # Bounded context: Impact Analytics
│   │   └── shared/       # Shared kernel, API contracts, config
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── frontend/         # Angular DDD frontend (TBD)
├── docker-compose.yml
└── README.md
```

## Bounded Contexts

| Context      | Responsibility                              |
|--------------|---------------------------------------------|
| Donor        | Manage donor orgs and food listings          |
| Recipient    | Manage recipient orgs and matching           |
| Logistics    | Driver assignment, route optimization, delivery |
| Trust        | Verification, blacklisting, disputes        |
| Analytics    | Impact metrics, reports, public dashboard   |

## Getting Started

```bash
cd backend
npm install
npm run start:dev
```

## Tech Stack

- **Backend:** NestJS 11+, TypeScript, TypeORM, SQLite
- **Frontend:** Angular 19+ (planned)
- **Events:** NestJS EventEmitter2
- **Testing:** Jest + Supertest
