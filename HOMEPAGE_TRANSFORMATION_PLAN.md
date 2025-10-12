# AfroMart Sydney - Homepage Transformation Plan

**Goal:** Transform the homepage into a modern, inviting mobile-first shopping experience similar to Woolworths, Uber Eats, and DoorDash, while preserving existing cart/checkout functionality.

---

## 🎯 Core Principles

1. **Keep what works:** Cart, checkout, product pages stay as-is
2. **Rebrand:** Remove all "Medusa" references → "AfroMart Sydney"
3. **Mobile-first:** Design for thumb-friendly browsing (like Uber Eats)
4. **Feature-rich:** Quick add, deals, categories, featured products
5. **AI later:** Nice-to-have, not priority

---

## 📱 Homepage Transformation (Priority 1)

### Current State
- Basic hero section
- Generic product listings
- No featured categories
- No deals/promotions section
- Limited engagement

### Target Experience (Woolworths/Uber Eats Style)

#### 1. **Hero Section** (Above the fold)
```
┌─────────────────────────────┐
│  🌍 AfroMart Sydney         │
│  "Authentic African &       │
│   Caribbean Groceries"      │
│                             │
│  [Search Products...]       │
│                             │
│  📍 Delivering to Sydney    │
└─────────────────────────────┘
```

#### 2. **Quick Actions Row**
```
┌─────────────────────────────┐
│  [🔥 Deals]  [⭐ New]       │
│  [🌾 Grains] [🥬 Fresh]     │
└─────────────────────────────┘
```
- Horizontal scrollable cards
- Icon + label
- Quick navigation to key sections

#### 3. **Featured Deals Carousel**
```
┌─────────────────────────────┐
│  ⚡ WEEKLY SPECIALS          │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 20% │ │ 15% │ │ New │   │
│  │ OFF │ │ OFF │ │     │   │
│  └─────┘ └─────┘ └─────┘   │
└─────────────────────────────┘
```
- Swipeable horizontal carousel
- Product cards with discount badges
- "Add to Cart" button on card

#### 4. **Shop by Category** (Visual Grid)
```
┌─────────────────────────────┐
│  SHOP BY CATEGORY           │
│  ┌─────┐ ┌─────┐            │
│  │ 🌾  │ │ 🥬  │            │
│  │Grain│ │Veg  │            │
│  └─────┘ └─────┘            │
│  ┌─────┐ ┌─────┐            │
│  │ 🍖  │ │ 🐟  │            │
│  │Meat │ │Fish │            │
│  └─────┘ └─────┘            │
└─────────────────────────────┘
```
- 2-column grid on mobile
- Image + category name
- Product count badge

#### 5. **Popular Products Section**
```
┌─────────────────────────────┐
│  🔥 POPULAR RIGHT NOW        │
│  ┌───────────────────────┐  │
│  │ Product Image         │  │
│  │ Product Name          │  │
│  │ $12.99      [+ Cart]  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```
- Grid layout (2 columns mobile, 4+ desktop)
- Quick "Add to Cart" button
- Show stock status
- Rating/reviews if available

#### 6. **Recently Viewed** (If user has history)
```
┌─────────────────────────────┐
│  👀 YOU RECENTLY VIEWED      │
│  [Product cards horizontal]  │
└─────────────────────────────┘
```

#### 7. **Footer CTA**
```
┌─────────────────────────────┐
│  Browse All Products         │
│  [View Store] button         │
└─────────────────────────────┘
```

---

## ✨ Key Features to Implement

### Phase 1: Homepage Components (Priority)

#### A. Hero Section Component
**File:** `/src/modules/home/components/hero/index.tsx`
```typescript
- Location badge with delivery area
- Search bar (prominent, like Uber Eats)
- Welcoming tagline
- Background with African pattern or food imagery
```

#### B. Quick Actions Bar
**File:** `/src/modules/home/components/quick-actions/index.tsx`
```typescript
- Horizontal scrollable
- Icons for: Deals, New Arrivals, Categories
- Smooth scroll snap
- Touch-friendly (56px height)
```

#### C. Deals Carousel
**File:** `/src/modules/home/components/deals-carousel/index.tsx`
```typescript
- Framer Motion for smooth swipe
- Auto-play with pause on hover
- Discount badges
- Quick add to cart
- Link to product page
```

#### D. Category Grid
**File:** `/src/modules/home/components/category-grid/index.tsx`
```typescript
- 2-column mobile, 3-4 desktop
- Category images (need to add)
- Product count
- Gradient overlay on images
- Hover effects
```

#### E. Product Grid (Enhanced)
**File:** `/src/modules/home/components/product-grid/index.tsx`
```typescript
- Quick add to cart (without leaving page)
- Heart icon for wishlist (future)
- Stock indicator
- Hover zoom on image
- Optimistic UI with TanStack Query
```

#### F. Featured Collections
**File:** `/src/modules/home/components/featured-collections/index.tsx`
```typescript
- "New Arrivals"
- "Best Sellers"
- "On Sale"
- Horizontal scroll or grid
```

---

### Phase 2: Enhanced Features

#### G. Quick Add to Cart
**Implementation:**
```typescript
// On product card
<Button 
  onClick={(e) => {
    e.preventDefault()
    addToCartMutation.mutate({ variantId, quantity: 1 })
    toast({ title: "Added to cart!" })
  }}
>
  Add to Cart
</Button>
```
- Optimistic updates
- Toast notification
- Quantity selector (optional)
- No page reload

#### H. Search Enhancement
**File:** `/src/modules/layout/components/search-bar/index.tsx`
```typescript
- Autocomplete suggestions
- Recent searches
- Category filters in dropdown
- Mobile-optimized (full screen on mobile)
```

#### I. Product Badges/Labels
**Create:** `/src/components/product-badge.tsx`
```typescript
- "20% OFF"
- "NEW"
- "BESTSELLER"
- "LOW STOCK"
- Dynamic based on product data
```

#### J. Image Optimization
```typescript
- Next.js Image component
- Lazy loading
- Blur placeholder
- Responsive sizes
```

---

### Phase 3: Rebranding (Quick Wins)

#### Search & Replace Tasks:
```bash
# Find all "Medusa" references
grep -r "Medusa" --include="*.tsx" --include="*.ts" afro-store-storefront/src/

# Replace with "AfroMart" or "AfroMart Sydney"
- "Medusa Store" → "AfroMart Sydney"
- "medusa" → "afromart" (lowercase)
- Update meta tags, titles, descriptions
```

**Files to Update:**
- `/src/app/layout.tsx` - Meta title/description
- `/src/app/page.tsx` - Homepage title
- `/src/modules/layout/templates/footer/index.tsx` - Footer text
- `/src/modules/layout/templates/nav/index.tsx` - Already updated
- `/package.json` - name, description
- `/public/` - Favicon, logo images

---

## 🎨 Design System Enhancements

### Colors (Already configured ✓)
- Primary: Orange `HSL(24.6 95% 53.1%)`
- Good for CTAs and accents

### Components Needed

#### Product Card Component
```typescript
<ProductCard
  product={product}
  showQuickAdd={true}
  showWishlist={false}
  layout="grid" | "list"
/>
```

#### Category Card Component
```typescript
<CategoryCard
  name="Grains"
  image="/categories/grains.jpg"
  productCount={24}
  href="/categories/grains"
/>
```

#### Deal Badge Component
```typescript
<DealBadge
  type="percentage" | "amount" | "new"
  value={20}
  position="top-right"
/>
```

---

## 📊 Implementation Priority

### Week 1: Core Homepage (Phase 1)
1. ✅ Mobile Navigation (DONE)
2. ✅ Toast System (DONE)
3. **Hero Section** (NEW)
4. **Quick Actions Bar** (NEW)
5. **Category Grid** (NEW)
6. **Product Grid with Quick Add** (ENHANCE EXISTING)

### Week 2: Enhanced Features (Phase 2)
7. **Deals Carousel**
8. **Featured Collections**
9. **Search Enhancement**
10. **Product Badges**

### Week 3: Polish & Optimization
11. **Rebranding** (search & replace)
12. **Image Optimization**
13. **Loading States** (skeletons)
14. **Mobile Testing**

### Week 4: Nice-to-Haves
15. **Recently Viewed**
16. **Wishlist** (if time permits)
17. **AI Features** (product recommendations, chat)

---

## 🚀 Immediate Next Steps

### Step 1: Homepage Audit
Let me check the current homepage structure:
```bash
cat /workspaces/afro/afro-store-storefront/src/app/[countryCode]/(main)/page.tsx
```

### Step 2: Create Hero Component
```typescript
// Modern, inviting hero with search
// Location indicator
// Welcoming message
```

### Step 3: Category Grid
```typescript
// Visual grid of categories
// Use existing category data
// Add category images
```

### Step 4: Quick Add to Cart
```typescript
// Enhance product cards
// Add mutation hook
// Optimistic updates
```

---

## 💡 Inspiration References

### Woolworths Mobile
- Clean category tiles
- Prominent search
- Deal badges
- Quick add buttons

### Uber Eats
- Hero with search
- Horizontal scrolling categories
- Restaurant/store cards with images
- Quick actions

### DoorDash
- Location at top
- Category icons
- Featured items carousel
- Clean product cards

---

## 📝 Technical Notes

### Existing Features to Keep ✓
- Cart functionality
- Checkout process
- Product pages
- Account management
- Region selection

### Data Sources (Already Available)
- Products: `/lib/data/products.ts`
- Categories: `/lib/data/categories.ts`
- Cart: `/lib/data/cart.ts`
- Collections: `/lib/data/collections.ts`

### MedusaJS Entities
```typescript
Product {
  id, title, subtitle, description
  variants, images, collection
  categories, metadata
}

Category {
  id, name, handle, description
  products, parent_category
}

Collection {
  id, title, handle
  products
}
```

---

## 🎯 Success Metrics

1. **User Engagement**
   - Time on homepage increases
   - Category exploration increases
   - Quick add usage

2. **Conversion**
   - Add-to-cart rate improves
   - Reduced steps to purchase
   - Deal section drives sales

3. **Mobile Experience**
   - Fast load times (<2s)
   - Smooth scrolling
   - Easy thumb navigation

---

## ❓ Questions to Answer

1. **Product Images:** Do we have category hero images, or should we use product collages?
2. **Deals/Promotions:** Are deals managed in MedusaJS metadata, or do we hardcode featured products?
3. **Search:** Should search be full-screen modal on mobile (like Uber Eats)?
4. **Branding:** Do you have logo files, or should we keep the 🌍 emoji for now?

---

## 🔄 Next Action

**I'll now:**
1. Audit the current homepage structure
2. Create a new Hero component
3. Build the Category Grid
4. Enhance product cards with Quick Add

**Sound good? Want me to proceed with transforming the homepage?**
