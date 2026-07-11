# AutoVault — Car Dealership Inventory System

A full-stack inventory management system for car dealerships. Browse, search, purchase vehicles, and manage inventory with an admin panel.

## Tech Stack

**Backend:** Java 17, Spring Boot 3.3.5, Spring Data JPA, H2 (dev) / PostgreSQL (prod), JWT auth, Maven

**Frontend:** React 19, Vite 8, Tailwind CSS 4, Framer Motion, React Router 7, Axios, React Hot Toast, React Icons

**Testing:** JUnit 5 + Mockito (backend — 71 tests), Vitest + React Testing Library (frontend — 31 tests)

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+

### Backend

```bash
cd backend
mvn spring-boot:run
```

Starts on `http://localhost:8080`.

Dev credentials: `admin@dealership.com` / `admin123`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Starts on `http://localhost:5173` and proxies API calls to the backend.

## Features

- **Public:** Browse vehicle inventory, search by make/model/category/price range
- **Authenticated users:** Purchase vehicles
- **Admin users:** Add, edit, delete vehicles; restock inventory
- **Auth:** JWT-based registration and login with role-based access control

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/vehicles` | — | List all vehicles |
| GET | `/api/vehicles/search` | — | Search with filters |
| GET | `/api/vehicles/{id}` | — | Get vehicle by ID |
| POST | `/api/vehicles` | Admin | Add vehicle |
| PUT | `/api/vehicles/{id}` | Admin | Update vehicle |
| DELETE | `/api/vehicles/{id}` | Admin | Delete vehicle |
| POST | `/api/vehicles/{id}/purchase` | User | Purchase vehicle |
| POST | `/api/vehicles/{id}/restock` | Admin | Restock vehicle |

## Running Tests

```bash
# Backend (71 tests)
cd backend && mvn test

# Frontend (31 tests)
cd frontend && npm test
```

## Project Structure

```
├── backend/
│   ├── src/main/java/com/dealership/inventory/
│   │   ├── config/          # Security, JWT config
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Global exception handler
│   │   ├── repo/            # Spring Data repositories
│   │   └── service/         # Business logic
│   └── src/test/java/       # 71 tests
└── frontend/
    └── src/
        ├── api/             # Axios instance with JWT interceptor
        ├── components/      # Navbar, SearchBar, VehicleForm, ProtectedRoute, AdminRoute
        ├── context/         # AuthContext (login, register, logout)
        └── pages/           # HomePage, LoginPage, RegisterPage, AdminPage
```

## My AI Usage

I used AI (opencode with Claude) as a coding assistant throughout this project. Here's a summary of how:

**Planning and architecture:** I described the project requirements and asked the AI to help plan the file structure, API design, and component hierarchy. The AI helped identify the minimal set of components and routes needed.

**Test-first development:** I followed TDD with the AI writing RED tests first (committing them), then GREEN implementations. The AI was particularly useful for generating comprehensive test cases — it caught edge cases I might have missed, like testing error states, loading states, and role-based access.

**Backend fixes:** The AI diagnosed the Lombok annotation processor issue (missing `annotationProcessorPaths` in `pom.xml`) that was preventing compilation, and fixed the configuration metadata type mismatch — both bugs I hadn't caught yet.

**Frontend implementation:** The AI scaffolded the initial React components, wired up routing with React Router, configured Tailwind CSS v4 (which uses a new CSS-based config), and built out the full admin panel with vehicle CRUD operations.

**Debugging:** When tests failed, the AI quickly identified root causes — like a test expecting inline error text when the component only used toast notifications, or DOM queries returning multiple matching elements — and fixed them with minimal changes.

**What I did myself:** All product decisions (what features to build, what the UI should look like, the teal/cream color scheme), code review of every change, and final verification that everything worked together. The AI was a tool for execution speed, not decision-making.

## Test Report

| Suite | Tests | Passing | Failing |
|-------|-------|---------|---------|
| Backend | 71 | 71 | 0 |
| Frontend | 31 | 31 | 0 |
| **Total** | **102** | **102** | **0** |
