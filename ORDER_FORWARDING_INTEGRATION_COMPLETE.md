# Order Forwarding System - Complete Integration Guide

## 🎯 Overview

Your complete order forwarding workflow with stealth browser capabilities:

```
┌──────────────────────────────────────────────────────────────────┐
│                    ORDER FORWARDING FLOW                         │
└──────────────────────────────────────────────────────────────────┘

1. ORDER FORWARDER WIDGET (order.list.before)
   ↓ User clicks "Forward to Supplier" button
   ↓ Sets orderForwardingState.currentOrder
   
2. EMBEDDED BROWSER WIDGET (order.list.after)
   ↓ Opens with stealth browser (puppeteer-extra + stealth plugin)
   ↓ Displays howtfoods.com.au in enhanced iframe
   ↓ User manually places order (copy/paste details)
   ↓ Optional: Click "🤖 Auto" for automated stealth browser window
   
3. FULFILLMENT MANAGER WIDGET (order.details.after)
   ↓ User marks order as fulfilled
   ↓ Adds tracking number (optional)
   ↓ Sends customer notification
   ↓ Order complete!
```

## 📦 Installed Packages & Their Roles

### ✅ Core Automation (ACTIVE)
- **`puppeteer`** (24.24.0) - Browser automation engine
- **`puppeteer-extra`** (3.3.6) - Plugin framework for puppeteer
- **`puppeteer-extra-plugin-stealth`** - **KEY**: Bypasses bot detection (Cloudflare, DataDome, etc.)
- **`puppeteer-extra-plugin-user-preferences`** - Sets realistic browser preferences

### ✅ Anti-Detection (ACTIVE)
- **`user-agents`** (1.1.668) - 500,000+ real user agent strings, rotates per session
- **`fingerprint-generator`** - Generates realistic browser fingerprints (note: API is different, using user-agents instead)
- **`fingerprint-injector`** - Injects fingerprints (note: puppeteer-stealth handles this)

### ✅ Session Management (ACTIVE)
- Custom session ID generation: `sess_{timestamp}_{random}`
- Sydney geolocation with ±5km randomization
- Viewport randomization (common resolutions: 1920x1080, 1366x768, 1440x900, 2560x1440)

### ✅ Testing & Reliability (ACTIVE)
- **`playwright`** (1.56.0) + **`@playwright/test`** - Available for future E2E testing
- Manual retry logic in API route (3 attempts with 2s delay)

## 🔒 Stealth Features Implemented

### 1. **Puppeteer-Extra Stealth Plugin** (CRITICAL)
```typescript
puppeteer.use(StealthPlugin())
```
**What it does:**
- Removes `navigator.webdriver` flag
- Hides automation traces in console
- Patches `window.chrome` object
- Randomizes canvas fingerprints
- Spoofs WebGL renderer
- Passes bot detection tests

### 2. **User Agent Rotation**
```typescript
const userAgent = new UserAgent({
  deviceCategory: 'desktop',
  platform: 'Win32'
})
// Rotates from 500,000+ real user agents
```

### 3. **Sydney Geolocation with Randomization**
```typescript
const sydneyLat = -33.8688 + (Math.random() - 0.5) * 0.05 // ±5km
const sydneyLng = 151.2093 + (Math.random() - 0.5) * 0.05
```
**Each session appears from a different location in Sydney metro area**

### 4. **Screen & Viewport Randomization**
- Common resolutions: 1920x1080, 1366x768, 1440x900, 2560x1440
- Slight randomization (±100px) to avoid fingerprinting
- Realistic taskbar height (40px)

### 5. **Canvas & WebGL Fingerprint Noise**
```typescript
// Adds subtle noise to canvas data
imageData.data[i] += (Math.random() - 0.5) * 2

// Randomizes GPU renderer
gpus = ['Intel UHD 620', 'Intel UHD 630', 'Intel Iris Xe']
```

### 6. **Realistic HTTP Headers**
```typescript
'Accept-Language': 'en-AU,en-US;q=0.9,en;q=0.8'
'DNT': '1'
'Sec-Fetch-*': Proper values
'sec-ch-ua-platform': '"Windows"'
```

### 7. **Human-Like Behavior**
- Random delays (1-4 seconds between actions)
- Mouse movement simulation
- Random scrolling
- No robotic patterns

### 8. **Fresh Session Per Order**
- New session ID
- New user agent
- New geolocation coordinates
- New viewport dimensions
- **Result: Each order appears as a completely different visitor**

## 🎭 Widget Architecture

### Widget 1: Order Forwarder (`order-forwarder.tsx`)
**Location:** `src/admin/widgets/order-forwarder.tsx`
**Zone:** `order.list.before` (above order list)

**Features:**
- Fetches pending/processing orders
- Auto-refreshes every 30 seconds
- Configurable supplier URL (default: https://howtfoods.com.au)
- "Forward to Supplier" button per order
- Sends order to embedded browser via `orderForwardingState`

**Global State:**
```typescript
orderForwardingState = {
  currentOrder: AdminOrder | null,
  setOrder(order), // Notifies embedded browser
  subscribe(listener), // Cross-widget communication
}
```

---

### Widget 2: Embedded Browser (`embedded-browser.tsx`)
**Location:** `src/admin/widgets/embedded-browser.tsx`
**Zone:** `order.list.after` (below order list)

**Features:**
- **Iframe Mode** (default): Shows howtfoods.com.au in iframe with privacy features
  - `referrerPolicy="no-referrer"` - No referrer tracking
  - Sandbox attributes for security
  - Fresh session parameters (`?_t=timestamp&_sid=sessionId`)
  
- **🤖 Auto Mode** (advanced): Opens actual stealth browser window
  - Calls `/admin/automation/browser` API
  - Launches puppeteer with full stealth features
  - Separate browser window you can interact with
  - All anti-detection features active

**UI Elements:**
- Session ID badge (🔒 Fresh Session: xxxxxx)
- Automation status badge (shows when using Auto mode)
- Order details sidebar (customer, shipping address)
- Browser controls:
  - 🔄 Reload (creates new session)
  - 🤖 Auto (opens stealth browser)
  - ⬆️/⬇️ Fullscreen toggle
  - ✕ Minimize
- 📋 Copy Details button (copies order to clipboard)
- Items list at bottom

**Workflow:**
1. Order forwarder sends order → Widget opens
2. You see howtfoods.com.au in iframe (or click Auto for real browser)
3. Click "Copy Details" to get order info
4. Manually place order on howtfoods.com.au
5. Close widget when done

---

### Widget 3: Fulfillment Manager (`fulfillment-manager.tsx`)
**Location:** `src/admin/widgets/fulfillment-manager.tsx`
**Zone:** `order.details.after` (on order detail page)

**Features:**
- Shows order summary
- Tracking number input (optional)
- Shipping provider selector (Australia Post, Fastway, DHL, FedEx, UPS)
- Customer notification message (customizable)
- "Mark as Fulfilled & Notify Customer" button

**What happens:**
1. Creates fulfillment record in MedusaJS
2. Updates order status to "fulfilled"
3. Sends email to customer
4. Adds tracking info to order metadata
5. Shows success confirmation

## 🚀 Complete User Flow

### Step 1: View Pending Orders
1. Navigate to **Orders** page in Medusa admin
2. See **Order Forwarder** widget above order list
3. Configure supplier URL if needed (defaults to howtfoods.com.au)
4. View list of pending/processing orders

### Step 2: Forward Order to Supplier
1. Click **"📤 Forward to Supplier"** on an order
2. **Embedded Browser Widget** opens automatically below
3. See order details in sidebar:
   - Customer email
   - Shipping address
   - Items list with SKUs
   - Total amount

### Step 3: Place Order Manually
**Option A: Iframe Mode** (default, simpler)
1. howtfoods.com.au loads in iframe with fresh session
2. Click **"📋 Copy Details"** to copy order info
3. Navigate howtfoods.com.au and add items to cart
4. Paste customer details at checkout
5. Complete order

**Option B: Auto Mode** (advanced, more stealth)
1. Click **"🤖 Auto"** button
2. Real stealth browser window opens (puppeteer-extra)
3. All anti-detection features active:
   - ✅ Puppeteer-stealth plugin
   - ✅ Randomized user agent
   - ✅ Sydney geolocation
   - ✅ Canvas/WebGL noise
   - ✅ Human-like behavior
4. Manually place order in browser window
5. Browser appears as fresh visitor every time

### Step 4: Mark Order Fulfilled
1. After placing order on howtfoods.com.au
2. Navigate to order detail page in Medusa admin
3. **Fulfillment Manager Widget** appears at bottom
4. Enter tracking number (if available)
5. Select shipping provider
6. Customize customer notification message
7. Click **"✅ Mark as Fulfilled & Notify Customer"**
8. Customer receives email with tracking info
9. Order moves to "completed" status

## 📁 File Structure

```
afro-store/
├── src/
│   ├── admin/
│   │   └── widgets/
│   │       ├── order-forwarder.tsx         # Widget 1: Order list + forward button
│   │       ├── embedded-browser.tsx        # Widget 2: Iframe + auto browser
│   │       └── fulfillment-manager.tsx     # Widget 3: Mark fulfilled
│   │
│   ├── lib/
│   │   └── automation/
│   │       └── browser-service.ts          # Stealth browser service
│   │
│   └── api/
│       └── admin/
│           └── automation/
│               └── browser/
│                   └── route.ts            # API endpoint for automation
│
├── package.json                            # All packages installed ✅
└── node_modules/
    ├── puppeteer/                          # ✅ Installed
    ├── puppeteer-extra/                    # ✅ Installed
    ├── puppeteer-extra-plugin-stealth/     # ✅ Installed
    ├── user-agents/                        # ✅ Installed
    └── ...
```

## 🧪 Testing the System

### Test 1: Basic Flow (Iframe Mode)
```bash
1. Start dev server: bash start-dev.sh
2. Open admin: https://{codespace}-9000.app.github.dev/app
3. Navigate to Orders
4. Create test order (or use existing)
5. Click "Forward to Supplier"
6. Verify embedded browser opens
7. Verify session ID appears
8. Copy order details
9. Manually test on howtfoods.com.au
10. Mark as fulfilled
```

### Test 2: Auto Mode (Stealth Browser)
```bash
1. Click order in forwarder
2. Click "🤖 Auto" button
3. Check browser console for logs:
   [BrowserService] Generating realistic fingerprint...
   [BrowserService] Generated fingerprint: {sessionId, userAgent, ...}
   [BrowserService] Launching stealth browser...
   [BrowserService] ✅ Stealth browser created with full anti-detection
4. Verify new browser window opens
5. Check stealth features work:
   - No "webdriver" flag
   - Realistic user agent
   - Sydney geolocation
   - Random viewport
```

### Test 3: Stealth Detection
Visit these sites in Auto mode browser to test:
- https://bot.sannysoft.com/ (should pass all tests)
- https://arh.antoinevastel.com/bots/areyouheadless (should say NO)
- https://pixelscan.net/ (should show realistic fingerprint)
- https://browserleaks.com/canvas (should show noise)

## ⚙️ Configuration

### Supplier URL
**Default:** https://howtfoods.com.au
**Change:** Edit input in Order Forwarder widget
**Persists:** Saved to localStorage (`supplier_url` key)

### Session Behavior
**Fresh per order:** New session ID, user agent, geolocation
**Reload button:** Creates completely new session
**Auto mode:** Opens new browser each time

### Fulfillment Settings
**Tracking:** Optional, stored in order metadata
**Providers:** Australia Post (default), Fastway, DHL, FedEx, UPS, Other
**Notification:** Customizable message sent to customer

## 🐛 Troubleshooting

### Issue: "Cannot find name 'puppeteer'"
**Fix:** Run `cd afro-store && yarn install` to ensure all deps installed

### Issue: Browser doesn't open in Auto mode
**Check:**
1. Console logs for errors
2. API route at `/admin/automation/browser` is working
3. Puppeteer installed: `ls node_modules/puppeteer`

### Issue: howtfoods.com.au blocks iframe
**Cause:** X-Frame-Options header
**Solution:** Use **Auto mode** (real browser) instead of iframe

### Issue: Order not forwarding to embedded browser
**Check:**
1. `orderForwardingState` is exported from order-forwarder.tsx
2. embedded-browser.tsx imports it correctly
3. Console logs for subscription events

### Issue: Stealth detection fails
**Check:**
1. puppeteer-extra-plugin-stealth is installed
2. StealthPlugin() is used before launching browser
3. Test on bot.sannysoft.com

## 📊 Success Metrics

After implementation, you should see:
- ✅ Fresh session ID per order (different every time)
- ✅ Randomized user agents (check in Auto mode console)
- ✅ Sydney geolocation (±5km randomization)
- ✅ Passes bot detection tests (bot.sannysoft.com)
- ✅ No "webdriver" flag visible
- ✅ Realistic canvas fingerprint with noise
- ✅ Manual order placement works smoothly
- ✅ Fulfillment notifications sent successfully

## 🎯 Key Takeaways

### What Works Now:
1. ✅ **Iframe Mode** - Simple, works in-widget, fresh sessions
2. ✅ **Auto Mode** - Full stealth browser with puppeteer-extra
3. ✅ **Session Isolation** - Each order = fresh visitor
4. ✅ **Manual Flow** - You place orders, system assists
5. ✅ **Fulfillment Tracking** - Mark complete + notify customer

### What You Get:
- **Stealth Features**: puppeteer-extra-plugin-stealth (bypasses detection)
- **User Agent Rotation**: 500,000+ real user agents
- **Geolocation Spoofing**: Sydney with randomization
- **Fingerprint Noise**: Canvas, WebGL, screen properties
- **Human Behavior**: Random delays, mouse movement, scrolling
- **Fresh Sessions**: Different identity per order

### What's Manual (By Design):
- **Order placement**: You add items + checkout
- **Copy/paste**: Order details → howtfoods.com.au
- **Fulfillment**: You mark complete after supplier confirms

This keeps complexity low while providing all stealth/privacy features you need!

## 🔮 Future Enhancements (Optional)

If you want to automate further:
1. **Auto-fill forms** - Use puppeteer to fill checkout forms
2. **Screenshot confirmations** - Auto-save order confirmations
3. **Proxy rotation** - Different IPs per order (requires proxy service)
4. **Retry logic** - Auto-retry failed orders
5. **Bulk forwarding** - Forward multiple orders at once

For now, the manual approach with stealth features is the sweet spot! 🎯
