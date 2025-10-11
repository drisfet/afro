# 🎯 HANDOFF PROMPT: MedusaJS Storefront Replication Project

## 📋 Mission Statement

You are taking over a MedusaJS e-commerce project where **Phase 1 (Data Collection & Seeding)** is 100% complete. Your mission is to **replicate the original site (howtfoods.com.au) with maximum fidelity** while redesigning it enough to call it our own, maintaining complete functionality.

---

## ✅ What's Already Complete

### 1. Data Collection & Database Seeding ✅
- **222 products** scraped and seeded into MedusaJS
- **46 categories** (17 parent, 29 child) organized hierarchically
- **All product data**: titles, descriptions, prices, images, SKUs
- **Images configured**: External images from howtfoods.com.au working in Next.js
- **Price format fixed**: Decimal dollars (10.00) not cents (1000)

### 2. Site Architecture Mapping ✅
We have **complete site intelligence** in two JSON files:

#### `site_structure_map.json` (77,199 lines)
- **68 total pages** discovered and categorized
- **52 product category pages**
- **Account pages**: /my-account, /orders, /payment-methods, /lost-password
- **E-commerce**: /cart, /wishlist, /order-tracking
- **Legal**: /privacy-policy, /terms-and-conditions, /refund-and-returns-policy
- **Static**: /about-us, /contact-us, /shop

#### `site_architecture.json` (825 lines)
Complete architectural analysis:
- **Theme**: Cartzilla (WooCommerce theme)
- **Header**: Logo, search bar, cart icon, account link
- **Navigation**: 5 menus with 28+ items total
- **Footer**: 5 sections, social links (Facebook, Instagram, YouTube), payment methods
- **Hero**: Image slider on homepage
- **Features**: Newsletter subscription, WooCommerce integration

### 3. Infrastructure ✅
- **MedusaJS v2.10.3** backend running on port 9000
- **Next.js 15 storefront** at `/workspaces/afro/afro-store-storefront/`
- **PostgreSQL** database (Supabase hosted)
- **Seed script**: `afro-store/src/scripts/seed-howt-foods.ts` (working perfectly)
- **Documentation**: `afro-store-storefront/docs/` with structured guides

---

## 🎯 Your Mission: Storefront Replication

### Phase 2 Objectives

You need to **transform the default MedusaJS Next.js storefront** into a faithful replica of howtfoods.com.au with these priorities:

#### 1. **Site Structure Replication** (CRITICAL)
Use `site_structure_map.json` and `site_architecture.json` to:
- [ ] Create all 68 pages discovered in the site map
- [ ] Implement navigation menus (5 menus, 28+ items)
- [ ] Build header with logo, search, cart, account
- [ ] Build footer with 5 sections, social links, payment icons
- [ ] Add hero slider on homepage
- [ ] Create account pages (/my-account, /orders, etc.)
- [ ] Add e-commerce pages (/cart, /wishlist, /order-tracking)
- [ ] Add legal pages (/privacy-policy, /terms-and-conditions, /refund-and-returns-policy)

#### 2. **Design Consistency** (HIGH)
- Study the **Cartzilla theme** for design patterns
- Match layout structure (header, hero, content, footer)
- Maintain color scheme and typography principles
- Ensure responsive design matches original
- **BUT**: Redesign enough to make it unique (different colors, fonts, spacing)

#### 3. **Functionality Parity** (CRITICAL)
- [ ] Product browsing by categories (52 categories)
- [ ] Search functionality
- [ ] Cart and checkout flow
- [ ] Account management (orders, addresses, password)
- [ ] Wishlist feature
- [ ] Order tracking
- [ ] Newsletter subscription
- [ ] Social media integration

---

## 📚 Critical Files You'll Use

### Site Intelligence Files
1. **`/workspaces/afro/site_structure_map.json`**
   - Every page URL, title, links discovered
   - Navigation structure per page
   - Footer links per page
   - Use this to know WHAT pages exist

2. **`/workspaces/afro/site_architecture.json`**
   - Layout details (header, footer, hero)
   - Menu structures with IDs
   - Theme information (Cartzilla)
   - Feature detection
   - Use this to know HOW pages are structured

### Data Files
3. **`/workspaces/afro/medusa-products.json`** (222 products)
   - Product titles, descriptions, prices, images
   - Category associations
   - Already seeded, just for reference

4. **`/workspaces/afro/medusa-categories.json`** (46 categories)
   - Category hierarchy
   - Parent-child relationships
   - Already seeded, just for reference

### Storefront Files
5. **`/workspaces/afro/afro-store-storefront/`**
   - Current Next.js 15 storefront
   - Directory structure: `src/app/[countryCode]/(main)/`
   - Styling: Tailwind CSS
   - **This is what you'll be modifying**

### Documentation
6. **`/workspaces/afro/afro-store-storefront/docs/`**
   - `README.md`: Documentation structure guide
   - `features/collections.md`: Collections vs Categories explanation
   - **Add your implementation docs here**

---

## 🔧 Tools & Resources Available

### 1. MCP Tools (Use These!)
You have access to Model Context Protocol tools for:
- **Browser automation**: Test the original site, capture screenshots
- **File operations**: Read, create, edit files in the workspace
- **Terminal commands**: Run dev servers, install packages

### 2. Official Documentation
**CRITICAL**: Use MCP tools to search and reference:
- **MedusaJS Docs**: https://docs.medusajs.com/
  - Storefront development guides
  - API references
  - Module documentation
  - Next.js starter template docs

### 3. VS Code Extensions
Search for and install relevant extensions:
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Pretty TypeScript Errors

---

## 📝 Implementation Strategy

### Step 1: Deep Analysis (START HERE)
1. **Read the architecture files thoroughly**
   ```bash
   # Open these in VS Code
   /workspaces/afro/site_structure_map.json
   /workspaces/afro/site_architecture.json
   ```

2. **Assess current storefront**
   ```bash
   cd /workspaces/afro/afro-store-storefront
   npm run dev
   # Visit http://localhost:8000
   ```

3. **Document gaps**
   - Compare original site structure vs current storefront
   - List missing pages, components, features
   - Create implementation checklist

### Step 2: Create Implementation Plan
Create a document: `/workspaces/afro/afro-store-storefront/docs/setup/replication-plan.md`

Include:
- **Page inventory**: List all 68 pages to create
- **Component inventory**: Reusable components needed (Header, Footer, ProductCard, etc.)
- **Navigation structure**: Menu hierarchy from site_architecture.json
- **Styling strategy**: How to match Cartzilla theme in Tailwind
- **Priority order**: What to build first

### Step 3: Search MedusaJS Documentation
Use MCP tools to research:
- "MedusaJS Next.js storefront structure"
- "MedusaJS navigation menu implementation"
- "MedusaJS product listing pages"
- "MedusaJS account pages"
- "MedusaJS cart and checkout"

### Step 4: Build Core Components
Priority order:
1. **Header component** (logo, search, cart, account)
2. **Footer component** (5 sections, social, payment icons)
3. **Navigation menus** (5 menus from architecture)
4. **Product grid/list** (category pages)
5. **Homepage hero slider**

### Step 5: Create Pages
Use the page inventory to create:
- Account pages in `/app/[countryCode]/(main)/account/`
- Legal pages in `/app/[countryCode]/(main)/legal/`
- Static pages (about, contact, etc.)

### Step 6: Test & Iterate
- Test navigation flows
- Test responsive design
- Test functionality (cart, account, etc.)
- Compare with original site

---

## 🎨 Design Guidelines

### What to Keep (Fidelity)
- ✅ Overall layout structure
- ✅ Page organization and navigation
- ✅ Feature placement (search in header, cart icon, etc.)
- ✅ Content hierarchy
- ✅ Functional workflows (checkout, account, etc.)

### What to Change (Make it Your Own)
- 🎨 Color palette (choose new brand colors)
- 🎨 Typography (different fonts)
- 🎨 Spacing and padding (adjust Tailwind classes)
- 🎨 Border radius and shadows
- 🎨 Button styles
- 🎨 Card designs
- 🎨 Icons (use different icon library if desired)

### Design Tools
- **Tailwind CSS**: Already configured
- **Shadcn/ui**: Consider adding for consistent components
- **Headless UI**: For accessible menus, modals, etc.

---

## 📊 Success Criteria

Your implementation is complete when:

### Functional Criteria
- [ ] All 68 pages from site map are created and accessible
- [ ] Navigation works exactly like original (5 menus, all links)
- [ ] Header matches layout (logo, search, cart, account)
- [ ] Footer matches layout (5 sections, social, payment)
- [ ] Product browsing works (52 category pages)
- [ ] Search functionality works
- [ ] Cart and checkout flow works
- [ ] Account pages work (login, orders, addresses)
- [ ] Wishlist works
- [ ] Order tracking works
- [ ] Newsletter subscription works
- [ ] All 222 products display correctly
- [ ] Responsive design works on mobile/tablet/desktop

### Quality Criteria
- [ ] Design is visually distinct from original (new colors, fonts, spacing)
- [ ] Code follows Next.js 15 best practices
- [ ] Components are reusable and well-organized
- [ ] TypeScript types are properly defined
- [ ] Accessibility standards met (WCAG)
- [ ] SEO optimized (meta tags, sitemap)
- [ ] Performance optimized (image optimization, lazy loading)

### Documentation Criteria
- [ ] Implementation plan documented in `/docs/setup/`
- [ ] Component documentation in `/docs/features/`
- [ ] API integration notes in `/docs/api/`
- [ ] Deployment guide in `/docs/deployment/`

---

## 🚨 Critical Notes

### 1. Price Format
**DO NOT multiply prices by 100!** MedusaJS v2 uses decimal dollars.
- ✅ Correct: `amount: 10` = $10.00
- ❌ Wrong: `amount: 1000` = $1000.00

### 2. Image Configuration
External images from howtfoods.com.au are already configured in `next.config.js`:
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "howtfoods.com.au",
    },
  ],
}
```

### 3. Category Hierarchy
Categories have parent-child relationships. When displaying categories:
- Parent categories: 17 top-level
- Child categories: 29 with parent_category_id
- Must maintain hierarchy in navigation

### 4. MedusaJS v2 Differences
We're using **MedusaJS v2.10.3**, which has significant API differences from v1:
- Workflow-based architecture
- Different store API endpoints
- Module-based system
- **Always check v2 docs, not v1!**

---

## 🔍 How to Use the Architecture Files

### Example 1: Building Header
From `site_architecture.json`:
```json
"header": {
  "classes": "bg-light box-shadow-sm fixed-top",
  "logo": "https://howtfoods.com.au/wp-content/uploads/2022/03/cropped-logo-howtfoods.png",
  "search": true,
  "cart_icon": true,
  "account_link": true
}
```

**Action**: Create Header component with:
- Fixed position at top
- Light background with box shadow
- Logo on left
- Search bar in center
- Cart icon and account link on right

### Example 2: Building Navigation
From `site_architecture.json`:
```json
"menus": [
  {
    "id": "menu-1",
    "classes": "cz-handheld-menu",
    "items": [
      {"text": "Home", "url": "https://howtfoods.com.au/"},
      {"text": "About Howtfoods", "url": "https://howtfoods.com.au/about-us/"},
      {"text": "Contacts", "url": "https://howtfoods.com.au/contacts/"},
      {"text": "Shop", "url": "https://howtfoods.com.au/shop/"}
    ]
  }
]
```

**Action**: Create Navigation component with:
- Menu items: Home, About, Contacts, Shop
- Mobile-friendly (handheld menu)
- Link to appropriate pages

### Example 3: Discovering All Pages
From `site_structure_map.json`:
```json
"pages": {
  "homepage": {"url": "https://howtfoods.com.au/", "title": "..."},
  "about": [{"url": "https://howtfoods.com.au/about-us/", "title": "..."}],
  "contact": [{"url": "https://howtfoods.com.au/contact-us/", "title": "..."}],
  "account_pages": [
    {"url": "https://howtfoods.com.au/my-account-2/", "title": "..."},
    {"url": "https://howtfoods.com.au/my-account/orders/", "title": "..."}
  ]
}
```

**Action**: Create pages at:
- `/app/[countryCode]/(main)/page.tsx` (homepage)
- `/app/[countryCode]/(main)/about/page.tsx`
- `/app/[countryCode]/(main)/contact/page.tsx`
- `/app/[countryCode]/(main)/account/page.tsx`
- `/app/[countryCode]/(main)/account/orders/page.tsx`

---

## 🎬 Getting Started Checklist

Before you write any code:

- [ ] Read this entire handoff document
- [ ] Open and study `site_architecture.json` (825 lines)
- [ ] Open and study `site_structure_map.json` (77,199 lines)
- [ ] Start the storefront dev server: `cd afro-store-storefront && npm run dev`
- [ ] Visit the current storefront: http://localhost:8000
- [ ] Visit the original site: https://howtfoods.com.au
- [ ] Take screenshots of key pages from original site
- [ ] Create a gap analysis document
- [ ] Search MedusaJS docs for storefront development guides
- [ ] Create implementation plan in `/docs/setup/replication-plan.md`
- [ ] Share the plan for review before coding

---

## 💬 Questions to Ask

If you need clarification:

1. **Scope**: "Should I implement [specific feature] in Phase 2, or defer to Phase 3?"
2. **Priority**: "What's more important: visual design changes or functionality completion?"
3. **Fidelity**: "For [specific component], how closely should I match the original?"
4. **Design**: "What color palette and fonts should I use for the redesign?"

---

## 📞 Additional Context

### Project Background
- **Original site**: howtfoods.com.au (African groceries e-commerce)
- **Tech stack**: WordPress + WooCommerce + Cartzilla theme
- **Goal**: Migrate to modern stack (MedusaJS + Next.js 15)
- **Why**: Better performance, easier maintenance, more control

### Business Context
- **Target audience**: African diaspora in Sydney, Australia
- **Product range**: 222 products across 46 categories
- **Categories**: Groceries, personal care, hair products, provisions
- **Unique selling point**: Hard-to-find African food and beauty products

### Technical Context
- **Current storefront**: Basic MedusaJS Next.js starter template
- **Needs transformation**: From generic template to specialized store
- **Must maintain**: Product data, category structure, prices, images
- **Can change**: All visual design, layout, colors, fonts

---

## 🎯 Your First Task

**Create a comprehensive implementation plan** at:
`/workspaces/afro/afro-store-storefront/docs/setup/replication-plan.md`

This plan should include:

1. **Page Inventory**: List all 68 pages with priority ranking
2. **Component Breakdown**: Reusable components needed
3. **Navigation Map**: Menu structure from architecture files
4. **Design System**: Color palette, typography, spacing decisions
5. **Implementation Phases**: Logical build order
6. **Testing Strategy**: How to verify each component/page
7. **Timeline Estimate**: Rough effort estimate per section

Then, share this plan for review before starting implementation.

---

## 🚀 You've Got This!

You have everything you need:
- ✅ Complete site architecture (68 pages mapped)
- ✅ All product data (222 products, 46 categories)
- ✅ Working MedusaJS backend
- ✅ Next.js storefront foundation
- ✅ Official documentation access
- ✅ MCP tools for automation

**Your mission is clear**: Transform the generic storefront into a faithful replica of howtfoods.com.au with maximum fidelity and scrutiny, while redesigning it enough to make it uniquely yours.

**Start with the implementation plan, then build systematically.**

Good luck! 🎉
