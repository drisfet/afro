# 🎯 Howt Foods → MedusaJS Replication Guide

**Complete roadmap for replicating howtfoods.com.au with maximum fidelity**

## 📊 Current Status

### ✅ Completed Phase 1: Data Collection
- **Site Architecture Analysis**: Complete mapping of original site structure
- **Product Scraping**: 222 unique products with full data
- **Image Organization**: Category-based folder structure
- **Navigation Mapping**: All menus, footer sections, and links documented

### 📁 Available Data Files
```
scraped_products.json          - 222 products with prices, categories, descriptions
site_structure_map.json        - 68 pages mapped with full link structure
site_architecture.json         - Theme, navigation, footer, features analysis
product_images_organized/      - Images organized by category (36 folders)
category_product_urls/         - 47 category files with product URLs
```

---

## 🚀 Next Immediate Steps

### **STEP 1: Create MedusaJS Seed Script** ⏰ Priority: HIGH
**Objective**: Transform scraped data into MedusaJS-compatible seed format

#### Tasks:
1. **Create seed script** (`afro-store/src/scripts/seed-products.ts`)
   - Read `scraped_products.json`
   - Transform to MedusaJS product structure
   - Handle categories, prices, images, variants
   - Generate unique handles and SKUs

2. **Category Mapping**
   ```typescript
   // Map WooCommerce categories → MedusaJS categories
   scraped_categories → medusa_product_categories
   
   Original categories (52):
   - Swallows, Grains, Fruits and Vegetables, etc.
   → Create parent/child hierarchy in MedusaJS
   ```

3. **Image Migration**
   ```bash
   # Copy organized images to MedusaJS public/images
   cp -r product_images_organized/* afro-store/public/images/products/
   ```

4. **Price Handling**
   ```typescript
   // Each product has:
   regular_price: "$40.00"
   sale_price: "$35.00" or null
   current_price: "$35.00"
   
   // Convert to MedusaJS:
   variants: [{
     prices: [{
       amount: 4000,  // cents
       currency_code: "aud"
     }]
   }]
   ```

**Deliverables**:
- ✅ `seed-products.ts` - Product seeding script
- ✅ `seed-categories.ts` - Category hierarchy script
- ✅ Images moved to public directory
- ✅ Test seed on dev database

**Files to Create**:
```
afro-store/src/scripts/
├── seed-products.ts          # Main product seeder
├── seed-categories.ts        # Category hierarchy
├── seed-collections.ts       # Product collections/groupings
└── utils/
    ├── transform-product.ts  # Data transformation helpers
    └── handle-images.ts      # Image path management
```

---

### **STEP 2: Storefront Navigation Implementation** ⏰ Priority: HIGH
**Objective**: Replicate exact navigation structure from original site

#### Original Site Navigation (from site_architecture.json):
```json
Menus (5 total):
1. Primary Menu (menu-1): Home, Pages, About, Contacts, Shop, Account, Orders, Payment
2. Category Menu (menu-2): 20 product categories
3. Mobile Menu (menu-3): Duplicate of menu-2
4. Secondary Menu (menu-4): Duplicate of menu-1
5. Footer Menu: Product catalog links
```

#### Tasks:
1. **Update Nav Component** (`afro-store-storefront/src/modules/layout/templates/nav/index.tsx`)
   ```tsx
   // Current: Simple "Medusa Store" link
   // Replace with:
   - Logo: "Howt Foods Melbourne"
   - Search bar (with functionality)
   - Category mega-menu dropdown
   - Account link
   - Cart with count
   ```

2. **Create Category Mega Menu**
   ```tsx
   // New file: src/modules/layout/components/category-menu/index.tsx
   - 52 categories organized hierarchically
   - Parent categories with child dropdowns
   - Matches original site structure exactly
   ```

3. **Add Mobile Navigation**
   ```tsx
   // Enhanced side-menu with:
   - All 52 categories
   - Account links
   - Static pages (About, Contact, etc.)
   ```

**Deliverables**:
- ✅ Updated navigation header
- ✅ Category mega-menu component
- ✅ Mobile-responsive navigation
- ✅ Search functionality integrated

**Files to Modify**:
```
afro-store-storefront/src/modules/layout/
├── templates/nav/index.tsx              # UPDATE: Main nav
├── components/
│   ├── category-menu/                   # NEW: Mega menu
│   │   ├── index.tsx
│   │   └── category-dropdown.tsx
│   ├── side-menu/index.tsx              # UPDATE: Add categories
│   └── search-bar/                      # NEW: Search component
│       └── index.tsx
```

---

### **STEP 3: Footer Replication** ⏰ Priority: MEDIUM
**Objective**: Match original footer structure exactly

#### Original Footer (from site_architecture.json):
```
5 sections:
1. Product Catalog (7 links)
2. Company (7 links: About, Contact, Order Tracking, Terms, etc.)
3. Follow us (3 social links: Facebook, Instagram, YouTube)
4. Stay informed (Newsletter signup)
5. Download our app (App Store, Google Play links)

Additional:
- Payment methods image
- Copyright notice
```

#### Tasks:
1. **Update Footer Component** (`afro-store-storefront/src/modules/layout/templates/footer/index.tsx`)
   ```tsx
   // Replace current generic footer with 5-column layout
   - Column 1: Top product categories
   - Column 2: Company links
   - Column 3: Social media
   - Column 4: Newsletter signup
   - Column 5: App download links
   ```

2. **Add Social Links**
   ```tsx
   Facebook: https://www.facebook.com/112041077161173/posts/536521561379787/?d=n
   Instagram: https://instagram.com/hangingoutwithtemi?igshid=YzAyZWRlMzg=/
   YouTube: https://youtube.com/channel/UCib9gyIiycscVJlpkO2DrlA/
   ```

3. **Newsletter Component**
   ```tsx
   // New: src/modules/layout/components/newsletter-signup/
   - Email input
   - Subscribe button
   - Integration with MedusaJS or external service
   ```

**Deliverables**:
- ✅ 5-column footer layout
- ✅ All links functional
- ✅ Social media integration
- ✅ Newsletter signup form

---

### **STEP 4: Missing Pages Creation** ⏰ Priority: MEDIUM
**Objective**: Create all pages that exist on original site but not in MedusaJS starter

#### Pages to Create (from site_structure_map.json):
```
Currently Missing:
1. About Us (/about-us) - MISSING
2. Contact (/contact-us) - MISSING
3. Order Tracking (/order-tracking) - MISSING
4. Refund and Returns Policy (/refund-and-returns-policy) - MISSING
5. Privacy Policy (/privacy-policy) - EXISTS (needs content update)
6. Terms and Conditions (/terms-and-conditions) - EXISTS (needs content update)
7. Wishlist (/wishlist-2) - MISSING
8. Shop (All Products) (/shop) - EXISTS as /store

Currently Exist:
✓ Home (/)
✓ Store (/store)
✓ Cart (/cart)
✓ Account (/account)
✓ Categories (/categories/[handle])
✓ Products (/products/[handle])
✓ Checkout (/checkout)
```

#### Tasks:
1. **Create About Us Page**
   ```bash
   # Create: afro-store-storefront/src/app/[countryCode]/(main)/about-us/page.tsx
   - Company history
   - Mission statement
   - Team information
   ```

2. **Create Contact Page**
   ```bash
   # Create: afro-store-storefront/src/app/[countryCode]/(main)/contact/page.tsx
   - Contact form
   - Store location (Melbourne)
   - Phone: +610383797384
   - Email: info@howtfoods.com.au
   ```

3. **Create Order Tracking Page**
   ```bash
   # Create: afro-store-storefront/src/app/[countryCode]/(main)/order-tracking/page.tsx
   - Order ID input
   - Tracking number lookup
   - Order status display
   ```

4. **Create Wishlist Page**
   ```bash
   # Create: afro-store-storefront/src/app/[countryCode]/(main)/wishlist/page.tsx
   - Saved products list
   - Add to cart from wishlist
   - Remove from wishlist
   ```

5. **Create Legal Pages**
   ```bash
   # Update: afro-store-storefront/src/app/[countryCode]/(main)/refund-policy/page.tsx
   # Update: afro-store-storefront/src/app/[countryCode]/(main)/privacy-policy/page.tsx
   # Update: afro-store-storefront/src/app/[countryCode]/(main)/terms/page.tsx
   ```

**Deliverables**:
- ✅ 7 new pages created
- ✅ All pages accessible from navigation
- ✅ Content populated (or placeholder)
- ✅ Responsive design matching site theme

**Files to Create**:
```
afro-store-storefront/src/app/[countryCode]/(main)/
├── about-us/
│   └── page.tsx                    # NEW
├── contact/
│   ├── page.tsx                    # NEW
│   └── components/contact-form.tsx # NEW
├── order-tracking/
│   └── page.tsx                    # NEW
├── wishlist/
│   ├── page.tsx                    # NEW
│   └── layout.tsx                  # NEW
├── refund-policy/
│   └── page.tsx                    # UPDATE
├── privacy-policy/
│   └── page.tsx                    # UPDATE
└── terms/
    └── page.tsx                    # UPDATE
```

---

### **STEP 5: Homepage Hero & Features** ⏰ Priority: MEDIUM
**Objective**: Replicate homepage layout with hero slider and features

#### Original Homepage Features (from site_architecture.json):
```json
Hero: {
  type: "slider",
  has_images: true,
  has_cta: false
}

Features:
✓ WooCommerce integration
✗ Breadcrumbs (not present)
✗ Live Search (not present)
✓ Newsletter signup
✗ Chat widget (not present)
✗ Reviews (not present)
✗ Recently viewed (not present)
```

#### Tasks:
1. **Create Hero Slider Component**
   ```tsx
   // New: src/modules/home/components/hero-slider/
   - Image carousel/slider
   - Navigation dots
   - Auto-advance
   - Responsive images
   ```

2. **Add Featured Categories Section**
   ```tsx
   // Update: src/modules/home/components/featured-products/
   - Show top 8-10 categories with images
   - Link to category pages
   - Grid layout
   ```

3. **Add Newsletter Signup Section**
   ```tsx
   // New: src/modules/home/components/newsletter-section/
   - Prominent placement above footer
   - Email capture form
   - Subscribe button
   ```

**Deliverables**:
- ✅ Hero slider with 3-5 slides
- ✅ Featured categories grid
- ✅ Newsletter section
- ✅ Mobile-responsive layout

---

### **STEP 6: Styling & Theme Customization** ⏰ Priority: LOW
**Objective**: Match visual design of original site (Cartzilla theme)

#### Original Theme Details:
```
Theme: Cartzilla (WooCommerce/Bootstrap theme)
Color Scheme: 
- Primary: Likely green/African colors
- Background: White with light gray sections
- Text: Dark gray/black
Header: Fixed/sticky with box shadow
```

#### Tasks:
1. **Extract Color Palette**
   ```bash
   # Visit https://howtfoods.com.au and extract:
   - Primary brand colors
   - Secondary colors
   - Button styles
   - Link colors
   ```

2. **Update Tailwind Config**
   ```javascript
   // afro-store-storefront/tailwind.config.js
   theme: {
     extend: {
       colors: {
         'howt-primary': '#....',
         'howt-secondary': '#....',
         // etc.
       }
     }
   }
   ```

3. **Custom Typography**
   ```css
   /* Update global styles to match original */
   - Font families
   - Heading sizes
   - Line heights
   ```

**Deliverables**:
- ✅ Color palette extracted
- ✅ Tailwind config updated
- ✅ Typography matched
- ✅ Component styling consistent

---

## 📋 Implementation Checklist

### Phase 2A: Backend Data (Week 1)
- [ ] Create `seed-products.ts` script
- [ ] Create `seed-categories.ts` script
- [ ] Transform all 222 products to MedusaJS format
- [ ] Create category hierarchy (52 categories)
- [ ] Test seed on development database
- [ ] Migrate product images to public directory
- [ ] Verify all products accessible via API

### Phase 2B: Navigation & Structure (Week 1-2)
- [ ] Update main navigation header
- [ ] Create category mega-menu component
- [ ] Update mobile side menu
- [ ] Implement search functionality
- [ ] Update footer with 5 columns
- [ ] Add social media links
- [ ] Create newsletter signup component

### Phase 2C: Pages & Content (Week 2)
- [ ] Create About Us page
- [ ] Create Contact page with form
- [ ] Create Order Tracking page
- [ ] Create Wishlist page
- [ ] Update Privacy Policy page
- [ ] Update Terms and Conditions page
- [ ] Create Refund Policy page

### Phase 2D: Homepage & Features (Week 2-3)
- [ ] Create hero slider component
- [ ] Add featured categories section
- [ ] Add newsletter section to homepage
- [ ] Optimize homepage performance
- [ ] Add loading states

### Phase 2E: Styling & Polish (Week 3)
- [ ] Extract brand colors from original site
- [ ] Update Tailwind configuration
- [ ] Match typography styles
- [ ] Ensure mobile responsiveness
- [ ] Cross-browser testing
- [ ] Performance optimization

### Phase 3: Testing & Launch (Week 4)
- [ ] End-to-end testing all flows
- [ ] Verify all 222 products display correctly
- [ ] Test checkout process
- [ ] Test account management
- [ ] Verify image loading
- [ ] SEO optimization
- [ ] Deploy to staging
- [ ] Client review
- [ ] Production deployment

---

## 🛠️ Technical Architecture

### Data Flow
```
scraped_products.json
    ↓
seed-products.ts (transformation)
    ↓
MedusaJS Database (PostgreSQL)
    ↓
MedusaJS API
    ↓
Next.js Storefront
    ↓
User Browser
```

### Category Hierarchy Example
```
Fruits and Vegetables (parent)
├── Vegetables (child)
├── Fruits (child)
│   └── Citrus (grandchild)
└── Leaves (child)

Hair Products (parent)
├── Hair Oil (child)
├── Hair Cream (child)
├── Hair Conditioner (child)
├── Hair Gel (child)
└── Relaxer (child)
```

### Image Structure
```
afro-store/public/images/products/
├── swallows/
│   ├── yam-flour-elubo-isu_[image].jpg
│   └── ...
├── grains/
├── fish-and-seafood/
└── ... (36 category folders)
```

---

## 📊 Success Metrics

### Fidelity Score (Target: 95%+)
- ✅ All 222 products migrated
- ✅ All 52 categories preserved
- ✅ Navigation structure matches 100%
- ✅ Footer structure matches 100%
- ✅ All static pages created
- ✅ Visual design similarity 90%+

### Performance Targets
- Homepage load: < 2 seconds
- Product page load: < 1.5 seconds
- Category page load: < 2 seconds
- Lighthouse score: 90+ (Performance, Accessibility, SEO)

### Functional Requirements
- ✅ All products searchable
- ✅ Category filtering works
- ✅ Cart functionality complete
- ✅ Checkout process smooth
- ✅ Account management functional
- ✅ Order tracking available
- ✅ Mobile fully responsive

---

## 🔧 Development Commands

```bash
# Backend (MedusaJS)
cd afro-store
npm run seed              # Run seed scripts
npm run dev               # Start backend dev server
npm run build             # Build for production

# Storefront (Next.js)
cd afro-store-storefront
npm run dev               # Start storefront dev server
npm run build             # Build for production
npm run start             # Start production server

# Scraping (if needed)
python3 map_site_structure.py          # Re-map site structure
python3 analyze_site_architecture.py   # Re-analyze architecture
python3 run_scraping_pipeline.py       # Re-scrape products
```

---

## 📚 Reference Documentation

### Key Files for Reference
1. **site_architecture.json** - Complete site structure, menus, footer
2. **site_structure_map.json** - All 68 pages with links and metadata
3. **scraped_products.json** - All 222 products with full data
4. **README_SCRAPING.md** - Scraping pipeline documentation

### MedusaJS Documentation
- [Product Management](https://docs.medusajs.com/resources/products)
- [Category Management](https://docs.medusajs.com/resources/product-categories)
- [Seeding Data](https://docs.medusajs.com/learn/advanced-development/backend/migrations/seeding)
- [Storefront Architecture](https://docs.medusajs.com/resources/storefront-architecture)

---

## 🎯 Priority Summary

**THIS WEEK** (Start immediately):
1. ✅ Add node_modules to .gitignore (DONE)
2. 🔥 Create seed scripts for products
3. 🔥 Update navigation header
4. 🔥 Create About and Contact pages

**NEXT WEEK**:
5. Update footer structure
6. Create order tracking page
7. Implement hero slider
8. Create wishlist functionality

**FOLLOWING WEEKS**:
9. Style matching and polish
10. Testing and optimization
11. Deployment preparation

---

## 💡 Pro Tips

1. **Start with data seeding** - Nothing else matters until products are in MedusaJS
2. **Use the JSON files** - All data is already structured and ready
3. **Maintain category structure** - The 52 categories are already organized hierarchically
4. **Test incrementally** - Seed 10 products first, verify, then do all 222
5. **Keep images organized** - The category folders will help with performance
6. **Mobile-first** - Many users will shop from mobile devices

---

**Ready to begin? Start with STEP 1: Create MedusaJS Seed Script** 🚀
