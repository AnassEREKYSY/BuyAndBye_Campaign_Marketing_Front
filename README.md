# Kickback (web)

Kickback is an influencer campaign platform: brands publish campaigns, creators apply, and every
accepted creator gets a tracked link, a promo code and a QR code. Clicks turn into tiered payouts.

This is the front-end monorepo. The API lives in `BuyAndBye_Campaign_Marketing_Back`.

```
apps/
  web/        React 18 + Vite + Tailwind web app (the one deployed)
  mobile/     React Native + Expo app (not updated in this redesign)
packages/
  core/       Shared business logic (Clean Architecture: domain, use cases, API clients)
```

## Features

- Brands: campaigns with payout tiers, products, applications (shortlist / accept / reject), collaborations, **analytics** across all campaigns (clicks over time, top creators, sources, devices, payouts)
- Creators: find campaigns and apply, **earnings** (paid / approved / pending, monthly chart, payout history), **links & QR codes** (copy link or promo code, download a QR code as PNG or SVG)
- Messages per collaboration, notifications, profile
- Light and dark mode (follows the system, toggle in the sidebar)

Design rules: `apps/web/DESIGN.md`. Shared UI kit: `apps/web/src/shared/components/ui`.

## Run locally

```bash
bun install
cp apps/web/.env.example apps/web/.env.local   # VITE_BACKEND_BASE_URL=http://127.0.0.1:8000
cd apps/web && bun run dev                      # http://127.0.0.1:5173
```

Start the API first (see the back-end README). Demo accounts use the password `password`:
`brand@kickback.demo`, `creator@kickback.demo`. The sign-in page has one-click demo buttons.

Checks: `bun run typecheck` and `bun run build` from `apps/web`.

## Deploy on Vercel

1. Deploy the API first and note its URL.
2. **Add New → Project**, import this repository, set **Root Directory** to `apps/web`. The rest comes from `apps/web/vercel.json` (bun install at the repo root, Vite build, SPA fallback).
3. Environment variable: `VITE_BACKEND_BASE_URL` = the API URL, e.g. `https://kickback-api.vercel.app` (no trailing slash).
4. Deploy, then add the web URL to `CORS_ALLOWED_ORIGINS` on the API project and redeploy the API.
