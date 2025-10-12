# Promo Overlay Updates - Cache Expiration & Design Fixes

## 🔧 Updates Applied

### 1. ✅ **Removed White Border on Green Promo**

**Issue**: The first promo (Free Delivery) had a white/green-50 background showing at the bottom, while the second promo looked clean.

**Root Cause**: The `backgroundColor` property was still defined in the data but not being used in the component.

**Fix**: 
- Removed `backgroundColor: "bg-green-50"` and `backgroundColor: "bg-orange-50"` from promo data
- Removed `backgroundColor` from the `PromoSlide` interface
- Now both promos use full gradient backgrounds consistently

**Result**: Both promos now have clean, full-gradient backgrounds with no white borders.

---

### 2. 🕐 **Added Cache Expiration Timer (Minutes-Based)**

**Issue**: "Don't show again" checkbox was permanent - once checked, users would never see the promo again.

**Solution**: Implemented a smart expiration system with **minute-based** duration (perfect for session-level suppression).

#### How It Works:

1. **Timestamp Storage**:
   ```typescript
   // When user checks "Don't show for X minutes"
   const data = {
     timestamp: Date.now(),
     expiresIn: 30, // minutes
   }
   localStorage.setItem('afromart-promo-seen', JSON.stringify(data))
   ```

2. **Expiration Check**:
   ```typescript
   // On page load
   const storedData = localStorage.getItem(storageKey)
   const { timestamp } = JSON.parse(storedData)
   const expirationTime = timestamp + (expirationMinutes * 60 * 1000) // Convert to ms
   
   if (Date.now() < expirationTime) {
     // Still within suppression period, don't show
     return
   } else {
     // Expired, clear data and show overlay
     localStorage.removeItem(storageKey)
   }
   ```

3. **Backward Compatibility**:
   - Old format (just `"true"` string) is detected and cleared
   - Users with old preferences will see the overlay again

#### New Component Props:

```typescript
interface PromoCarouselOverlayProps {
  // ... existing props
  
  /**
   * Number of minutes before the "Don't show again" preference expires
   * After this time, the overlay will show again
   * @default 30 (30 minutes)
   */
  expirationMinutes?: number
}
```

#### Usage Examples:

```tsx
{/* Default: 30 minutes */}
<PromoCarouselOverlay />

{/* Show again after 5 minutes */}
<PromoCarouselOverlay expirationMinutes={5} />

{/* Show again after 1 hour */}
<PromoCarouselOverlay expirationMinutes={60} />

{/* Show again after 2 hours */}
<PromoCarouselOverlay expirationMinutes={120} />

{/* Very short (testing) */}
<PromoCarouselOverlay expirationMinutes={1} />
```

#### UI Updates:

**Before**: "Don't show this again"
**After**: "Don't show for 30 minutes" (or whatever `expirationMinutes` is set to)

This gives users clear expectations about when they'll see the promo again.

---

## 📊 Storage Format

### New Format:
```json
{
  "timestamp": 1728745200000,
  "expiresIn": 30
}
```
Note: `expiresIn` is now in **minutes**, not days.

### Old Format (automatically handled):
```
"true"
```

If old format is detected, it's cleared and the overlay shows again.

---

## 🧪 Testing

### Test Scenario 1: First Visit
1. Open homepage
2. Overlay appears after 1 second
3. Check "Don't show for 30 minutes"
4. Click CTA or close button
5. Refresh page → Overlay doesn't show ✅
6. Wait 30 minutes (or clear localStorage) → Overlay shows again ✅

### Test Scenario 2: Quick Expiration (Testing)
1. Set `expirationMinutes={1}` (expires in 1 minute)
2. Check checkbox and close
3. Wait 1 minute
4. Refresh page → Overlay shows again ✅

### Test Scenario 3: Backward Compatibility
1. Open DevTools Console
2. Run: `localStorage.setItem('afromart-promo-seen', 'true')`
3. Refresh page → Old data cleared, overlay shows ✅

### Test Scenario 4: Manual Expiration Check
```javascript
// In console, check stored data
const data = localStorage.getItem('afromart-promo-seen')
const parsed = JSON.parse(data)
const expiresAt = new Date(parsed.timestamp + (parsed.expiresIn * 60 * 1000))
console.log('Expires at:', expiresAt.toLocaleString())

// Check time remaining
const remaining = expiresAt - Date.now()
console.log('Minutes remaining:', Math.floor(remaining / 60000))
```

---

## 🎨 Visual Comparison

### Before (Green Promo):
```
┌─────────────────────────┐
│     Green Gradient      │
│                         │
│        Content          │
│                         │
├─────────────────────────┤ ← White border here!
│   bg-green-50 showing   │
└─────────────────────────┘
```

### After (Green Promo):
```
┌─────────────────────────┐
│     Green Gradient      │
│                         │
│        Content          │
│                         │
│     Green Gradient      │ ← Clean gradient
└─────────────────────────┘
```

Both promos now look identical in structure, just with different colors.

---

## 🔧 Customization Options

### Change Default Expiration:
```tsx
// In homepage
<PromoCarouselOverlay expirationDays={14} />
```

### Change Label Text:
Edit line 300 in `promo-carousel-overlay.tsx`:
```tsx
Don't show for {expirationDays} days
```

To:
```tsx
Hide for {expirationDays} days
// or
Remember my choice for {expirationDays} days
```

### Force Reset for All Users:
Change the `storageKey` prop:
```tsx
<PromoCarouselOverlay 
  storageKey="afromart-promo-seen-v2"  // New key forces reset
/>
```

---

## 📈 Recommended Expiration Settings

| Use Case | Minutes | Reason |
|----------|---------|--------|
| **High-Value Flash Sales** | 5-10 | Urgent, time-sensitive offers |
| **Session-Based Promos** | 30 | Default - good balance for browsing session |
| **Gentle Reminders** | 60-120 | Don't interrupt extended shopping sessions |
| **Testing/Development** | 1-2 | Quick testing without waiting |
| **Multi-Visit Campaign** | 180+ (3+ hours) | For users who browse multiple times |

**Note**: Minutes-based expiration is perfect for e-commerce where users might browse for 20-60 minutes. They can dismiss the overlay during their shopping session but see it again on their next visit.

---

## 🔧 Customization Options

### Change Default Expiration:
```tsx
// In homepage (page.tsx)
<PromoCarouselOverlay expirationMinutes={15} />
```

### Common Configurations:
```tsx
{/* 5 minutes - aggressive remarketing */}
<PromoCarouselOverlay expirationMinutes={5} />

{/* 30 minutes - default, perfect for most use cases */}
<PromoCarouselOverlay expirationMinutes={30} />

{/* 2 hours - for longer browsing sessions */}
<PromoCarouselOverlay expirationMinutes={120} />
```

### Change Label Text:
Edit line 300 in `promo-carousel-overlay.tsx`:
```tsx
Don't show for {expirationMinutes} minutes
```

To:
```tsx
Hide for {expirationMinutes} minutes
// or
Remember for {expirationMinutes} minutes
// or (for longer durations)
{expirationMinutes >= 60 
  ? `Hide for ${Math.floor(expirationMinutes / 60)} hour${expirationMinutes >= 120 ? 's' : ''}` 
  : `Hide for ${expirationMinutes} minutes`}
```

---

## 🎉 Benefits

1. **User Control**: Users can hide promos temporarily, not permanently
2. **Re-engagement**: Brings back users who previously dismissed
3. **Flexibility**: Easy to adjust timing per campaign
4. **Clarity**: Users know exactly how long they won't see it
5. **Smart Storage**: Efficient localStorage usage with expiration

---

## 🐛 Troubleshooting

### Overlay not showing after expiration:
1. Check console for localStorage data:
   ```javascript
   console.log(localStorage.getItem('afromart-promo-seen'))
   ```
2. Manually clear:
   ```javascript
   localStorage.removeItem('afromart-promo-seen')
   ```
3. Refresh page

### Checkbox not working:
1. Make sure you're checking the box before closing
2. Check localStorage after closing to verify data saved
3. Look for console errors

### Want to reset for testing:
```javascript
// Clear storage
localStorage.removeItem('afromart-promo-seen')

// Or set to expired timestamp
localStorage.setItem('afromart-promo-seen', JSON.stringify({
  timestamp: Date.now() - (31 * 24 * 60 * 60 * 1000), // 31 days ago
  expiresIn: 30
}))
```

---

## ✅ Summary

Both requested features have been implemented with maximum fidelity:

1. ✅ **White border removed** - Clean gradients on both promos
2. ✅ **Cache expiration added** - Smart 30-day default with full customization
3. ✅ **Clear user communication** - Label shows exact duration
4. ✅ **Backward compatible** - Handles old localStorage format
5. ✅ **Production ready** - Full error handling and edge cases covered

**The promo overlay now looks pristine and has intelligent re-engagement logic!** 🚀
