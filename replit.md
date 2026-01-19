# Medi-Ops

## Overview

Medi-Ops is a hyperlocal pharmacy support platform designed for elderly care focused pharmacies. It provides tools for managing consumers (patients), inventory tracking, and analytics dashboards. The application is a full-stack TypeScript solution with React frontend and Express backend, using PostgreSQL for data persistence and Replit Auth for authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Charts**: Recharts for analytics visualization
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **API Design**: RESTful endpoints defined in shared routes with Zod schemas for validation

### Data Storage
- **Database**: PostgreSQL (provisioned via Replit)
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)
- **Key Tables**:
  - `users` and `sessions` - Authentication (required for Replit Auth)
  - `consumers` - Patient/customer records
  - `inventory` - Medical product stock management
  - `analytics` - Usage metrics

### Authentication Flow
- Replit Auth handles user authentication via OpenID Connect
- Sessions stored in PostgreSQL `sessions` table
- Protected routes check `req.isAuthenticated()` middleware
- User data synced to `users` table on login

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including shadcn/ui
    pages/        # Route page components
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  replit_integrations/auth/  # Replit Auth setup
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod
  models/         # Data models including auth
```

### Build System
- **Development**: Vite dev server with HMR, tsx for server
- **Production**: Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Scripts**: `npm run dev` (development), `npm run build` (production build), `npm run db:push` (sync schema)

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Required Environment Variables**:
  - `DATABASE_URL` - PostgreSQL connection string
  - `SESSION_SECRET` - Session encryption key
  - `ISSUER_URL` - Replit OIDC issuer (defaults to https://replit.com/oidc)
  - `REPL_ID` - Replit application identifier

### UI Framework
- **shadcn/ui**: Component library configured in `components.json`
- **Radix UI**: Accessible primitive components
- **Tailwind CSS**: Utility-first CSS framework

### Key NPM Packages
- `@tanstack/react-query` - Server state management
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema validation
- `express` / `express-session` - HTTP server and session management
- `passport` - Authentication middleware
- `recharts` - Data visualization
- `framer-motion` - Animations
- `date-fns` - Date formatting
- `zod` - Runtime type validation