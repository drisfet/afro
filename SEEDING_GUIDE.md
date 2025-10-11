# Howt Foods MedusaJS Seeding Guide

Complete guide to transform and seed 222 products from scraped data into MedusaJS v2.

## 📋 Prerequisites

- Node.js installed
- MedusaJS backend running
- Scraped product data (`scraped_products.json`) in project root

## 🚀 Quick Start

### Step 1: Transform Scraped Data

Convert the scraped product data to MedusaJS-compatible format:

```bash
cd /workspaces/afro
node transform-products.js
```

**What this does:**
- Reads `scraped_products.json` (222 products)
- Converts prices from AUD dollars to cents
- Validates and cleans category data
- Creates category hierarchy
- Outputs:
  - `medusa-products.json` - Transformed products
  - `medusa-categories.json` - Category hierarchy
  - `transformation-errors.json` - Any errors (if they occur)

**Expected output:**
```
✅ Successfully transformed: 222 products
📁 Output files:
   - /workspaces/afro/medusa-products.json
   - /workspaces/afro/medusa-categories.json
```

### Step 2: Seed MedusaJS Database

```bash
cd /workspaces/afro/afro-store
npm run seed
```

**What this seeds:**
1. ✅ Store configuration (AUD currency)
2. ✅ Australia region
3. ✅ Tax regions
4. ✅ Stock location (Howt Foods Warehouse)
5. ✅ Shipping options (Standard & Express)
6. ✅ Product categories (52 categories with hierarchy)
7. ✅ Products (222 products with images & pricing)
8. ✅ API keys

**Seeding process:**
- Categories created first (parents before children)
- Products created in batches of 50
- Inventory management DISABLED for unlimited stock
- Images linked via URLs

## 📊 Data Overview

### Products
- **Total**: 222 products
- **Categories**: 52 (with parent-child hierarchy)
- **Images**: ~220 product images
- **Currency**: Australian Dollar (AUD)
- **Inventory**: Unlimited (management disabled)

### Category Hierarchy Examples
```
Hair Products
├── Hair Oil
├── Hair Cream
├── Hair Conditioner
├── Relaxer
├── Hair gel
└── Hair

Fruits and Vegetables
├── Vegetables
├── Fruits
└── Leaves

Fish and Seafood
├── Dry Fish
├── Dry Prawns
├── Fresh Prawns
└── Frozen Foods
```

### Pricing
- **Format**: Cents (e.g., $40.00 = 4000 cents)
- **Regular prices**: Preserved from scraped data
- **Sale prices**: Stored in metadata
- **Current price**: Active selling price

## 🔍 Verification

### Check in MedusaJS Admin

1. **Start the backend** (if not running):
   ```bash
   cd /workspaces/afro/afro-store
   npm run dev
   ```

2. **Open admin panel**:
   ```
   http://localhost:9000/app
   ```

3. **Verify**:
   - ✅ Navigate to Products → Should see 222 products
   - ✅ Navigate to Categories → Should see 52 categories
   - ✅ Check a product:
     - Image displays correctly
     - Price is in AUD
     - Categories are linked
     - Description is present
   - ✅ Stock shows as "Unlimited" or "In Stock"

### Check via API

```bash
# Get products count
curl http://localhost:9000/store/products | jq '.products | length'

# Get categories count
curl http://localhost:9000/store/product-categories | jq '.product_categories | length'

# Get a specific product
curl http://localhost:9000/store/products/yam-flour-elubo-isu-4-5kg | jq
```

## 🛠️ Troubleshooting

### "Cannot find module 'fs/promises'"
**Solution**: Make sure you're using Node.js 14+ (fs/promises is built-in)

### "Failed to load transformed data files"
**Solution**: Run Step 1 (transform-products.js) first before seeding

### "Category not found for product"
**Solution**: Check `transformation-errors.json` for any category mapping issues

### Images not displaying
**Possible causes**:
- Image URLs from original site may be broken
- Check network connectivity
- Verify `product.image_url` in transformed JSON

### Seed fails midway
**Solution**: The seed script is designed to continue on errors. Check logs for:
- Which batch failed
- Specific error messages
- Failed products are logged separately

### Re-running the seed
**To start fresh**:
```bash
# Option 1: Drop and recreate database
dropdb medusa_db && createdb medusa_db
cd /workspaces/afro/afro-store
npx medusa db:migrate
npm run seed

# Option 2: Use admin panel
# Manually delete products and categories via admin
```

## 📁 File Structure

```
/workspaces/afro/
├── transform-products.js          # Transformation script
├── scraped_products.json          # Original scraped data (input)
├── medusa-products.json           # Transformed products (generated)
├── medusa-categories.json         # Category hierarchy (generated)
├── transformation-errors.json     # Errors log (if any)
│
└── afro-store/
    ├── package.json               # Contains npm run seed command
    └── src/scripts/
        ├── seed-howt-foods.ts     # Main seeding script (used by npm run seed)
        └── seed.ts                # Demo seed (backup)
```

## 🎯 Success Criteria

After running the seeds, you should have:

- ✅ **52 categories** with proper parent-child hierarchy
- ✅ **222 products** with:
  - Correct prices in AUD (converted to cents)
  - Product images linked
  - Descriptions preserved
  - Categories assigned
  - Unlimited stock enabled
- ✅ **Store configured** with:
  - AUD as default currency
  - Australia region
  - Shipping options (Standard: $10, Express: $20)
  - Tax regions
  - Stock location

## 🔧 Advanced Usage

### Seed only categories
```bash
# Modify seed-howt-foods.ts to comment out product seeding section
# Then run: npm run seed
```

### Seed with custom batch size
Edit `seed-howt-foods.ts` line with `batchSize`:
```typescript
const batchSize = 50; // Change to 10, 25, 100, etc.
```

### Test with subset of products
Edit `transform-products.js` and limit products:
```javascript
const scrapedProducts = JSON.parse(await fs.readFile(scrapedPath, 'utf-8'))
  .slice(0, 10); // Only transform first 10 products
```

## 📝 Notes

### Inventory Management
- **Disabled by default**: Products have `manage_inventory: false`
- **Reason**: Simulates unlimited stock for all products
- **To enable**: Change `manage_inventory: true` in seed script and set stock levels

### Images
- **Source**: Original product images from howtfoods.com.au
- **Format**: URLs stored in product `thumbnail` and `images` fields
- **Note**: If images don't load, the original site may have moved/deleted them

### Price Metadata
- Products store both regular and sale prices in metadata
- Allows future implementation of sale/discount features
- Current price is what's displayed to customers

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs**: npm run seed outputs detailed logs
2. **Review errors file**: `transformation-errors.json`
3. **Verify data**: Check `medusa-products.json` structure
4. **Test small batch**: Transform/seed just 5-10 products first

## 🎉 What's Next?

After successful seeding:

1. **Storefront Integration**
   - Update Next.js storefront to display products
   - Implement product listing pages
   - Add category navigation

2. **Customization**
   - Update navigation menus
   - Configure footer
   - Add static pages (About, Contact)

3. **Media Migration**
   - Consider moving images to CDN
   - Optimize image sizes
   - Generate thumbnails

4. **Testing**
   - Test checkout flow
   - Verify shipping calculations
   - Test payment integration

---

**Created**: For Howt Foods MedusaJS Migration
**Products**: 222 scraped products
**Technology**: MedusaJS v2, Node.js, TypeScript
