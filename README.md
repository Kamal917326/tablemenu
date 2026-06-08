# TableMenu

Browser-based QR menus for London restaurants — no app download. Guests scan a table QR code, browse the menu on your server, filter UK allergens, and optionally preview signature dishes in AR on their phone.

## Features (MVP)

- **QR → web menu** — `/r/{restaurant}/t/{table}` per table
- **UK allergen filters** — hide dishes containing any of the 14 major allergens
- **Dish detail** — ingredients, calories, portion size, allergen badges
- **AR preview** — WebAR via `@google/model-viewer`; tap **View on table** from menu or dish page
- **Admin dashboard** — `/admin/copper-pot` — edit menu, generate QR codes, manage AR models
- **Call waiter** — demo button (kitchen integration coming later)

## Admin

Open [http://localhost:3000/admin/copper-pot](http://localhost:3000/admin/copper-pot)

- **Menu** — mark sold out, update prices
- **QR codes** — download per-table QR codes
- **AR models** — assign 3D models per dish, adjust scale, custom .glb URLs
- **Landing page** — product pitch + link to live demo

## Demo

Demo restaurant: **The Copper Pot** (Shoreditch)

- Home: `/`
- Table 1 menu: `/r/copper-pot/t/1`
- AR dish example: `/r/copper-pot/t/1/d/burger`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy (Vercel — free demo URL)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import **Kamal917326/tablemenu**
3. Click **Deploy** (no env vars needed)
4. Your live demo will be at `https://tablemenu-xxx.vercel.app`

**Demo links to share with customers:**

- Menu: `https://YOUR-URL/r/copper-pot/t/1`
- AR burger: `https://YOUR-URL/r/copper-pot/t/1/d/burger`
- Admin: `https://YOUR-URL/admin/copper-pot`

Or from CLI:

```bash
npx vercel --prod
```

## Stack

- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- `@google/model-viewer` for WebAR

## Roadmap

1. Restaurant admin dashboard (menu editor, QR generator)
2. Database + multi-tenant auth (Supabase)
3. Custom 3D dish models per restaurant
4. Stripe subscriptions (GBP pricing)
5. Analytics and sold-out toggles from admin

## Business model (planned)

- Setup fee + monthly SaaS (£39–249/mo tiers)
- AR as premium add-on with per-dish 3D modeling

---

Built solo in London. Pilot restaurants welcome.
