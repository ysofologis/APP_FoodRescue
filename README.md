# 🍎 Community Food Rescue & Redistribution Network

> A hyperlocal platform connecting food donors with communities in need — built for the common good, not for profit.

---

## 🌍 Mission & Vision

### The Problem We're Solving

Food waste and food insecurity are two sides of the same coin — and they exist in the same neighborhoods:

- **One-third of all food produced globally** is wasted — roughly **1.3 billion tons** per year
- In the US alone, **40% of food** goes uneaten, while **1 in 8 Americans** faces food insecurity
- Surplus food from restaurants, grocery stores, farms, and households rots in landfills, generating **methane** — a greenhouse gas 80× more potent than CO₂
- Meanwhile, community food banks, shelters, and mutual aid networks struggle with **logistics, trust, and coordination**

The existing solutions are broken:

- **Food banks** rely on manual coordination, limited transport, and ad-hoc volunteer networks
- **Apps like Too Good To Go** focus on consumer surplus at a discount — they don't serve the most vulnerable populations
- **Government programs** are underfunded, slow, and disconnected from local food sources
- **Donors** (restaurants, grocery stores, farms) have no easy way to connect surplus food to people who need it most

### Our Vision

ReWear (now ReFeed) exists to prove that **technology can close the loop between surplus and need** — without profiting from either side. We're building a platform where:

- **Donors** (restaurants, grocery stores, farms, households) can list surplus food in minutes
- **Recipients** (shelters, food banks, community kitchens, families) can find and claim what they need
- **Logistics** are coordinated locally — drivers, volunteers, and community members pick up and deliver
- **Trust** is built through verification, ratings, and transparent tracking
- **Impact** is measurable — every pound rescued is tracked and reported

This is not a marketplace. There are no transaction fees, no commissions, no ads. ReFeed is a **community utility** — open, transparent, and built for the common good.

### Why "ReFeed"?

Because the most impactful food rescue is the one that happens locally, quickly, and without friction. ReFeed connects the dots between surplus and need in real time — reducing waste, feeding people, and building stronger communities.

---

## 📖 The Problem in Detail

### Food Waste Crisis

| Stat | Value |
|------|-------|
| Global food waste per year | ~1.3 billion tons |
| US food waste per year | ~40 million tons |
| Share of US food that goes uneaten | 40% |
| Greenhouse gas emissions from food waste | 8-10% of global total |
| Water used to grow wasted food | ~25% of all agricultural water |

### Food Insecurity Crisis

| Stat | Value |
|------|-------|
| Americans facing food insecurity | ~1 in 8 (34 million) |
| Children in food-insecure households | ~12 million |
| Food banks reporting increased demand (post-2020) | 60%+ |
| Average distance food travels from farm to plate | 1,500 miles |

### The Gap

The infrastructure to rescue surplus food and deliver it to people in need **already exists** — but it's fragmented, manual, and slow. A restaurant with 50 lbs of surplus produce at 9 PM has no way to connect that to a shelter 3 miles away that needs it tonight. ReFeed bridges that gap.

---

## 🎯 Who Is This For?

| Persona | Need | How ReFeed Helps |
|---------|------|------------------|
| **Restaurant owners** | Reduce waste disposal costs, do good | List surplus food in 2 minutes; track impact |
| **Grocery stores** | Manage overstock, avoid landfill fees | Real-time listings; automatic matching to nearby recipients |
| **Farmers** | Sell or donate excess harvest | List surplus produce; connect to food banks and community kitchens |
| **Households** | Reduce household food waste | List what they won't use; neighbors pick up for free |
| **Food banks & shelters** | Find reliable food sources | Browse available surplus; claim what they need; track deliveries |
| **Community kitchens** | Source ingredients for meals | Discover nearby surplus; plan menus around what's available |
| **Volunteers & drivers** | Help with transport | Accept pickup/delivery requests; route optimization |
| **Municipalities** | Reduce waste, meet sustainability goals | Public dashboard with impact metrics; data for policy decisions |

---

## 🏗 Architecture — Domain-Driven Design

### Why DDD?

Food rescue is a **complex domain** with multiple stakeholders, each with their own language, rules, and workflows. A monolithic "everything in one service" approach would create a tangled mess of concerns. DDD gives us:

- **Bounded contexts** — each stakeholder's world is modeled separately
- **Ubiquitous language** — the code speaks the domain's language
- **Clear boundaries** — donors, recipients, logistics, and trust evolve independently
- **Testability** — each context can be validated in isolation

### Bounded Contexts

```
┌─────────────────────────────────────────────────────────────┐
│                   Food Rescue Network                        │
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  Donor    │  │  Recipient    │  │   Logistics          │  │
│  │ Context   │  │  Context      │  │   Context            │  │
│  │           │  │               │  │                      │  │
│  │ • Orgs    │  │ • Orgs        │  │ • Drivers            │  │
│  │ • Listings│  │ • Matching    │  │ • Routes             │  │
│  │ • Surplus │  │ • Claims      │  │ • Deliveries         │  │
│  │ • Hours   │  │ • Preferences │  │ • Status tracking    │  │
│  └─────┬────┘  └──────┬────────┘  └──────────┬───────────┘  │
│        │               │                       │              │
│        └───────────────┼───────────────────────┘              │
│                        │                                      │
│                   ┌────▼────┐                                 │
│                   │  Events  │                                 │
│                   │ (EventEmitter2)                           │
│                   └────┬────┘                                 │
│                        │                                      │
│        ┌───────────────┼───────────────────┐                  │
│        ▼               ▼                   ▼                  │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│  │  Trust    │  │  Analytics   │  │  Shared Kernel       │    │
│  │ Context   │  │  Context     │  │  (API contracts,     │    │
│  │           │  │              │  │   config, common     │    │
│  │ • Verify  │  │ • Impact     │  │   utilities)         │    │
│  │ • Blacklist│ │   metrics    │  │                      │    │
│  │ • Dispute │  │ • Reports    │  │                      │    │
│  │   engine  │  │ • Dashboard  │  │                      │    │
│  └──────────┘  └──────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Bounded Contexts Detail

| Context | Responsibility | Key Entities |
|---------|---------------|--------------|
| **Donor** | Manage donor organizations and food listings | Donor, FoodListing, SurplusBatch, OperatingHours |
| **Recipient** | Manage recipient organizations and matching logic | Recipient, NeedRequest, Match, Claim |
| **Logistics** | Driver assignment, route optimization, delivery tracking | Driver, Route, Delivery, Pickup, DeliveryStatus |
| **Trust** | Verification, blacklisting, dispute resolution | Verification, BlacklistEntry, Dispute, TrustScore |
| **Analytics** | Impact metrics, reports, public dashboard | ImpactMetric, Report, DashboardData |
| **Shared** | API contracts, configuration, common utilities | Event contracts, DTOs, middleware, database config |

### Domain Events

The system communicates across bounded contexts through **domain events**:

| Event | Fired By | Consumed By | Purpose |
|-------|----------|-------------|---------|
| `FoodListed` | Donor | Recipient, Analytics | New surplus available for matching |
| `MatchCreated` | Recipient | Logistics, Analytics | A recipient claimed a listing |
| `PickupAssigned` | Logistics | Donor, Recipient | Driver assigned to a pickup |
| `DeliveryCompleted` | Logistics | Analytics, Trust | Food delivered; impact recorded |
| `DisputeRaised` | Trust | Recipient, Donor | A conflict needs resolution |
| `TrustScoreUpdated` | Trust | Analytics | Reputation changed |

---

## 🛠 Technical Specifications

### Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Backend Framework** | NestJS 11+ | Enterprise-grade, modular architecture, built-in DI, excellent TypeScript support, native DDD support with modules |
| **ORM** | TypeORM | Mature, well-integrated with NestJS, supports SQLite for dev and PostgreSQL for production |
| **Database** | SQLite (dev) / PostgreSQL (prod) | SQLite for zero-config local development; PostgreSQL for production reliability and JSON support |
| **Frontend** | Angular 19+ (planned) | Strong typing, reactive forms, modular architecture — mirrors backend DDD structure |
| **Events** | NestJS EventEmitter2 | In-process event bus for domain events across bounded contexts |
| **Testing** | Jest + Supertest | Unit tests for services, integration tests for controllers |
| **Containerization** | Docker Compose | Reproducible environments, easy local development |
| **API Documentation** | Swagger/OpenAPI | Auto-generated, interactive docs |

### Why This Stack?

#### NestJS for DDD

NestJS is the best fit for DDD in the Node.js ecosystem because:

- **Modules map to bounded contexts** — each context is a NestJS module with its own controllers, services, and entities
- **Dependency injection** is built-in and first-class — services can be injected cleanly across context boundaries (via the shared kernel)
- **Guards and interceptors** handle cross-cutting concerns (auth, logging, validation) without polluting domain logic
- **EventEmitter2** provides a simple, reliable mechanism for domain events

#### TypeORM

- Supports both SQLite (for fast, zero-config local dev) and PostgreSQL (for production)
- Entity definitions map cleanly to domain models
- Migrations keep schema changes versioned

#### SQLite for Development

- Zero configuration — no Docker needed for local dev
- Fast startup, easy reset
- Swappable with PostgreSQL via the same TypeORM config

### Development Workflow

```bash
# Start the backend
cd backend
npm install
npm run start:dev

# Run tests
npm test

# Production build
npm run build
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+**
- **Docker & Docker Compose** (for PostgreSQL in production mode)
- **npm** (comes with Node.js)

### Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd food_rescue_network

# Start the backend
cd backend
npm install
npm run start:dev
```

The backend will start on `http://localhost:3000` with Swagger docs at `http://localhost:3000/api`.

### Environment

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=sqlite://./food_rescue.db
PORT=3000
NODE_ENV=development
```

---

## 📁 Project Structure

```
food_rescue_network/
├── backend/                    # NestJS DDD backend
│   ├── src/
│   │   ├── donor/              # Bounded context: Donor Management
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   ├── dto/
│   │   │   └── index.ts
│   │   ├── recipient/          # Bounded context: Recipient & Matching
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   ├── dto/
│   │   │   └── index.ts
│   │   ├── logistics/          # Bounded context: Logistics & Transport
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   ├── dto/
│   │   │   └── index.ts
│   │   ├── trust/              # Bounded context: Trust & Verification
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   ├── dto/
│   │   │   └── index.ts
│   │   ├── analytics/          # Bounded context: Impact Analytics
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   ├── dto/
│   │   │   └── index.ts
│   │   ├── shared/             # Shared kernel, API contracts, config
│   │   │   ├── events/         # Domain event definitions
│   │   │   ├── dto/            # Shared DTOs
│   │   │   ├── config/         # App config, database config
│   │   │   └── utils/          # Common utilities
│   │   └── main.ts             # Application entry point
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── frontend/                   # Angular DDD frontend (TBD)
├── docker-compose.yml
└── README.md
```

---

## 📊 Impact Metrics

ReFeed tracks measurable impact to demonstrate the platform's value to communities and funders:

| Metric | Description |
|--------|-------------|
| **Pounds rescued** | Total food weight diverted from landfills |
| **Meals provided** | Estimated meals from rescued food (1 lb ≈ 2 meals) |
| **CO₂ avoided** | Methane emissions prevented by diverting food from landfills |
| **Water saved** | Agricultural water saved by not wasting food |
| **Active donors** | Number of organizations and households listing surplus |
| **Active recipients** | Number of shelters, food banks, and community kitchens served |
| **Deliveries completed** | Total successful pickups and deliveries |
| **Average response time** | Time from listing to first claim (measures platform efficiency) |

---

## 🔒 Trust & Safety

Trust is the foundation of a food rescue platform. ReFeed includes:

- **Verification system** — donors and recipients can be verified (business license, nonprofit status, etc.)
- **Trust scores** — ratings from completed exchanges build reputation over time
- **Blacklist engine** — bad actors are flagged and excluded from the network
- **Dispute resolution** — a structured process for resolving conflicts between parties
- **Photo verification** — listings include photos so recipients know what to expect
- **No personal data sharing** — communication happens through the platform; contact details are never exposed

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For questions, feature requests, or issues:

- Open an issue on GitHub
- Reach out to the maintainers

---

*Built with ❤️ for a community where no food goes to waste and no one goes hungry.*
