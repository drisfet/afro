# Quick Start: Creating Collections in MedusaJS

**Visual Step-by-Step Guide**

---

## ✅ **Answer: YES, it will automatically link up!**

When you create a collection in MedusaJS backend with handle `special-offers`, it will automatically work at:
```
http://localhost:8000/au/collections/special-offers
```

No code changes needed! The frontend automatically queries MedusaJS for collections by handle.

---

## 🚀 Step 1: Access MedusaJS Admin

```bash
# Make sure your backend is running
cd /workspaces/afro/afro-store
yarn dev
```

Open in browser:
```
http://localhost:9000/app
```

Login with your admin credentials.

---

## 📦 Step 2: Navigate to Collections

```
Sidebar → Products → Collections tab
```

You'll see a list of existing collections (or empty if none exist).

---

## ➕ Step 3: Create "Special Offers" Collection

Click **"Create Collection"** or **"New Collection"** button.

### Fill in the form:

**Title**: `Special Offers`
- This is the display name shown to customers
- Can include spaces and capital letters
- Example: "Today's Hot Deals"

**Handle**: `special-offers`
- ⚠️ **CRITICAL**: This must match the URL in your frontend!
- URL-friendly (lowercase, hyphens, no spaces)
- Cannot be changed after creation
- Example: `special-offers` → `/collections/special-offers`

**Description** (optional):
```
Amazing deals on authentic African and Caribbean groceries. 
Limited time offers updated weekly!
```

**Metadata** (optional):
- Can add custom fields for sorting, SEO, etc.

Click **"Publish"** or **"Save"**.

---

## 🎯 Step 4: Add Products to Collection

### Option A: During Creation
While creating the collection, look for "Products" section and click "Add Products".

### Option B: After Creation
1. Open the collection from the list
2. Click "Edit" or "Add Products" button
3. Search for products or browse
4. Select checkboxes for products you want
5. Click "Save" or "Add Selected"

### Tips:
- Add 8-15 products for a good carousel display
- Mix different product types
- Include products with images for best visual impact

---

## 🔁 Step 5: Repeat for Other Collections

Create these collections to make all homepage buttons work:

| Collection Title | Handle (must be exact) | For Button |
|------------------|------------------------|------------|
| Special Offers | `special-offers` | "Today's Deals" |
| New Arrivals | `new-arrivals` | "New Arrivals" |
| Fruits and Vegetables | `fruits-and-vegetables` | "Fresh Produce" |
| Provisions | `provisions` | "Pantry Essentials" |

---

## ✅ Step 6: Test on Frontend

Navigate to:
```
http://localhost:8000/au/collections/special-offers
```

**Expected Result**:
- Collection page loads (no 404!)
- Products from collection are displayed
- Title shows "Special Offers | AfroMart Sydney"
- Products are clickable and functional

---

## 🎁 Bonus: Managing Deals Carousel Products

The deals carousel automatically shows products with:

### Method 1: Add Sale Price (Recommended)

1. Go to **Pricing → Price Lists**
2. Create new price list:
   - Name: "Weekend Sale"
   - Type: **Sale** ⚠️ (Must select "Sale" type!)
   - Start Date: Today
   - End Date: Next week
3. Add products with discounted prices
4. Publish price list

**Result**: Products automatically appear in deals carousel with discount badges!

### Method 2: Add Featured Metadata

1. Edit any product
2. Scroll to **Metadata** section
3. Add field:
   - Key: `featured`
   - Value: `true`
4. Save product

**Result**: Product appears in deals carousel immediately!

---

## 🔍 Troubleshooting

### Problem: 404 on /collections/special-offers

**Solution**: Check the collection handle is exactly `special-offers` (no capitals, no typos)

### Problem: Collection page is empty

**Solution**: Make sure you added products to the collection in admin panel

### Problem: Products not showing in deals carousel

**Solution**: Either:
1. Add sale pricing via price list, OR
2. Add `featured: true` metadata to products

### Problem: Wrong products showing in carousel

**Current behavior**: Shows any product with sale pricing OR featured metadata

**Solution**: See "COLLECTIONS_AND_DEALS_MANAGEMENT_GUIDE.md" for collection-based implementation

---

## 🎨 What Your Frontend Does Automatically

### 1. Collection Page Generation
```typescript
// /app/[countryCode]/(main)/collections/[handle]/page.tsx

// Fetches collection by handle
const collection = await getCollectionByHandle(params.handle)

// If not found → 404 page
if (!collection) {
  notFound()
}

// If found → Shows collection page with products
```

### 2. URL Routing
The `[handle]` in the file path means it accepts any collection handle:
```
/collections/special-offers → Queries MedusaJS for "special-offers"
/collections/new-arrivals → Queries MedusaJS for "new-arrivals"
/collections/anything → Queries MedusaJS for "anything"
```

### 3. Automatic Metadata
```typescript
// Sets page title automatically
title: `${collection.title} | AfroMart Sydney`

// Example result:
// "Special Offers | AfroMart Sydney"
```

---

## 📊 Collection Handle Rules

### ✅ Valid Handles:
- `special-offers`
- `new-arrivals`
- `fruits-and-vegetables`
- `provisions`
- `summer-sale-2025`

### ❌ Invalid Handles:
- `Special Offers` (spaces)
- `special_offers` (underscores - use hyphens)
- `Special-Offers` (capitals - use lowercase)
- `special offers` (spaces)

---

## 🚦 Quick Checklist

Before testing collections:

- [ ] MedusaJS backend running on `localhost:9000`
- [ ] Frontend storefront running on `localhost:8000`
- [ ] Created collection in admin with exact handle
- [ ] Added at least 3-5 products to collection
- [ ] Tested URL: `http://localhost:8000/au/collections/[handle]`

---

## 💡 Pro Tips

### 1. Organize by Strategy
```
Collections for Navigation:
- special-offers (deals)
- new-arrivals (freshness)
- fruits-and-vegetables (category)
- provisions (category)

Collections for Marketing:
- summer-essentials
- party-favorites
- family-bundles
```

### 2. Product Ordering
- Drag products in admin to reorder
- Most popular products first
- Mix variety for visual appeal

### 3. Use Collection Metadata
Add custom metadata for featured banners, colors, icons:
```
banner_color: "orange"
banner_text: "50% Off Everything!"
show_on_homepage: true
```

### 4. Seasonal Collections
Create time-limited collections:
```
Handle: "black-friday-2025"
Active: Nov 25-30
Products: 50+ sale items
```

---

## 🎯 Summary

1. **Create collection** in MedusaJS admin (`localhost:9000/app`)
2. **Set handle** to match frontend URL (e.g., `special-offers`)
3. **Add products** to collection
4. **Test URL**: `localhost:8000/au/collections/special-offers`
5. **Everything works automatically!** ✨

The frontend code already handles:
- ✅ Fetching collections by handle
- ✅ Displaying products
- ✅ 404 pages if collection doesn't exist
- ✅ SEO metadata
- ✅ Responsive design
- ✅ Add to cart functionality

**You just need to create the collections in MedusaJS - that's it!** 🎉

---

## 📚 Related Guides

- `COLLECTIONS_AND_DEALS_MANAGEMENT_GUIDE.md` - Full collection management guide
- `PRODUCTION_READY_FIXES.md` - How deals carousel works
- `COMPLETE_TRANSFORMATION_SUMMARY.md` - Homepage features overview

---

Need help creating your first collection? Let me know which collection you want to start with!
