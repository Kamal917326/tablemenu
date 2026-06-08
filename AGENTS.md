# AGENTS.md

## Cursor Cloud specific instructions

TableMenu is a single-process **Next.js 14** app (App Router). No database, Docker, or external services are required for local development — data is stored in `data/restaurants.json`.

### Services

| Service | Command | Port |
|---------|---------|------|
| Next.js dev server | `npm run dev` | 3000 |

Only one service must run. Use tmux for long-running dev servers.

### Common commands

See `package.json` scripts and `README.md` for standard commands:

- **Install deps:** `npm install`
- **Dev server:** `npm run dev` → http://localhost:3000
- **Lint:** `npm run lint`
- **Build:** `npm run build`
- **Production run:** `npm run start` (after build)

There is no test suite (`npm test` is not defined).

### Key URLs (demo restaurant: copper-pot)

- Landing: http://localhost:3000/
- Guest menu (table 1): http://localhost:3000/r/copper-pot/t/1
- Dish detail + AR: http://localhost:3000/r/copper-pot/t/1/d/burger
- Admin dashboard: http://localhost:3000/admin/copper-pot

### Environment variables

No env vars are required. `.env.example` documents an optional `NEXT_PUBLIC_APP_URL` that is not currently used by the codebase.

### Gotchas

- On Vercel, `VERCEL=1` switches the data store to `/tmp/tablemenu-restaurants.json`; locally it uses `data/restaurants.json`.
- QR code generation in admin calls external `api.qrserver.com` — needs network access.
- AR dish previews fetch external 3D model URLs and Unsplash images at runtime.
