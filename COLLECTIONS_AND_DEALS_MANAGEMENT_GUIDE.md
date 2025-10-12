# Managing Collections & Deal Products in MedusaJS

**Date**: October 12, 2025  
**Guide**: How to manage products in the deals carousel and create collections

---

## 🎯 Quick Answer

**Yes!** You can simply create collections in the MedusaJS backend admin panel, and they will automatically link up to the frontend. The collection `handle` (URL-friendly name) is what connects them.

---

## 📦 How Collections Work

### Collection URL Structure
```
Frontend URL: /collections/[handle]
Example: /collections/special-offers
```

The `[handle]` part is dynamic and comes from your MedusaJS collection's handle field.

### Current Collection Links in Your Homepage

Looking at your **Quick Actions** component, these collections are referenced:

1. **`/collections/special-offers`** - "Today's Deals" button
2. **`/collections/new-arrivals`** - "New Arrivals" button  
3. **`/collections/fruits-and-vegetables`** - "Fresh Produce" button
4. **`/collections/provisions`** - "Pantry Essentials" button

**Status**: These will show 404 until you create them in MedusaJS backend.

---

## 🛠️ How to Create Collections in MedusaJS

### Option 1: Via MedusaJS Admin Panel (Recommended)

1. **Access Admin Panel**:
   ```
   http://localhost:9000/app
   ```

2. **Navigate to Collections**:
   - Click "Products" in sidebar
   - Click "Collections" tab

3. **Create New Collection**:
   - Click "New Collection" button
   - Fill in details:
     - **Title**: `Special Offers` (human-readable name)
     - **Handle**: `special-offers` (URL slug - must match frontend links!)
     - **Description**: Optional marketing text
   - Click "Publish"

4. **Add Products to Collection**:
   - Open the collection
   - Click "Add Products"
   - Select products to include
   - Click "Save"

### Important: Handle Must Match!

| Frontend Link | Required Handle in Backend |
|---------------|---------------------------|
| `/collections/special-offers` | `special-offers` |
| `/collections/new-arrivals` | `new-arrivals` |
| `/collections/fruits-and-vegetables` | `fruits-and-vegetables` |
| `/collections/provisions` | `provisions` |

**The handle is case-sensitive and must match exactly!**

---

## 🎁 Managing Products in the Deals Carousel

The deals carousel currently has **2 methods** for selecting products. Here are your options:

### Current Implementation (Automatic)

The carousel automatically shows products that have:

1. **Sale Pricing** (MedusaJS price lists with `type: "sale"`)
   ```
   Product → Variants → Calculated Price → price_type = "sale"
   ```

2. **Featured Metadata** (Custom metadata field)
   ```
   Product → Metadata → featured = true
   ```

**How it works**:
```typescript
// In deals-carousel/index.tsx (server component)
const dealProducts = response.products.filter((product) => {
  const hasSalePrice = product.variants?.some(
    (variant) =>
      variant.calculated_price?.price_type === "sale" &&
      variant.calculated_price?.percentage_diff
  )
  const isFeatured = product.metadata?.featured === true
  
  return hasSalePrice || isFeatured
})
```

---

## 🎨 3 Ways to Manage Deal Products

### Method 1: Use Sale Price Lists (Recommended)

**Best for**: Time-limited deals, seasonal sales

**How to set up**:

1. **Create Price List** in MedusaJS Admin:
   - Go to "Pricing" → "Price Lists"
   - Click "New Price List"
   - Name: "Black Friday Sale" (or similar)
   - Type: **Sale**
   - Set start/end dates (optional)
   - Add products and their sale prices

2. **Products with active sale price lists automatically appear in carousel**

**Pros**:
- ✅ Automatic discount calculation
- ✅ Time-based activation/deactivation
- ✅ Shows discount percentage badges
- ✅ No manual tagging needed

**Cons**:
- ❌ Requires creating price lists for each sale

---

### Method 2: Use Product Metadata (Simple)

**Best for**: Hand-picked featured products, permanent deals

**How to set up**:

1. **Edit Product** in MedusaJS Admin:
   - Go to product edit page
   - Scroll to "Metadata" section
   - Add new metadata field:
     - **Key**: `featured`
     - **Value**: `true`
   - Save product

2. **Product automatically appears in carousel**

**Pros**:
- ✅ Simple to manage
- ✅ No price list setup needed
- ✅ Works for any product regardless of price

**Cons**:
- ❌ No automatic discount badges (unless also on sale)
- ❌ Manual management per product

---

### Method 3: Use a Collection (Most Flexible)

**Best for**: Curated deals, easy bulk management

**Implementation Required**: Need to update the code to query a specific collection.

**How to set up**:

1. **Create "Deals" Collection** in MedusaJS:
   - Title: `Today's Hot Deals`
   - Handle: `todays-deals`
   - Add products you want to feature

2. **Update Carousel Code** (I'll provide the code below)

3. **Manage products via collection** in admin panel

**Pros**:
- ✅ Easy bulk management
- ✅ Drag-and-drop product ordering
- ✅ Visual management in admin
- ✅ Can show products without sales

**Cons**:
- ❌ Requires code change
- ❌ No automatic discount detection

---

## 🔧 Option 3: Collection-Based Implementation

If you want to manage deals via a collection, here's the updated code:

### Updated Server Component

```typescript
// /src/modules/home/components/deals-carousel/index.tsx
import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import DealsCarouselClient from "./client"

export default async function DealsCarousel({
  countryCode,
}: {
  countryCode: string
}) {
  try {
    const region = await getRegion(countryCode)
    
    if (!region) {
      return null
    }

    // Fetch the "todays-deals" collection
    const collection = await getCollectionByHandle("todays-deals")
    
    // If collection doesn't exist, fallback to sale/featured products
    if (!collection || !collection.products || collection.products.length === 0) {
      // Fallback to automatic sale/featured detection
      const { response } = await listProducts({
        pageParam: 1,
        queryParams: {
          limit: 20,
          fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata",
        },
        countryCode,
      })

      if (!response?.products || response.products.length === 0) {
        return null
      }

      const dealProducts = response.products
        .filter((product) => {
          const hasSalePrice = product.variants?.some(
            (variant: any) =>
              variant.calculated_price?.price_type === "sale" &&
              variant.calculated_price?.percentage_diff
          )
          const isFeatured = product.metadata?.featured === true
          return hasSalePrice || isFeatured
        })
        .slice(0, 8)

      if (dealProducts.length === 0) {
        return null
      }

      return (
        <DealsCarouselClient
          products={dealProducts}
          region={region}
          countryCode={countryCode}
        />
      )
    }

    // Use products from collection
    const dealProducts = collection.products.slice(0, 8)

    return (
      <DealsCarouselClient
        products={dealProducts}
        region={region}
        countryCode={countryCode}
      />
    )
  } catch (error) {
    console.error("Error loading deals carousel:", error)
    return null
  }
}
```

This gives you **the best of both worlds**:
1. If "todays-deals" collection exists → Use those products
2. If collection doesn't exist → Auto-detect sale/featured products

---

## 📋 Step-by-Step: Creating Your First Collection

### 1. Create "Special Offers" Collection

**In MedusaJS Admin**:
```
Title: Special Offers
Handle: special-offers
Description: Amazing deals on African and Caribbean groceries
```

### 2. Add Products to Collection

- Click "Add Products"
- Select 5-10 products
- Click "Save"

### 3. Test Frontend

Navigate to:
```
http://localhost:8000/au/collections/special-offers
```

**Result**: You should see your collection page with the products you added!

### 4. Repeat for Other Collections

Create these collections to make all Quick Action buttons work:

| Button | Collection Handle |
|--------|-------------------|
| Today's Deals | `special-offers` |
| New Arrivals | `new-arrivals` |
| Fresh Produce | `fruits-and-vegetables` |
| Pantry Essentials | `provisions` |

---

## 🎯 Recommended Approach

For your use case, I recommend a **hybrid approach**:

### For Deals Carousel:
Use **Method 1 (Sale Price Lists)** + **Method 2 (Metadata)**

**Why?**
- Sale price lists give you automatic discount badges
- Metadata lets you feature specific products
- No code changes needed
- Most flexible

### For Quick Action Buttons:
Create **collections** in MedusaJS backend

**Why?**
- Easy to manage via admin panel
- Can curate products per category
- Better SEO with collection pages
- Marketing-friendly URLs

---

## 🔍 Checking What Collections Exist

### Via MedusaJS Admin:
```
http://localhost:9000/app → Products → Collections
```

### Via API:
```bash
curl http://localhost:9000/store/collections
```

### Via Frontend Dev Tools:
Open browser console on homepage:
```javascript
fetch('http://localhost:9000/store/collections')
  .then(r => r.json())
  .then(console.log)
```

---

## ⚡ Quick Fixes for 404 Errors

If you're seeing 404s on `/collections/*` pages:

### Fix 1: Create the Collections
Create these 4 collections in MedusaJS admin with exact handles:
- `special-offers`
- `new-arrivals`
- `fruits-and-vegetables`
- `provisions`

### Fix 2: Update Links (Temporary)
While you set up collections, you can point buttons to existing pages:

```typescript
// In quick-actions/index.tsx
const quickActions: QuickAction[] = [
  {
    id: "deals",
    label: "Today's Deals",
    href: "/store", // Point to all products temporarily
    variant: "primary",
  },
  // ...
]
```

---

## 🎓 Summary

### How Collections Work:
1. ✅ Create collection in MedusaJS admin
2. ✅ Set the `handle` (URL slug)
3. ✅ Add products to collection
4. ✅ Frontend automatically picks it up at `/collections/[handle]`

### Managing Deal Products:
- **Automatic** (current): Use sale pricing + metadata
- **Manual** (recommended for control): Use collections
- **Hybrid** (best): Combine both methods

### Next Steps:
1. Open MedusaJS admin at `localhost:9000/app`
2. Create 4 collections (special-offers, new-arrivals, fruits-and-vegetables, provisions)
3. Add products to each collection
4. Test navigation on homepage

**Everything will link up automatically - no code changes needed!** 🎉

---

Need help with any specific step? Let me know!
