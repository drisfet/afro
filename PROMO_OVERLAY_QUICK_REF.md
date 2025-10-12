# Promo Overlay - Quick Reference Card

## ⚡ At a Glance

**Default Setting**: Don't show for **30 minutes**

**Current Config**:
```tsx
<PromoCarouselOverlay expirationMinutes={30} />
```

---

## 🎯 Common Configurations

```tsx
// 5 minutes - For urgent flash sales
<PromoCarouselOverlay expirationMinutes={5} />

// 15 minutes - Shorter browsing session
<PromoCarouselOverlay expirationMinutes={15} />

// 30 minutes - DEFAULT (balanced)
<PromoCarouselOverlay expirationMinutes={30} />

// 60 minutes (1 hour) - Longer session
<PromoCarouselOverlay expirationMinutes={60} />

// 120 minutes (2 hours) - Extended browsing
<PromoCarouselOverlay expirationMinutes={120} />
```

---

## 🧪 Testing Commands

### Check Current Settings:
```javascript
// Browser console
const data = localStorage.getItem('afromart-promo-seen')
if (data) {
  const parsed = JSON.parse(data)
  const expiresAt = new Date(parsed.timestamp + (parsed.expiresIn * 60 * 1000))
  console.log('Expires at:', expiresAt.toLocaleString())
  console.log('Minutes left:', Math.ceil((expiresAt - Date.now()) / 60000))
} else {
  console.log('No suppression active - overlay will show')
}
```

### Force Reset (Show Overlay Again):
```javascript
localStorage.removeItem('afromart-promo-seen')
// Then refresh page
```

### Simulate Expired State:
```javascript
// Set timestamp to 31 minutes ago (when default is 30 mins)
localStorage.setItem('afromart-promo-seen', JSON.stringify({
  timestamp: Date.now() - (31 * 60 * 1000),
  expiresIn: 30
}))
// Refresh page - overlay should show
```

---

## 📊 What Gets Stored

### Format:
```json
{
  "timestamp": 1728745200000,
  "expiresIn": 30
}
```

### Calculation:
- **timestamp**: When user checked the box (ms since epoch)
- **expiresIn**: How many minutes until it shows again
- **Expiration time**: `timestamp + (expiresIn × 60 × 1000)`

---

## 🎨 User-Facing Text

**Checkbox Label**: "Don't show for 30 minutes"

Change in `/src/components/promo-carousel-overlay.tsx` line ~300:
```tsx
Don't show for {expirationMinutes} minutes
```

### Smart Label (Shows Hours if ≥60 mins):
```tsx
{expirationMinutes >= 60 
  ? `Don't show for ${Math.floor(expirationMinutes / 60)} hour${expirationMinutes >= 120 ? 's' : ''}` 
  : `Don't show for ${expirationMinutes} minutes`}
```

Examples:
- 5 minutes → "Don't show for 5 minutes"
- 30 minutes → "Don't show for 30 minutes"
- 60 minutes → "Don't show for 1 hour"
- 120 minutes → "Don't show for 2 hours"

---

## ✅ How It Works

1. **User Action**: Checks "Don't show for 30 minutes" and closes overlay
2. **Storage**: `{ timestamp: now, expiresIn: 30 }` saved to localStorage
3. **Next Visit**: 
   - If < 30 min passed → Overlay hidden
   - If ≥ 30 min passed → Overlay shows again
4. **Expiration**: Auto-clears localStorage when expired

---

## 🔍 Troubleshooting

### Overlay not showing:
```javascript
// Check if suppression is active
const data = localStorage.getItem('afromart-promo-seen')
console.log(data ? 'Suppressed' : 'Should show')

// Force clear
localStorage.removeItem('afromart-promo-seen')
```

### Overlay showing too often:
- Increase `expirationMinutes` value
- Users might not be checking the checkbox

### Want different behavior:
- Edit `expirationMinutes` prop in `/src/app/[countryCode]/(main)/page.tsx`
- Default is 30 minutes

---

## 📍 File Locations

- **Component**: `/src/components/promo-carousel-overlay.tsx`
- **Usage**: `/src/app/[countryCode]/(main)/page.tsx`
- **Docs**: `/PROMO_OVERLAY_UPDATES.md`

---

## 🚀 Quick Changes

### Change to 15 minutes:
```tsx
// In page.tsx
<PromoCarouselOverlay expirationMinutes={15} />
```

### Change to 1 hour:
```tsx
<PromoCarouselOverlay expirationMinutes={60} />
```

### Disable expiration (permanent):
```tsx
<PromoCarouselOverlay expirationMinutes={525600} /> // 1 year
```

---

**Current Status**: ✅ Live with 30-minute default expiration
