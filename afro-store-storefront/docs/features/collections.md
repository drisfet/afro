# Collections - Marketing & Promotional Groupings

## 📌 Overview

Collections are a MedusaJS feature for creating curated product groupings for marketing and promotional purposes. Unlike categories (which organize products by type), collections are manually curated lists used for campaigns and featured items.

## 🎯 Purpose

**Categories**: Organize products by WHAT THEY ARE  
**Collections**: Group products for MARKETING/PROMOTIONAL reasons

## ✅ When to Use Collections

Use collections when you want to:

- ✅ **Run promotions** - "Summer Sale", "Clearance Items", "Black Friday Deals"
- ✅ **Feature products** - "New Arrivals", "Best Sellers", "Staff Picks"
- ✅ **Create bundles** - "African Essentials", "Cooking Starter Pack"
- ✅ **Seasonal groupings** - "Holiday Specials", "Back to School"
- ✅ **Homepage features** - Curated product lists for landing page

## ❌ When NOT to Use Collections

Avoid collections if:

- ❌ You just need standard product browsing (use categories instead)
- ❌ You're not running specific promotions yet
- ❌ You want automatic groupings (collections are manual)

## 🏗️ Current Setup

**Status**: Collections not yet implemented  
**Categories**: 46 categories already configured and working  
**Products**: 222 products organized by categories

## 📋 Implementation Guide

### Step 1: Create Collections in Admin

1. Go to MedusaJS Admin Panel: `http://localhost:9000/app`
2. Navigate to **Products** → **Collections**
3. Click **Create Collection**
4. Add:
   - **Title**: "Summer Sale" (or your collection name)
   - **Handle**: `summer-sale` (URL-friendly)
   - **Products**: Select products to include

### Step 2: Update Storefront to Display Collections

#### Option A: Collections Page

```typescript
// app/[countryCode]/(main)/collections/page.tsx
import { listCollections } from "@lib/data/collections"

export default async function CollectionsPage() {
  const collections = await listCollections()
  
  return (
    <div>
      <h1>Shop by Collection</h1>
      {collections.map(collection => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  )
}
```

#### Option B: Featured Collection on Homepage

```typescript
// app/[countryCode]/(main)/page.tsx
import { getCollectionByHandle } from "@lib/data/collections"

export default async function HomePage() {
  const featuredCollection = await getCollectionByHandle("featured-products")
  
  return (
    <div>
      <FeaturedCollection collection={featuredCollection} />
    </div>
  )
}
```

## 💡 Example Collection Ideas

### Marketing Collections
- **"New Arrivals"** - Products added in the last 30 days
- **"Best Sellers"** - Top 20 most purchased items
- **"Weekly Specials"** - Rotating promotional items

### Seasonal Collections
- **"Holiday Cooking"** - Grains, spices, oils for festive cooking
- **"Summer Essentials"** - Drinks, light snacks, hair care

### Product Bundles
- **"Hair Care Complete"** - Oil, cream, conditioner, relaxer
- **"African Kitchen Basics"** - Palm oil, spices, grains, sauces

## 🔗 Related Resources

- [MedusaJS Collections Documentation](https://docs.medusajs.com/resources/commerce-modules/product/collections)
- [Categories Documentation](../README.md) - Learn about category organization
- [Product Management](https://docs.medusajs.com/resources/commerce-modules/product)

## 📝 Notes

- **Current Recommendation**: Skip collections initially, focus on categories
- **Revisit When**: Ready to run first promotion or feature specific products
- Collections and categories work together - products can be in both
- Collections require manual curation (products don't auto-add)

---

*Status: Not yet implemented*  
*Priority: Low - Future enhancement*  
*Last updated: October 11, 2025*
