# 🎯 HANDOFF PROMPT: MedusaJS Product Seeding for Howt Foods Replication

## Context Summary

You are picking up a **MedusaJS e-commerce project** where the previous phase (web scraping and data collection) is **100% complete**. Your task is to **seed the MedusaJS backend** with scraped product data from a live WooCommerce site (howtfoods.com.au) that needs to be replicated exactly in MedusaJS.

---

## 🗂️ Project Structure

```
/workspaces/afro/
├── afro-store/                      # MedusaJS v2 Backend (Node.js/TypeScript)
│   ├── src/
│   │   ├── scripts/                 # ← YOU WILL CREATE SEED SCRIPTS HERE
│   │   ├── api/
│   │   ├── modules/
│   │   └── ...
│   ├── medusa-config.ts
│   └── package.json
│
├── afro-store-storefront/           # Next.js 15 Storefront (React/TypeScript)
│   └── src/
│
├── scraped_products.json            # 🔥 222 PRODUCTS - YOUR PRIMARY DATA SOURCE
├── site_architecture.json           # Navigation, footer, theme data
├── site_structure_map.json          # All 68 pages mapped
├── product_images_organized/        # 36 category folders with product images
│   ├── swallows/
│   ├── grains/
│   ├── fish-and-seafood/
│   └── ... (33 more category folders)
│
├── REPLICATION_GUIDE.md             # Complete implementation roadmap
└── README_SCRAPING.md               # Scraping documentation (for reference)
```

---

## 📊 What Has Been Completed

### ✅ Phase 1: Data Collection (100% Complete)
1. **Site Architecture Analysis**: Complete mapping of original WooCommerce site
   - Theme identified: Cartzilla
   - Navigation structure: 5 menus documented
   - Footer structure: 5 sections documented
   - 68 pages catalogued

2. **Product Scraping**: Successfully scraped from howtfoods.com.au
   - **222 unique products** with full data
   - Regular prices and sale prices extracted
   - Product descriptions and metadata
   - Product handles (slugs) generated
   - SKUs where available

3. **Category Mapping**: Complete category hierarchy
   - **52 categories** organized hierarchically
   - Parent-child relationships preserved
   - Examples: "Hair Products" → "Hair Oil", "Fruits and Vegetables" → "Vegetables" → etc.

4. **Image Organization**: Professional-grade image storage
   - Images downloaded and organized by category
   - **36 category folders** in `product_images_organized/`
   - Filename format: `{handle}_{original-filename}.jpg`
   - Example: `swallows/yam-flour-elubo-isu_Yam-Flour.jpg`

---

## 🎯 YOUR MISSION

**Primary Objective**: Seed the MedusaJS backend with all 222 products, maintaining maximum fidelity to the original site.

### Critical Requirements:
1. **Remove existing demo/seed data** from MedusaJS (if any)
2. **Create proper category hierarchy** (52 categories with parent-child relationships)
3. **Seed all 222 products** with accurate data transformation
4. **Handle pricing correctly** (regular price, sale price, Australian dollars)
5. **Migrate and link product images** properly
6. **Preserve all metadata** (descriptions, SKUs, stock status)
7. **Verify data integrity** after seeding

---

## 📋 Available Data Files

### 1. `scraped_products.json` (PRIMARY DATA SOURCE)
**Location**: `/workspaces/afro/scraped_products.json`  
**Format**: JSON array with 222 products

**Product Schema** (from actual scraping):
```json
{
  "url": "https://howtfoods.com.au/product/yam-flour-elubo-isu-4-5kg/",
  "handle": "yam-flour-elubo-isu-4-5kg",
  "name": "Madam Bose Elubo-Isu Yam Flour 4.5kg",
  "categories": ["Swallows", "Grains", "Provisions"],
  "regular_price": "40.00",
  "sale_price": null,
  "current_price": "40.00",
  "description": "Premium yam flour from West Africa...",
  "image_url": "https://howtfoods.com.au/wp-content/uploads/...",
  "image_path": "product_images_organized/swallows/yam-flour-elubo-isu-4-5kg_Yam-Flour.jpg",
  "image_relative_path": "swallows/yam-flour-elubo-isu-4-5kg_Yam-Flour.jpg",
  "image_category": "swallows",
  "image_filename": "yam-flour-elubo-isu-4-5kg_Yam-Flour.jpg",
  "sku": "YF-4.5KG",
  "in_stock": true
}
```

**Key Fields**:
- `handle`: URL-safe slug (use for MedusaJS product handle)
- `name`: Product title
- `categories`: Array of category names (can belong to multiple categories)
- `regular_price`, `sale_price`, `current_price`: String prices in AUD
- `description`: Full HTML description
- `image_path`: Absolute path to downloaded image
- `image_relative_path`: Relative path (category/filename)
- `sku`: Product SKU (if available)
- `in_stock`: Boolean stock status

### 2. `site_architecture.json`
**Location**: `/workspaces/afro/site_architecture.json`  
**Contains**: Navigation menus, footer structure, theme details

**Useful for**:
- Category ordering and hierarchy
- Featured categories
- Navigation structure

### 3. `product_images_organized/`
**Location**: `/workspaces/afro/product_images_organized/`  
**Structure**: 36 category folders with images

**Categories include**:
```
swallows/
grains/
fish-and-seafood/
hair-products/
personal-hygiene/
fruits-and-vegetables/
meat-and-poultry/
dairy-and-eggs/
sauces-and-spices/
... (27 more)
```

---

## 🔍 What You Need to Research

### **CRITICAL**: Use MCP tools to search official MedusaJS documentation at https://docs.medusajs.com/

You **MUST** figure out:

### 1. How to Remove Existing Seed Data
**Questions to answer**:
- How do I clear demo products from MedusaJS v2?
- What's the correct way to reset the database?
- Do I need to run migrations after clearing?
- Are there any CLI commands for this?

**Search queries**:
```
"remove seed data medusajs v2"
"clear products medusajs"
"reset database medusajs"
"delete all products medusajs admin"
```

### 2. How to Seed Categories with Hierarchy
**Questions to answer**:
- What's the MedusaJS v2 API for creating product categories?
- How do I create parent-child category relationships?
- What fields are required for categories?
- Can I create categories via seed script or need Admin API?

**Search queries**:
```
"medusajs v2 product categories"
"create category hierarchy medusajs"
"parent child categories medusajs"
"seed categories medusajs v2"
```

**Category Hierarchy Example** (from scraped data):
```
Hair Products (parent)
├── Hair Oil (child)
├── Hair Cream (child)
├── Hair Conditioner (child)
└── Relaxer (child)

Fruits and Vegetables (parent)
├── Vegetables (child)
├── Fruits (child)
│   └── Citrus (grandchild)
└── Leaves (child)
```

### 3. How to Seed Products
**Questions to answer**:
- What's the correct MedusaJS v2 product creation API?
- What are the required vs optional fields?
- How do I handle product variants (we have single-variant products)?
- What's the correct way to link products to categories?

**Search queries**:
```
"medusajs v2 create product"
"seed products medusajs v2"
"product schema medusajs v2"
"link product to category medusajs"
```

**Required transformations**:
```typescript
// FROM scraped data:
{
  "name": "Yam Flour 4.5kg",
  "regular_price": "40.00",
  "sale_price": null,
  "categories": ["Swallows", "Grains"]
}

// TO MedusaJS format (you need to research exact schema):
{
  title: "Yam Flour 4.5kg",
  handle: "yam-flour-elubo-isu-4-5kg",
  variants: [{
    title: "Default",
    prices: [{
      amount: 4000,  // cents
      currency_code: "aud"
    }]
  }],
  categories: [/* category IDs */],
  // ... other fields
}
```

### 4. How to Handle Pricing
**Questions to answer**:
- How are prices stored in MedusaJS v2? (cents? decimal?)
- How do I set currency to AUD (Australian dollars)?
- How do I handle sale prices vs regular prices?
- Do I need to create price lists for sales?

**Search queries**:
```
"medusajs v2 pricing"
"currency aud medusajs"
"sale price medusajs"
"price lists medusajs v2"
```

**Price Data** (from scraped products):
- All prices are in Australian dollars (AUD)
- Format: String like "40.00", "35.50"
- Some products have `sale_price` (discounted price)
- `current_price` is the active price (sale or regular)

### 5. How to Handle Product Images
**Questions to answer**:
- Where should product images be stored in MedusaJS?
- How do I link images to products?
- Can I use local file paths or need URLs?
- Do I need to upload images to storage service?

**Search queries**:
```
"medusajs v2 product images"
"upload product images medusajs"
"image storage medusajs"
"local images medusajs"
```

**Image Files Available**:
- All images already downloaded
- Organized in `product_images_organized/{category}/`
- Need to be moved to MedusaJS public directory or uploaded

### 6. How to Create Seed Scripts
**Questions to answer**:
- Where do seed scripts go in MedusaJS v2?
- What's the file structure for seed scripts?
- How do I run seed scripts?
- Do I use migrations or separate seed commands?

**Search queries**:
```
"medusajs v2 seed script"
"seeding data medusajs v2"
"migrations vs seeds medusajs"
"run seed script medusajs"
```

---

## 📐 Implementation Steps (Your Roadmap)

### **STEP 1**: Research MedusaJS v2 Documentation
**Time**: 30-60 minutes  
**Objective**: Answer all questions in "What You Need to Research" section

**Actions**:
1. Use MCP browser tools to search https://docs.medusajs.com/
2. Find official guides for:
   - Product categories API
   - Product creation API
   - Pricing structure
   - Image handling
   - Seeding/migrations
3. Document findings in a new file: `MEDUSA_SEEDING_RESEARCH.md`

### **STEP 2**: Clear Existing Demo Data
**Time**: 15 minutes  
**Objective**: Remove any pre-seeded products/categories from MedusaJS

**Actions**:
1. Identify existing products (via Admin panel or database)
2. Remove demo data (via Admin API or database reset)
3. Verify database is clean
4. Document the process

### **STEP 3**: Create Category Seed Script
**Time**: 1-2 hours  
**Objective**: Create all 52 categories with proper hierarchy

**File to create**: `afro-store/src/scripts/seed-categories.ts`

**Data source**: Extract unique categories from `scraped_products.json`:
```bash
cat scraped_products.json | jq '[.[] | .categories[]] | unique'
```

**Expected categories** (52 total):
```
Bakery, Body Oils, Canned Food and Oil, Cereals, Cheese, Chicken, 
Citrus, Condiments, Dairy and Eggs, Drinks, Dry Fish, Dry Prawns, 
Fish and Seafood, Fresh Prawns, Fresh meat, Frozen Foods, Fruits, 
Fruits and Vegetables, Grains, Hair, Hair Conditioner, Hair Cream, 
Hair Oil, Hair Products, Hair gel, Herbal Drinks, Leaves, Lotions and Creams, 
Meat and Poultry, Milk, Nuts, Oils and vinegar, Packets, Pasta, 
Personal hygiene, Provisions, Relaxer, Sauces, Sauces and Spices, 
Shampoo, Snacks, Soaps, Soft Drinks and Juice, Soup Spices, Swallows, 
Sweets, Sweets and Chips, Tomato paste, Uncategorized, Vegetables, Wipes
```

**Hierarchy to implement**:
- Identify parent categories (e.g., "Hair Products", "Fruits and Vegetables")
- Create parent categories first
- Create child categories with parent references
- Create grandchild categories where applicable

**Script structure**:
```typescript
// Example structure (adjust to MedusaJS v2 API):
const categories = [
  { name: "Hair Products", handle: "hair-products", parent: null },
  { name: "Hair Oil", handle: "hair-oil", parent: "hair-products" },
  // ... etc
];

// Create categories in order (parents before children)
```

### **STEP 4**: Create Product Seed Script
**Time**: 2-3 hours  
**Objective**: Seed all 222 products with complete data

**File to create**: `afro-store/src/scripts/seed-products.ts`

**Data source**: `scraped_products.json`

**Required transformations**:
1. **Price conversion**: "40.00" → 4000 (cents)
2. **Category linking**: Category names → Category IDs
3. **Image handling**: Link to correct image path/URL
4. **Variant creation**: Each product needs at least 1 variant
5. **Handle generation**: Use existing `handle` field from scraped data

**Script logic**:
```typescript
// Pseudo-code:
1. Read scraped_products.json
2. For each product:
   a. Convert price to cents
   b. Look up category IDs by name
   c. Prepare image path/URL
   d. Create product with variant
   e. Link to categories
   f. Log success/failure
3. Save results
```

**Handle edge cases**:
- Products with missing images (some may only have placeholders)
- Products with multiple categories
- Products with sale prices
- Products without SKUs

### **STEP 5**: Handle Product Images
**Time**: 1-2 hours  
**Objective**: Move/upload images and link to products

**Actions**:
1. Determine MedusaJS image storage location (public folder? S3?)
2. Move images from `product_images_organized/` to correct location
3. Ensure category folder structure is preserved OR flatten with unique names
4. Update image URLs in product records

**Options to research**:
- Option A: Copy to `afro-store/public/images/products/`
- Option B: Upload to cloud storage (S3, Cloudinary)
- Option C: Use existing paths if MedusaJS supports local filesystem

### **STEP 6**: Test and Verify
**Time**: 1 hour  
**Objective**: Ensure all data seeded correctly

**Verification checklist**:
- [ ] All 52 categories exist in database
- [ ] Category hierarchy is correct (parent-child relationships)
- [ ] All 222 products exist in database
- [ ] Products linked to correct categories
- [ ] Prices are correct (in cents, AUD currency)
- [ ] Product images display correctly
- [ ] Product handles are URL-safe
- [ ] Descriptions are preserved
- [ ] SKUs are present where available
- [ ] Stock status is correct

**Test in MedusaJS Admin**:
1. Open admin panel: http://localhost:9000/app
2. Browse to Products section
3. Verify products appear
4. Check a few products in detail:
   - Image loads
   - Price displays correctly
   - Categories are linked
   - Description is readable

**Test in Storefront**:
1. Open storefront: http://localhost:8000
2. Browse categories
3. View product pages
4. Verify data displays correctly

---

## 🛠️ Technical Specifications

### MedusaJS Environment
- **Version**: MedusaJS v2 (latest)
- **Database**: PostgreSQL
- **Framework**: Node.js + TypeScript
- **Admin URL**: http://localhost:9000/app
- **API URL**: http://localhost:9000

### Currency Configuration
- **Primary currency**: AUD (Australian Dollar)
- **Price format**: Cents (e.g., $40.00 = 4000)
- **Tax**: TBD (may need to configure)

### Product Characteristics
- **Total products**: 222
- **Average categories per product**: 3-4
- **Products with images**: ~220 (2 may have placeholders only)
- **Products with sale prices**: ~30-40%
- **Products with SKUs**: ~80%

### Image Specifications
- **Total images**: ~220 files
- **Format**: JPG
- **Organized**: By category (36 folders)
- **Naming**: {handle}_{original-name}.jpg
- **Average size**: 50-200 KB

---

## 🎓 Key Concepts to Understand

### 1. MedusaJS Product Structure
```
Product
├── title (string)
├── handle (string, unique, URL-safe)
├── description (string, can be HTML)
├── thumbnail (image URL)
├── images (array of image URLs)
├── categories (array of category IDs/references)
└── variants (array)
    └── Variant
        ├── title (string)
        ├── sku (string)
        ├── inventory_quantity (number)
        └── prices (array)
            └── Price
                ├── amount (number, in cents)
                └── currency_code (string, e.g., "aud")
```

### 2. Category Hierarchy
- Categories can have parent-child relationships
- Products can belong to multiple categories
- Categories have handles (URL slugs)

### 3. Price vs Sale Price
- MedusaJS may use "Price Lists" for sales
- OR: Create variants for sale items
- Research needed to determine best approach

### 4. Single-Variant Products
- All scraped products are single-variant (no size/color options)
- Still need to create a variant for each product
- Variant title can be "Default" or same as product title

---

## 📝 Deliverables

By the end of your work, you should have:

### 1. Research Documentation
**File**: `MEDUSA_SEEDING_RESEARCH.md`
- All findings from MedusaJS documentation
- API endpoints and schemas
- Best practices discovered
- Code examples from documentation

### 2. Category Seed Script
**File**: `afro-store/src/scripts/seed-categories.ts`
- Creates all 52 categories
- Implements parent-child hierarchy
- Handles errors gracefully
- Logs progress

### 3. Product Seed Script
**File**: `afro-store/src/scripts/seed-products.ts`
- Seeds all 222 products
- Transforms data correctly
- Links images
- Handles categories
- Logs progress and errors

### 4. Seed Execution Documentation
**File**: `SEEDING_PROCESS.md`
- Step-by-step instructions to run seeds
- Commands to execute
- Expected output
- Troubleshooting guide

### 5. Verification Report
**File**: `SEED_VERIFICATION.md`
- Checklist of what was verified
- Screenshots or data exports
- Any issues found
- Products/categories that failed (if any)

---

## 🚨 Critical Constraints

### Must Follow:
1. **Maximum fidelity**: Preserve ALL data from scraped products
2. **No data loss**: All 222 products must be seeded
3. **Category hierarchy**: Must match original site structure
4. **Price accuracy**: Must handle AUD currency correctly
5. **Image preservation**: All images must be accessible
6. **Handle uniqueness**: Product handles must be unique and URL-safe

### Must Avoid:
1. **Hardcoding**: Don't hardcode category IDs - look them up
2. **Data truncation**: Don't truncate descriptions or names
3. **Skipping errors**: Log and handle all errors properly
4. **Manual work**: Everything should be scripted and repeatable
5. **Assumptions**: Research MedusaJS v2 API - don't assume from v1 docs

---

## 🔗 Useful Commands

### Inspect Scraped Data
```bash
# View first 5 products
cat scraped_products.json | jq '.[0:5]'

# Get all unique categories
cat scraped_products.json | jq '[.[] | .categories[]] | unique | sort'

# Count products by category
cat scraped_products.json | jq '[.[] | .categories[]] | group_by(.) | map({category: .[0], count: length}) | sort_by(-.count)'

# Find products with sale prices
cat scraped_products.json | jq '[.[] | select(.sale_price != null)]'

# Check image files
ls -la product_images_organized/swallows/
```

### MedusaJS Commands (likely, verify in docs)
```bash
# Start backend
cd afro-store
npm run dev

# Run seed script (may vary)
npm run seed

# Access admin panel
open http://localhost:9000/app

# Check database
psql -U postgres -d medusa_db
```

### Category Analysis
```bash
# Extract category hierarchy from scraped data
cat scraped_products.json | jq '[.[] | .categories[]] | unique | sort' > categories_list.txt

# Count products per category
cat scraped_products.json | jq '[.[] | {name: .name, categories: .categories}]' > products_categories.json
```

---

## 💡 Pro Tips

### 1. Start Small
- Don't seed all 222 products at once
- Test with 5-10 products first
- Verify data looks correct
- Then run full seed

### 2. Category Order Matters
- Create parent categories before children
- Use a topological sort if needed
- Consider creating categories in batches by level

### 3. Handle Failures Gracefully
- Wrap API calls in try-catch
- Log failed products to a file
- Continue seeding even if one product fails
- Generate a failure report at the end

### 4. Idempotency
- Make seed scripts re-runnable
- Check if category/product exists before creating
- Use upsert logic if available
- Don't duplicate data on re-run

### 5. Performance
- Use batch operations if API supports it
- Add progress logging (e.g., "Seeded 50/222 products")
- Consider parallel processing for images
- But respect API rate limits

---

## 🎯 Success Criteria

You will know you're done when:

- ✅ All demo data removed from MedusaJS
- ✅ All 52 categories created with correct hierarchy
- ✅ All 222 products seeded successfully
- ✅ All product images accessible and displaying
- ✅ Prices correctly converted to cents (AUD)
- ✅ Categories correctly linked to products
- ✅ Products visible in MedusaJS Admin panel
- ✅ Products accessible via MedusaJS API
- ✅ Products display correctly in storefront
- ✅ All seed scripts documented and runnable
- ✅ Verification report completed

---

## 📞 Getting Help

### If You Get Stuck:

1. **Check the scraped data**: All info is in `scraped_products.json`
2. **Review REPLICATION_GUIDE.md**: High-level roadmap
3. **Search MedusaJS docs**: https://docs.medusajs.com/
4. **Check GitHub issues**: MedusaJS GitHub repo
5. **Use MCP tools**: Browser and search extensions

### Common Issues:

**"Category not found"**
- Ensure categories seeded before products
- Check spelling of category names
- Verify category IDs are correct

**"Price validation error"**
- Ensure prices are in cents (multiply by 100)
- Check currency code is correct ("aud")
- Verify price is a number, not string

**"Image not displaying"**
- Check image path is accessible
- Verify image URL format
- Ensure images copied to correct directory

**"Product handle conflict"**
- Handles must be unique
- Check for duplicate handles in scraped data
- Add suffix if needed (e.g., "-v2")

---

## 🚀 Start Here

### Your First 5 Actions:

1. **Read this entire document** (15 minutes)
2. **Inspect the scraped data files** (10 minutes)
   ```bash
   cat scraped_products.json | jq '.[0]'
   ls -la product_images_organized/
   ```
3. **Start MedusaJS backend** (2 minutes)
   ```bash
   cd afro-store && npm run dev
   ```
4. **Access MedusaJS Admin** and check existing data (5 minutes)
   - Open: http://localhost:9000/app
   - Browse Products and Categories
5. **Begin documentation research** (30-60 minutes)
   - Search MedusaJS docs for seeding, categories, products
   - Document findings in `MEDUSA_SEEDING_RESEARCH.md`

---

## 📚 Reference Files

**Essential reading** (in order):
1. This document (you're reading it)
2. `REPLICATION_GUIDE.md` - High-level project roadmap
3. `scraped_products.json` - Your data source
4. `site_architecture.json` - Navigation and structure reference
5. MedusaJS v2 documentation - Official API docs

**Supporting files**:
- `README_SCRAPING.md` - How data was collected (FYI only)
- `site_structure_map.json` - All site pages (for later phases)
- `NEXT_STEPS.md` - Overview of project status

---

## 🎓 Final Notes

### This is a Critical Milestone
Product seeding is the **foundation** of the entire project. Nothing else can proceed until products are in MedusaJS:
- Navigation needs products/categories to display
- Homepage needs products to feature
- Search needs products to index
- Cart needs products to add

### Quality Over Speed
Take the time to:
- Research the correct MedusaJS v2 APIs thoroughly
- Test with small datasets before full seed
- Verify data integrity after seeding
- Document everything for future reference

### You Have Everything You Need
- ✅ Complete product data (222 products)
- ✅ Organized images (36 categories)
- ✅ Category hierarchy mapped
- ✅ Prices and metadata ready
- ✅ Working MedusaJS installation

The scraped data is **production-ready**. Your job is to transform it into MedusaJS format and seed it correctly.

---

**Ready? Start with Action #1: Read this document thoroughly, then begin your research of the MedusaJS v2 documentation.** 🚀

Good luck! You've got this! 💪
