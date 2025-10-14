# Regression Testing Checklist - AfroMart Sydney
**Purpose:** Detect unintended side effects before they reach users  
**When to use:** After ANY code changes, especially to shared utilities

---

## Critical User Flows to Test

### 🛒 **E-Commerce Core**
- [ ] **Add to Cart** - Product detail page → Add to cart → View cart
- [ ] **Checkout** - Cart → Checkout → Payment (test flow, not actual payment)
- [ ] **Product Search** - Hero search bar → `/store?q=query` → Results display
- [ ] **Category Navigation** - Side menu → Category page → Products load
- [ ] **Product Detail** - Category → Click product → Detail page with images

### 🏠 **Homepage**
- [ ] **Hero Search** - Type query → Submit → Redirects to `/store?q=`
- [ ] **Deals Carousel** - Loads products with sale badges and images
- [ ] **Featured Products** - Displays products with images
- [ ] **Quick Actions** - All 4 buttons navigate correctly
- [ ] **Category Cards** - Grid displays, images load, links work

### 🔍 **Search & Filtering**
- [ ] **Search from Hero** - `/store?q=chips` returns chip products
- [ ] **Search from Nav** - Header search bar works
- [ ] **Empty Search** - Handles gracefully
- [ ] **No Results** - Shows appropriate message

### 📦 **Product Features**
- [ ] **Images Load** - All product images display (not broken)
- [ ] **Prices Display** - Regular and sale prices visible
- [ ] **Related Products** - Show on detail pages with images
- [ ] **Product Variants** - Can select different variants
- [ ] **Inventory** - Out of stock handling (if enabled)

### 🧭 **Navigation**
- [ ] **Side Menu** - Opens, categories load, links work
- [ ] **Footer Links** - All footer links navigate correctly
- [ ] **Breadcrumbs** - Accurate on category/product pages
- [ ] **Country Selector** - Can switch regions (if multi-region)

### 👤 **Account & Orders**
- [ ] **Login** - `/account` → Login flow
- [ ] **Orders** - `/account/orders` → Lists orders
- [ ] **Profile** - `/account/profile` → Can edit
- [ ] **Wishlist** - `/wishlist` → Products display

---

## Automated Checks (Before Manual Testing)

### TypeScript Compilation
```bash
cd afro-store-storefront
yarn build
# Should complete with 0 errors
```

### Lint Errors
```bash
yarn lint
# Fix all errors before proceeding
```

### API Health
```bash
curl http://localhost:9000/health
# Should return {"status": "OK"}
```

### Key API Endpoints
```bash
# Products fetch with optimized fields
curl "http://localhost:9000/store/products?limit=5&fields=*variants.calculated_price,+images"

# Categories without products (navigation)
curl "http://localhost:9000/store/product-categories?limit=5&fields=id,handle,name"
```

---

## Post-Optimization Verification

After changing data fetching logic (like field selection), verify:

### 1. **Network Payloads**
Open DevTools → Network tab → Filter XHR/Fetch

**Check:**
- [ ] Product listings have `images` field
- [ ] Categories for nav don't include full product arrays
- [ ] Deals include `metadata` for sale prices
- [ ] Related products have minimal fields

### 2. **Visual Regression**
**Take screenshots and compare:**
- Homepage before/after
- Category page before/after
- Product detail before/after
- Search results before/after

### 3. **Performance Metrics**
```bash
# Lighthouse CLI
npx lighthouse http://localhost:8000/au --view

# Key metrics to check:
# - Performance score > 80
# - Largest Contentful Paint < 2.5s
# - Time to Interactive < 3.8s
```

---

## Common Failure Patterns

### ❌ **Images Not Loading**
**Symptom:** Products display but thumbnails are blank  
**Cause:** Missing `+images` in field selection  
**Check:** Search for `fields:` in modified files

### ❌ **404 on Navigation**
**Symptom:** Clicking link shows 404 page  
**Cause:** Route doesn't exist or incorrect href  
**Check:** Verify route exists in `src/app/[countryCode]/(main)/`

### ❌ **Infinite Loading**
**Symptom:** Components show loading state forever  
**Cause:** API call failing or wrong field syntax  
**Check:** Browser console for errors, network tab for failed requests

### ❌ **Wrong Data Displayed**
**Symptom:** Products show incorrect prices/names  
**Cause:** Using wrong helper function or missing metadata  
**Check:** Verify correct `listProducts*()` variant used

---

## Playwright E2E Test Suite (Future)

Create `tests/e2e/critical-flows.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Critical User Flows', () => {
  test('Search from hero redirects correctly', async ({ page }) => {
    await page.goto('/au')
    await page.fill('[data-testid="hero-search"]', 'chips')
    await page.click('[data-testid="hero-search-button"]')
    
    // Should redirect to /store?q=chips
    await expect(page).toHaveURL(/\/store\?q=chips/)
    
    // Should show results
    const products = page.locator('[data-testid="product-card"]')
    await expect(products).toHaveCountGreaterThan(0)
  })

  test('Deals carousel loads with images', async ({ page }) => {
    await page.goto('/au')
    
    // Wait for deals carousel
    const carousel = page.locator('[data-testid="deals-carousel"]')
    await expect(carousel).toBeVisible()
    
    // Check first product has image
    const firstImage = carousel.locator('img').first()
    await expect(firstImage).toHaveAttribute('src', /.+/)
  })

  test('Add to cart flow works', async ({ page }) => {
    await page.goto('/au/products/test-product')
    await page.click('[data-testid="add-to-cart"]')
    
    // Cart count should increase
    const cartBadge = page.locator('[data-testid="cart-count"]')
    await expect(cartBadge).toContainText('1')
  })
})
```

**Run tests:**
```bash
yarn playwright test
```

---

## Quick Smoke Test (5 min)

Run this after every code change:

1. **Homepage loads** - Visit `/au`
2. **Search works** - Type "chips" → Submit → See results
3. **Category works** - Click "Swallows" → See products
4. **Product detail** - Click any product → See images & price
5. **Add to cart** - Click "Add to Cart" → Cart badge updates

If all 5 pass → Safe to deploy  
If any fail → Debug before proceeding

---

## Proactive Detection Strategies

### 1. **Pre-commit Hooks**
Add to `.husky/pre-commit`:
```bash
#!/bin/sh
yarn lint
yarn tsc --noEmit
```

### 2. **GitHub Actions CI**
`.github/workflows/test.yml`:
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: yarn install
      - run: yarn build
      - run: yarn lint
      - run: yarn playwright test
```

### 3. **Automated Visual Regression**
Use tools like:
- **Percy.io** - Automated screenshot comparison
- **Chromatic** - Storybook visual testing
- **BackstopJS** - Open source visual regression

### 4. **Bundle Size Monitoring**
Check after optimizations:
```bash
yarn build
# Check .next/static/ file sizes
du -sh .next/static/chunks/*
```

---

## Emergency Rollback Procedure

If a breaking change is deployed:

1. **Immediate revert:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Identify broken flow:**
   - Check error logs
   - Test affected pages
   - Review recent commits

3. **Fix forward:**
   - Create hotfix branch
   - Fix specific issue
   - Test thoroughly
   - Deploy fix

---

## Change Log

| Date | Change | Tested By | Status |
|------|--------|-----------|--------|
| 2025-10-12 | Field optimization | AI Agent | ✅ Pass |
| 2025-10-12 | Search redirect fix | AI Agent | ✅ Pass |

---

**Remember:** 5 minutes of testing saves hours of debugging! 🚀
