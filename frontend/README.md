# Frontend — Food Rescue Network (Pure DDD)

Angular 19+ frontend demonstrating Domain-Driven Design in the UI layer.

## Key DDD Principles Applied

- Feature modules aligned 1:1 with bounded contexts
- Ubiquitous language in component/service names
- Domain services encapsulate business rules
- Bounded-context-scoped state (Signals)
- Anti-corruption layer between UI and backend

## Package / Folder Structure

```
src/app/
├── donor-feature/
├── recipient-feature/
├── logistics-feature/
├── trust-feature/
├── analytics-feature/
├── core/          # Shared infrastructure (HTTP client, ACL)
└── shared/        # Cross-cutting UI components
```

## Running

```bash
npm install
npm start
```

## Testing

```bash
npm test
```
