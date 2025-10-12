# Promo Carousel Overlay - Complete Guide

**Component**: `/src/components/promo-carousel-overlay.tsx`  
**Integration**: Homepage (`/src/app/[countryCode]/(main)/page.tsx`)

---

## 🎯 What It Is

A sophisticated, production-ready promotional overlay that appears on the homepage featuring:

✅ **Clean Dialog Modal** - Uses shadcn/ui Dialog for proper accessibility  
✅ **Swipeable Carousel** - Embla Carousel for smooth slide transitions  
✅ **Multiple Dismiss Options** - X button, click outside, ESC key, or bottom link  
✅ **Auto-show on First Visit** - Uses localStorage to show once per user  
✅ **Fully Responsive** - Looks perfect on mobile and desktop  
✅ **CMS-Ready Structure** - Easy to integrate with any CMS  

---

## 🎨 Current Promo Slides

### Slide 1: Free Delivery in Sydney
```
Badge: "Limited Time"
Title: "Free Delivery in Sydney"
Description: "Get your authentic African & Caribbean groceries delivered to your door at no extra cost!"
Highlight: "Orders over $50"
CTA: "Start Shopping" → /store
Colors: Green gradient (from-green-500 to-emerald-600)
```

### Slide 2: $10 Off Promo Code
```
Badge: "New Customers"
Title: "$10 Off Your First Order"
Description: "Use code at checkout to save on your first purchase from AfroMart Sydney"
Highlight: "WELCOME10" (promo code)
CTA: "Shop Now" → /store
Colors: Orange/Red gradient (from-orange-500 to-red-500)
```

---

## 🛠️ How It Works

### Auto-Show Behavior

1. **First Visit**: Overlay shows after 1 second delay
2. **User Dismisses**: Choice saved to localStorage
3. **Subsequent Visits**: Overlay doesn't show again
4. **Clear Cache**: User can clear localStorage to see it again

### Dismissal Options

Users can close the overlay by:
- ✅ Clicking the **X button** (top right)
- ✅ Clicking **outside the dialog** (on the backdrop)
- ✅ Pressing **ESC key** on keyboard
- ✅ Clicking **"I'll browse first"** link (bottom)
- ✅ Clicking **any CTA button** ("Start Shopping" / "Shop Now")

All these actions mark the promo as "seen" in localStorage.

---

## 📝 Managing Content (CMS Integration)

### Current Setup (Hardcoded)

The promo slides are currently defined in the component:

```typescript
const promoSlides: PromoSlide[] = [
  {
    id: "free-delivery",
    type: "free-delivery",
    icon: <Truck className="h-12 w-12" />,
    badge: "Limited Time",
    title: "Free Delivery in Sydney",
    description: "Get your authentic African & Caribbean groceries delivered...",
    highlight: "Orders over $50",
    ctaText: "Start Shopping",
    ctaLink: "/store",
    gradient: "from-green-500 to-emerald-600",
    backgroundColor: "bg-green-50",
  },
  // ... more slides
]
```

### CMS Integration (Recommended)

To make this CMS-managed, you have two options:

#### Option 1: Fetch from MedusaJS Backend

Create a custom API endpoint in your Medusa backend:

```typescript
// In your Medusa backend
// /src/api/store/promos/route.ts
export async function GET(request: Request) {
  const promos = [
    {
      id: "free-delivery",
      type: "free-delivery",
      badge: "Limited Time",
      title: "Free Delivery in Sydney",
      description: "Get your authentic African & Caribbean groceries...",
      highlight: "Orders over $50",
      ctaText: "Start Shopping",
      ctaLink: "/store",
      gradient: "from-green-500 to-emerald-600",
      backgroundColor: "bg-green-50",
      icon: "truck", // Icon identifier
    }
  ]
  return Response.json({ promos })
}
```

Then fetch in homepage:

```typescript
// In page.tsx
import { sdk } from "@lib/config"

const { promos } = await sdk.client.fetch("/store/promos")

return (
  <>
    <PromoCarouselOverlay slides={promos} />
    {/* rest of homepage */}
  </>
)
```

#### Option 2: Use Product Metadata

Store promo data in product metadata:

```typescript
// Query products with metadata.is_promo = true
const promoProducts = await listProducts({
  queryParams: {
    metadata: { is_promo: true }
  }
})

// Transform to promo slides
const slides = promoProducts.map(product => ({
  id: product.id,
  title: product.metadata.promo_title,
  description: product.metadata.promo_description,
  // ... etc
}))
```

#### Option 3: Use a Headless CMS

Integrate with Contentful, Sanity, or Strapi:

```typescript
// Example with Contentful
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

const response = await client.getEntries({
  content_type: 'promoSlide',
  'fields.active': true,
})

const slides = response.items.map(item => ({
  id: item.sys.id,
  title: item.fields.title,
  description: item.fields.description,
  // ... etc
}))
```

---

## 🎨 Customization Guide

### Change Colors

Edit the `gradient` and `backgroundColor` properties:

```typescript
{
  gradient: "from-blue-500 to-purple-600",  // Gradient for accents
  backgroundColor: "bg-blue-50",             // Background tint
}
```

Available gradients:
- `from-red-500 to-orange-500` (Red/Orange)
- `from-green-500 to-emerald-600` (Green)
- `from-blue-500 to-indigo-600` (Blue)
- `from-purple-500 to-pink-600` (Purple)
- `from-orange-500 to-red-500` (Orange/Red)

### Change Icons

Import from lucide-react and update the `icon` property:

```typescript
import { Truck, Gift, Sparkles, Tag, Percent } from "lucide-react"

{
  icon: <Gift className="h-12 w-12" />,
}
```

### Add More Slides

Simply add more objects to the `promoSlides` array:

```typescript
const promoSlides: PromoSlide[] = [
  {
    id: "summer-sale",
    type: "sale",
    icon: <Sparkles className="h-12 w-12" />,
    badge: "Summer Sale",
    title: "Up to 30% Off",
    description: "Save big on selected African groceries this summer!",
    ctaText: "Shop Sale",
    ctaLink: "/collections/special-offers",
    gradient: "from-yellow-500 to-orange-500",
    backgroundColor: "bg-yellow-50",
  },
  // ... existing slides
]
```

### Change Auto-Show Delay

Pass `showDelay` prop (in milliseconds):

```tsx
<PromoCarouselOverlay showDelay={2000} /> {/* Shows after 2 seconds */}
```

### Disable Auto-Show

```tsx
<PromoCarouselOverlay autoShow={false} />
```

Users won't see it automatically, but you can trigger it programmatically.

### Change LocalStorage Key

```tsx
<PromoCarouselOverlay storageKey="my-custom-promo-key" />
```

---

## 🎯 Component Props

```typescript
interface PromoCarouselOverlayProps {
  /**
   * Array of promo slides to display
   * In production, fetch this from your CMS
   */
  slides?: PromoSlide[]
  
  /**
   * Whether to show the overlay automatically on first visit
   * @default true
   */
  autoShow?: boolean
  
  /**
   * Delay in milliseconds before showing the overlay
   * @default 1000
   */
  showDelay?: number
  
  /**
   * LocalStorage key to track if user has seen the promo
   * @default "afromart-promo-seen"
   */
  storageKey?: string
}
```

### PromoSlide Interface

```typescript
interface PromoSlide {
  id: string
  type: "free-delivery" | "promo-code" | "sale" | "announcement"
  icon: React.ReactNode
  badge?: string
  title: string
  description: string
  highlight?: string // Promo code or special text
  ctaText: string
  ctaLink: string
  gradient: string
  backgroundColor: string
}
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Full-width dialog
- Swipeable carousel (touch gestures)
- "Swipe for more offers →" hint on first slide
- No navigation arrows
- Stacked layout
- Large touch targets

### Desktop (≥ 768px)
- Max width 600px dialog
- Mouse-friendly carousel controls
- Previous/Next arrow buttons
- Hover states on all interactive elements
- Centered modal

---

## ♿ Accessibility Features

✅ **Keyboard Navigation**
- ESC key closes dialog
- Tab navigation works properly
- Focus trap within dialog

✅ **Screen Reader Support**
- Proper ARIA labels
- Dialog title announced
- Button roles and labels
- Carousel indicators labeled

✅ **Focus Management**
- Auto-focuses close button when opened
- Returns focus after closing
- Visible focus states

---

## 🧪 Testing the Component

### Test Auto-Show

1. Open homepage in incognito/private window
2. Wait 1 second
3. Promo overlay should appear

### Test Dismissal

1. Click X button → Overlay closes
2. Refresh page → Overlay doesn't show (localStorage check)
3. Clear localStorage → Overlay shows again on refresh

### Test Carousel

1. Open overlay
2. Swipe left (mobile) or click Next (desktop)
3. Should see second promo slide
4. Indicators update
5. Loop works (last slide → first slide)

### Test CTA Buttons

1. Click "Start Shopping" or "Shop Now"
2. Should navigate to /store
3. Overlay closes
4. Refresh page → Overlay doesn't show (marked as seen)

---

## 🎯 Best Practices

### Content Guidelines

**Titles**: 3-8 words, action-oriented
- ✅ "Free Delivery in Sydney"
- ✅ "$10 Off Your First Order"
- ❌ "We have an announcement to make about something cool"

**Descriptions**: 1-2 sentences, clear value proposition
- ✅ "Get your authentic African & Caribbean groceries delivered to your door at no extra cost!"
- ❌ "This is a very long description that goes on and on and doesn't really say much of value to the customer..."

**Highlights**: Short, prominent text
- ✅ "WELCOME10" (promo code)
- ✅ "Orders over $50" (condition)
- ✅ "Until Dec 31" (deadline)

**CTA Text**: 2-3 words, action verbs
- ✅ "Shop Now"
- ✅ "Start Shopping"
- ✅ "Claim Offer"
- ❌ "Click here to maybe shop"

### Timing Guidelines

- **Show Delay**: 1-2 seconds (don't interrupt page load)
- **Number of Slides**: 2-4 max (more = overwhelming)
- **Update Frequency**: Weekly or bi-weekly (keep fresh)

### A/B Testing Recommendations

Test different:
- Show delays (1s vs 2s vs 3s)
- Number of slides (1 vs 2 vs 3)
- CTA text ("Shop Now" vs "Start Shopping")
- Colors/gradients
- Badge text

---

## 🔧 Troubleshooting

### Overlay Doesn't Appear

**Check**:
1. Is `autoShow` set to `true`? (default)
2. Is localStorage key already set? Clear it in DevTools
3. Are there slides in the array?
4. Check browser console for errors

**Solution**:
```javascript
// In browser console
localStorage.removeItem('afromart-promo-seen')
location.reload()
```

### Can't Dismiss Overlay

**Check**:
1. Is X button visible?
2. Can you click outside?
3. Does ESC key work?
4. Check z-index conflicts

### Carousel Not Swiping

**Check**:
1. Are Embla dependencies installed?
2. Is touch-action CSS correct?
3. Check for JavaScript errors
4. Verify CarouselApi is set

### Images/Icons Not Showing

**Check**:
1. Are Lucide React icons imported?
2. Is icon component passed correctly?
3. Check Tailwind classes are valid

---

## 🚀 Future Enhancements

### Potential Features

1. **Analytics Integration**
   - Track open/close rates
   - Track CTA clicks
   - A/B testing metrics

2. **Advanced Targeting**
   - Show different promos by region
   - Time-based promos (flash sales)
   - User segment targeting (new vs returning)

3. **Animation Options**
   - Entrance animations (fade, slide, zoom)
   - Auto-advance slides
   - Video backgrounds

4. **Form Integration**
   - Email capture for promo codes
   - Phone number for SMS updates
   - Survey/feedback forms

---

## 📊 Current Implementation Status

✅ **Complete Features**:
- Dialog overlay with backdrop blur
- Swipeable carousel (Embla)
- Multiple dismiss options
- Auto-show on first visit
- LocalStorage persistence
- Responsive design
- Accessibility features
- Clean, modern UI

🔄 **Pending** (Optional):
- CMS integration
- Analytics tracking
- A/B testing setup
- Email capture form

---

## 🎓 Summary

You now have a **production-ready promotional overlay** that:

1. ✅ Shows on first visit after 1-second delay
2. ✅ Features 2 swipeable promo slides
3. ✅ Easy to dismiss (X, click outside, ESC, bottom link)
4. ✅ Fully responsive and accessible
5. ✅ Ready for CMS integration

**To update content**: Edit the `promoSlides` array in `/src/components/promo-carousel-overlay.tsx`

**To test**: Open in incognito mode, clear localStorage key, or pass `autoShow={false}` prop

**Live on**: Homepage (`/au`, `/us`, etc.) - shows automatically on first visit

---

Need help customizing or integrating with a CMS? Let me know!
