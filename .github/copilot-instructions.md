# AfroMart Sydney - AI Coding Agent Instructions

## Project Overview

**AfroMart Sydney** is a mobile-first e-commerce platform for authentic African groceries, built on **MedusaJS v2.10.3** (backend) and **Next.js 15** with App Router (storefront). The project is a complete rebrand from "Howt Foods Melbourne" to "AfroMart Sydney" with 222+ products across 46 categories.

### Architecture
```
/workspaces/afro/
├── afro-store/              # MedusaJS backend (port 9000)
├── afro-store-storefront/   # Next.js 15 storefront (port 8000)
├── *.md guides/             # Comprehensive implementation docs
└── scraping scripts/        # Python/Playwright product data pipeline
```

## Critical: Package Manager

**ALWAYS use Yarn (v1.22.22), NEVER npm!** Both projects use Yarn exclusively.

```bash
# Correct
yarn install
yarn add package-name
yarn dev

# WRONG - Never do this
npm install  ❌
npm add      ❌
```

**Why:** While MedusaJS v2 supports both npm and Yarn, this project standardizes on Yarn for consistency. Both lock files exist intentionally for compatibility.

## Development Workflow

### Starting the Full Stack
```bash
# Root level - starts both backend and frontend
bash start-dev.sh

# Manual alternative
cd afro-store && yarn dev &           # Backend on :9000
cd afro-store-storefront && yarn dev  # Frontend on :8000
```

### Key URLs (Codespaces)
- **Storefront:** `https://${CODESPACE_NAME}-8000.app.github.dev`
- **Admin Panel:** `https://${CODESPACE_NAME}-9000.app.github.dev/app`
- **Backend API:** `https://${CODESPACE_NAME}-9000.app.github.dev/health`

### Data Seeding Pipeline
```bash
# 1. Transform scraped data (Python → MedusaJS format)
cd /workspaces/afro
node transform-products.js  # Outputs medusa-products.json

# 2. Seed database with products/categories
cd afro-store
yarn seed  # Runs src/scripts/seed-howt-foods.ts
```

**Important:** Inventory management is **disabled** for unlimited stock. Products have sale prices stored in `metadata.salePrice`.

## Project-Specific Patterns

### 1. MedusaJS v2 Integration & Data Fetching
- Use `@medusajs/js-sdk` for API calls, NOT direct fetch
- Product categories are **nested** (parent-child relationships)
- **Collections** group products, **Categories** organize hierarchically
- Server components fetch data directly; client components use TanStack Query

**Field Selection for Performance (CRITICAL):**
This project uses **optimized helper functions** in `src/lib/data/products.ts` and `src/lib/data/categories.ts`:

```typescript
// ✅ For product listings (cards, grids)
import { listProductsMinimal } from "@lib/data/products"
// Fields: *variants.calculated_price,+images

// ✅ For carousels, featured sections
import { listProductsForDisplay } from "@lib/data/products"
// Fields: *variants.calculated_price,+metadata,+images

// ✅ For product detail pages only
import { listProductsFull } from "@lib/data/products"
// Fields: *variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+images,+collection

// ✅ For category navigation
import { listCategoriesForNav } from "@lib/data/categories"
// Fields: id,handle,name,description,*category_children,*parent_category (NO products)
```

**Why this matters:** Using the right helper reduces payload by 40-70% and improves mobile performance.

### 2. Styling System (Tailwind + shadcn/ui)
- **shadcn/ui** components in `src/components/ui/` (Button, Sheet, Carousel, etc.)
- **CVA** (class-variance-authority) for variant-based styling
- **Orange branding** (#f97316, orange-500/600) - NOT red
- Path aliases: `@/*` for src/, `@components/*` for components/

**Example - Creating components:**
```tsx
// Use existing primitives
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Orange variant for CTAs
<Button variant="default" className="bg-orange-600 hover:bg-orange-700">
```

### 3. Mobile-First Design Principles
- **Touch targets:** Minimum 44px height (iOS guidelines)
- **Horizontal scroll:** Use `scroll-snap-type: x mandatory` for carousels
- **Responsive breakpoints:** `sm:640` → `md:768` → `lg:1024` (see tailwind.config.js)
- **Framer Motion:** Used selectively for category transitions (`CategoryTransitionProvider`)
- **No paginators on mobile** - infinite scroll or "Load More" preferred

### 4. Module Structure (Feature-Based)
```
src/modules/
├── home/         # Homepage components (hero, quick-actions, deals-carousel)
├── products/     # Product listings, detail pages
├── cart/         # Cart functionality
├── checkout/     # Checkout flow
├── layout/       # Nav, footer, side-menu
└── categories/   # Category pages
```

**Convention:** Each module has `components/` and `templates/` subdirectories. Templates are page-level compositions.

### 5. Branding Guidelines
- **Logo:** 🌍 emoji + "AfroMart Sydney" (NO image file)
- **Tagline:** "Authentic African Groceries"
- **Location:** Sydney, NSW (NOT Melbourne)
- **Contact:** hello@afromartsydney.com.au | (02) 9999 9999
- **Creator credit:** "Created by dRof" in footer
- **Colors:** Orange primary, slate neutrals (see REBRANDING_COMPLETE.md)

## Key Files Reference

### Configuration
- `afro-store-storefront/components.json` - shadcn/ui config (RSC, TypeScript, slate base)
- `afro-store-storefront/tailwind.config.js` - Extended with grey palette, custom screens
- `afro-store-storefront/next.config.js` - Codespaces allowedOrigins, image domains
- `afro-store/medusa-config.ts` - Database URL, CORS, JWT secrets

### Critical Scripts
- `transform-products.js` - Converts scraped JSON to MedusaJS format (prices in cents)
- `afro-store/src/scripts/seed-howt-foods.ts` - Main seeding script (store, regions, products)
- `start-dev.sh` - Full-stack startup with health checks

### Data Layer (Performance Optimized)
- `src/lib/data/products.ts` - Product fetching helpers (minimal/display/full)
- `src/lib/data/categories.ts` - Category fetching helpers (optimized for nav)
- `src/lib/data/deals.ts` - Optimized deal product fetching

### Implementation Docs (READ THESE!)
- `COMPLETE_TRANSFORMATION_SUMMARY.md` - All completed homepage tasks
- `IMPLEMENTATION_GUIDE.md` - Step-by-step setup for new features
- `SEEDING_GUIDE.md` - Data pipeline and category hierarchy
- `REBRANDING_COMPLETE.md` - Branding specifications and files changed
- `CODE_AUDIT_REPORT.md` - Performance optimizations and field selection guide
- `PACKAGE_MANAGER_FINAL.md` - Why Yarn, not npm

## Common Pitfalls to Avoid

1. **Don't mix npm and Yarn** - Always check for `yarn.lock`, not `package-lock.json`
2. **Don't hardcode Melbourne** - Location is Sydney throughout
3. **Don't use red colors** - Orange (#f97316) is the brand primary
4. **Don't use base `listProducts()` directly** - Use optimized helpers: `listProductsMinimal()`, `listProductsForDisplay()`, or `listProductsFull()`
5. **Don't fetch categories with products for nav** - Use `listCategoriesForNav()` which excludes products
6. **Don't ignore mobile-first** - Desktop is secondary, design for 375px first
7. **Don't skip documentation** - Guides like IMPLEMENTATION_GUIDE.md contain critical context

## Testing & Verification

### Backend Health Check
```bash
curl http://localhost:9000/health  # Should return {"status": "OK"}
```

### Common Debug Commands
```bash
# View logs
cd afro-store && yarn dev           # See MedusaJS logs
cd afro-store-storefront && yarn dev  # See Next.js logs

# Check database
cd afro-store
yarn medusa exec ./src/scripts/list-products.ts  # Custom script

# Rebuild
yarn build  # In either directory
```

## AI-Specific Guidance

- **Read context files first:** Most questions are answered in `IMPLEMENTATION_GUIDE.md` or `UI_UX_ASSESSMENT_REPORT.md`
- **Follow shadcn/ui patterns:** Don't recreate primitives, compose from `src/components/ui/`
- **Preserve MedusaJS types:** Import from `@medusajs/types`, don't create custom interfaces for core entities
- **Use Server Components by default:** Only add `"use client"` when necessary (forms, animations, hooks)
- **Match existing patterns:** Check similar components before creating new ones (e.g., `src/modules/home/components/`)
- **Use optimized data helpers:** Always use `listProductsMinimal()`, `listProductsForDisplay()`, `listProductsFull()`, or `listCategoriesForNav()` instead of base functions

## External Dependencies

- **Stripe:** Payment provider (not yet configured)
- **Playwright:** Browser automation for scraping (Python scripts)
- **Embla Carousel:** Homepage carousels (`embla-carousel-react`)
- **Vercel AI SDK:** Future feature for product recommendations (`ai` package)
- **TanStack Query:** Client-side data fetching with 5min stale time

---

**Last Updated:** October 12, 2025 | **MedusaJS:** 2.10.3 | **Next.js:** 15.3.1 | **Node:** 20+
