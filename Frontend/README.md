# MyLife OS — Frontend

A dark, cinematic personal life management system built with React + TypeScript.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS 4** — dark ocean design tokens
- **React Router 7** — client-side routing
- **TanStack Query 5** — server state management
- **Zustand** — auth global state
- **React Hook Form + Zod** — form validation
- **i18next** — Vietnamese / English / Korean
- **Axios** — HTTP client with JWT interceptors
- **Recharts** — charts
- **Sonner** — toast notifications

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp .env.example .env

# 3. Start frontend (Figma Make handles the dev server)
```

## API Generation

```bash
# 1. Start the NestJS backend first
# 2. Run the generator
pnpm run generate:api
# This reads: http://localhost:3000/api/v1/docs-json
# Output: src/shared/api/generated/
```

## Directory Structure

```
src/
├── app/                   # App entry, router, providers
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
├── pages/                 # Route pages
│   ├── auth/
│   ├── dashboard/
│   ├── finance/
│   ├── debts/
│   ├── todos/
│   ├── goals/
│   ├── timeline/
│   ├── journal/
│   ├── media/
│   ├── interests/
│   ├── learning/
│   ├── profile/
│   └── settings/
├── features/              # Business feature modules
│   └── auth/              # Auth store, guards
├── shared/
│   ├── api/               # Axios client + interceptors
│   ├── constants/         # Routes, queryKeys, languages
│   ├── hooks/             # Shared custom hooks
│   ├── i18n/              # i18next setup + locales
│   ├── layout/            # AppLayout, Sidebar, Topbar
│   ├── lib/               # cn, date, money, storage
│   └── ui/                # Shared UI components
└── types/                 # Global TypeScript types
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=MyLife OS
```

## Auth Flow

1. User logs in → `POST /auth/login` → gets `accessToken`
2. Access token stored **in memory** (not localStorage)
3. Refresh token via **httpOnly cookie** → `POST /auth/refresh`
4. Auto-refresh on 401 via Axios interceptor
5. Refresh failure → dispatch `auth:logout` event → clear state → redirect to `/login`

## i18n

Three languages supported:
- 🇻🇳 Vietnamese (`vi`) — default
- 🇺🇸 English (`en`)
- 🇰🇷 Korean (`ko`)

Language switcher in Topbar and Settings page. Preference saved to localStorage.

## Coding Conventions

- UI components live in `src/shared/ui/` — no business logic
- API calls go through `src/shared/api/client.ts`
- No hardcoded colors — use Tailwind tokens (`bg-background`, `text-primary`, etc.)
- No hardcoded strings — use `t('key')` from i18next
- Hooks in `src/shared/hooks/` or feature-level `hooks/`
