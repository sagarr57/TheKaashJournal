# Admin Module

A self-contained module for admin dashboard functionality, authentication, and analytics.

## Structure

```
modules/admin/
├── auth/              # Authentication logic
│   ├── index.ts       # Auth utilities (isAuthenticated, logout, etc.)
│   └── LoginForm.tsx  # Login form component
├── components/        # Admin-specific components
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── lib/               # Admin utilities
│   └── analytics.ts  # Analytics API client
├── pages/             # Admin pages
│   ├── Dashboard.tsx # Main dashboard page
│   └── Login.tsx     # Login page
├── types/             # TypeScript types
│   └── index.ts      # Type definitions
├── index.ts          # Module exports
└── README.md         # This file
```

## Usage

### Import from module

```typescript
// Import pages
import { AdminDashboard, AdminLogin } from "@/modules/admin";

// Import auth utilities
import { isAuthenticated, logout } from "@/modules/admin";

// Import components
import { ProtectedRoute } from "@/modules/admin";

// Import types
import type { AnalyticsData } from "@/modules/admin";
```

### Using in routes

```typescript
import { AdminDashboard, AdminLogin } from "@/modules/admin";

<Route path="/admin/login" component={AdminLogin} />
<Route path="/admin" component={AdminDashboard} />
```

## Features

- **Authentication**: Password-based auth with session management
- **Protected Routes**: Automatic redirect to login if not authenticated
- **Analytics Dashboard**: Real-time analytics with charts and metrics
- **Modular Design**: Self-contained, easy to maintain and extend

## Authentication

The module uses session-based authentication:

- Password stored in `VITE_ADMIN_PASSWORD` environment variable
- Session stored in `sessionStorage`
- Session expires after 8 hours
- Automatic redirect to login if session expired

## Analytics

The dashboard fetches data from API endpoints:

- `/api/analytics/overview` - Overview statistics
- `/api/analytics/visitors` - Visitors chart data
- `/api/analytics/clicks` - Clicks chart data
- `/api/analytics/revenue` - Revenue chart data
- `/api/analytics/top-posts` - Top performing posts
- `/api/analytics/traffic-sources` - Traffic sources

## Environment Variables

Required:
- `VITE_ADMIN_PASSWORD` - Admin dashboard password
- `VITE_API_URL` - API base URL (defaults to `/api`)

Optional:
- `GA_PROPERTY_ID` - Google Analytics property ID
- `GA_CREDENTIALS` - Google Analytics service account JSON

## Extending

To add new admin features:

1. Add new pages to `pages/` directory
2. Add new components to `components/` directory
3. Add new utilities to `lib/` directory
4. Export from `index.ts`

Example:
```typescript
// modules/admin/pages/Settings.tsx
export default function Settings() {
  return <div>Settings Page</div>;
}

// modules/admin/index.ts
export { default as AdminSettings } from "./pages/Settings";
```
