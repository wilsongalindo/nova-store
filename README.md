# Nova Store

A modern, responsive ecommerce storefront built with Next.js App Router. Nova Store showcases a curated product catalog with URL-driven filters, product detail pages, related products, and a client-side shopping cart — designed as a production-minded frontend technical exercise.

---

## Project Overview

Nova Store is a single-brand online shop featuring **30 products** across **5 categories** (Electronics, Fashion, Home, Sports, Beauty). The application prioritizes:

- **Server-first rendering** for catalog and product pages
- **Client islands** only where interactivity is required (filters, cart, gallery)
- **Pure, testable business logic** separated from UI components
- **Accessible, mobile-first** UI built with Shadcn UI and Tailwind CSS

Product data is served from a static JSON dataset (`src/data/products.json`), making the app easy to run locally without external APIs or databases.

---

## Features

| Feature | Description |
|---------|-------------|
| **Product Catalog** | Grid of product cards with image, price, rating, inventory badge, and promotion labels |
| **Product Filters** | Search, category, inventory status, price range slider, and sort — synced to URL search params |
| **Product Detail Page** | Gallery with thumbnails, variant selector, description, and add-to-cart |
| **Related Products** | Up to 4 same-category products on the PDP (Server Component) |
| **Shopping Cart** | Slide-over cart with add/remove, quantity controls, subtotal, and item count badge |
| **Responsive Design** | Mobile-first layout from catalog grid to cart sheet and PDP |
| **SEO Metadata** | Root layout metadata with Open Graph basics |
| **404 Page** | Friendly not-found UI with link back to the catalog |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  App Router (RSC)                                           │
│  layout.tsx · page.tsx · products/[slug]/page.tsx           │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   src/lib/products   features/catalog   features/product
   (data access)     (filters + grid)   (PDP + gallery)
         │                 │                 │
         └────────┬────────┴────────┬────────┘
                  ▼                 ▼
            src/data/         features/cart
         products.json        (Zustand store)
```

### Key patterns

- **URL as source of truth for filters** — `q`, `category`, `minPrice`, `maxPrice`, `inventory`, and `sort` are parsed, applied, and serialized in pure functions (`filter-params.ts`, `filter-products.ts`).
- **Feature-based folders** — UI and logic colocated under `src/features/{catalog,product,cart}`.
- **Cart snapshot model** — Line items denormalize `name`, `image`, and `price` at add-to-cart time so the cart remains stable if catalog data changes.
- **Pure cart operations** — `addItemToCart`, `removeItemFromCart`, and `updateCartItemQuantity` are exported for unit testing independently of Zustand.

---

## Folder Structure

```
nova-store/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout, SEO metadata, header
│   │   ├── page.tsx            # Catalog page (RSC)
│   │   ├── not-found.tsx       # Custom 404
│   │   ├── globals.css
│   │   └── products/[slug]/
│   │       └── page.tsx        # Product detail + related products
│   ├── components/
│   │   └── layout/
│   │       └── header.tsx      # Logo, cart trigger, cart sheet
│   ├── data/
│   │   └── products.json       # Static product catalog (30 items)
│   ├── features/
│   │   ├── catalog/            # Filters, grid, product cards
│   │   ├── product/            # PDP, gallery, add-to-cart button
│   │   └── cart/               # Zustand store + cart UI
│   ├── lib/
│   │   ├── products.ts         # getProducts, getProductBySlug, etc.
│   │   └── format-price.ts
│   └── types/                  # Product, CartItem, FilterState
├── components/ui/              # Shadcn UI primitives
├── __tests__/                  # Vitest unit tests
├── public/                     # Static assets
├── next.config.ts
├── vitest.config.ts
└── tsconfig.json
```

---

## Installation

**Requirements:** Node.js 20+ and npm.

```bash
git clone <repository-url>
cd nova-store
npm install
```

No environment variables are required for local development. Optional:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO / Open Graph (`metadataBase`) |
| `VERCEL_URL` | Auto-used on Vercel deployments when `NEXT_PUBLIC_SITE_URL` is unset |

---

## Running Locally

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Unit tests
npm test
```

---

## Design Decisions

1. **Static JSON over API** — Keeps scope focused on frontend architecture, filtering, and cart UX without backend infrastructure.
2. **URL-driven filters** — Enables shareable catalog views, browser back/forward support, and minimal client state.
3. **Zustand for cart only** — Lightweight global state where it matters; catalog filters derive from `useSearchParams`.
4. **Server Components by default** — Catalog page and PDP shell render on the server; `"use client"` only on interactive islands.
5. **Denormalized cart lines** — Preserves price and display name at add time, matching real ecommerce cart behavior.
6. **Shadcn UI + Tailwind CSS 4** — Consistent, accessible primitives with full styling control.

---

## Tradeoffs

| Decision | Benefit | Cost |
|----------|---------|------|
| Static JSON catalog | Zero infra, fast iteration | No real inventory sync or admin panel |
| Unsplash hotlinked images | No asset pipeline required | External dependency; URLs can break (see below) |
| In-memory cart (Zustand) | Simple, fast UX | Cart lost on full page refresh (no persist middleware yet) |
| Client-side filter island | Smooth URL updates without full reload | Requires `Suspense` boundary around `useSearchParams` |
| No checkout flow | Scope contained to storefront UX | Checkout button is a placeholder |

---

## Future Improvements

- [ ] Migrate product images to local assets under `public/products/`
- [ ] Wire **Add to Cart** from catalog cards and PDP to `useCartStore`
- [ ] Add `generateMetadata` per product on `/products/[slug]`
- [ ] Persist cart with Zustand `persist` middleware (localStorage)
- [ ] Stock validation when incrementing cart quantity
- [ ] E2E tests (Playwright) for catalog → PDP → cart flows
- [ ] Replace static JSON with a headless CMS or REST API
- [ ] Checkout flow and order summary page

---

## Known Limitations

### External Images

Some products use externally hosted images from Unsplash.

Because these assets depend on a third-party provider, some image URLs may become unavailable over time, resulting in missing product images in the catalog or product detail pages.

For a production implementation, all product assets should be migrated to a dedicated CDN or local storage under the application's control.

### Cart Persistence

The shopping cart uses Zustand in-memory state only.

Refreshing the browser clears the cart contents. A production-ready version should persist cart state using localStorage, cookies, or a backend session.

### Checkout Flow

The checkout button is implemented as a UI placeholder only.

No payment processing, order creation, or checkout workflow is currently implemented.

### Inventory Validation

Cart quantities are not validated against available inventory levels.

A production implementation should prevent quantities from exceeding stock availability.

### Localization

Currency formatting is currently fixed to USD (`en-US`) and does not support multiple locales or currencies.

---

## Testing

Unit tests run with **Vitest** and cover pure logic:

| Suite | Coverage |
|-------|----------|
| `filter-params.test.ts` | URL param parse/serialize, defaults, active filter count |
| `filter-products.test.ts` | Search, filter pipeline, sort strategies |
| `cart-store.test.ts` | Add/remove/update quantity, subtotal, item count, edge cases |

```bash
npm test
```

Component tests (`product-card.test.tsx`) exist but are not yet included in the default Vitest config.

---

## Deployment

Nova Store is a standard Next.js application and deploys cleanly to [Vercel](https://vercel.com) or any Node.js host that supports Next.js 16.

**Vercel (recommended):**

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://nova-store.example.com`).
4. Deploy — build command: `npm run build`, output: Next.js default.

**Self-hosted:**

```bash
npm run build
npm start
```

Ensure `images.unsplash.com` remains allowed in `next.config.ts` `images.remotePatterns` while external images are in use.

---

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Zustand](https://zustand.docs.pmnd.rs)
- [Shadcn UI](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)
- [Vitest](https://vitest.dev)
- [Lucide React](https://lucide.dev) (icons)

---

## License

Private — technical exercise / portfolio project.
