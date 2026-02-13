# Buy & Bye

A monorepo marketplace application with a React web app, React Native mobile app, and a shared core business logic package.

## Project Structure

```
BuyAndBye/
├── apps/
│   ├── web/                  # React + Vite web application
│   └── mobile/               # React Native + Expo mobile app
├── packages/
│   └── core/                 # Shared business logic (framework-agnostic)
├── docker-compose.yml
├── tsconfig.base.json        # Shared TypeScript config
└── package.json              # Bun workspace root
```

### `packages/core`

Framework-agnostic business logic shared between web and mobile. Built with Clean Architecture:

```
core/src/
├── modules/
│   ├── auth/
│   │   ├── domain/           # Entities, DTOs, repository interfaces
│   │   ├── application/      # Use cases (Login, Register, Logout)
│   │   └── infrastructure/   # API client, mappers, repositories, DI container
│   └── users/
│       ├── domain/           # DTOs, repository interfaces, use cases
│       ├── application/      # Use cases (BecomeSeller)
│       └── infrastructure/   # API client, mappers, repositories, DI container
└── shared/
    ├── services/http/        # HttpClient (axios-based)
    ├── types/                # ApiError, ApiException, notification types
    └── config/               # EnvConfig interface
```

Platform-specific concerns (token storage, environment config) are abstracted via interfaces — each app provides its own implementation.

### `apps/web`

React 18 SPA built with Vite and TailwindCSS.

```
web/src/
├── app/                      # Entry point, providers, router
├── modules/
│   ├── auth/                 # Login, Register pages + auth context
│   ├── users/                # Profile, Become Seller pages
│   ├── products/             # Product catalog (domain + presentation)
│   └── home/                 # Landing page
└── shared/                   # Navbar, Snackbar, token storage, env config
```

### `apps/mobile`

React Native app using Expo SDK 54 and Expo Router for file-based navigation.

```
mobile/
├── app/                      # Expo Router screens
│   ├── (auth)/               # Login, Register screens
│   └── (main)/               # Home, Profile, Become Seller (tab navigator)
└── src/
    ├── components/           # React Native UI components
    ├── providers/            # AuthProvider (uses SecureStore for tokens)
    └── infrastructure/       # SecureTokenStorage, env config
```

## Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- [Docker](https://www.docker.com/) (for containerized web deployment)
- [Expo CLI](https://docs.expo.dev/) (for mobile development)

## Getting Started

### Install dependencies

```bash
bun install
```

### Web

```bash
# Development
cd apps/web
bun run dev

# Type check
bun run typecheck

# Production build
bun run build
```

### Mobile

```bash
cd apps/mobile
bun run start          # Expo dev server
bun run ios            # iOS simulator
bun run android        # Android emulator
```

### Docker

```bash
# Build and run the web app
docker compose up web

# With custom environment variables
VITE_API_BASE_URL=https://api.example.com/v1 \
VITE_BACKEND_BASE_URL=https://api.example.com \
docker compose up web --build
```

The web app will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` | Backend API endpoint |
| `VITE_BACKEND_BASE_URL` | `http://localhost:8000` | Backend base URL (for assets) |
| `VITE_APP_NAME` | `Buy & Bye` | Application display name |
| `VITE_APP_ENV` | `production` | Environment (`development` / `production`) |

## Tech Stack

| Layer | Technology |
|---|---|
| Shared core | TypeScript, Axios |
| Web | React 18, Vite, TailwindCSS, React Router |
| Mobile | React Native, Expo 54, Expo Router |
| Deployment | Docker, nginx |
| Package manager | Bun (workspaces) |
