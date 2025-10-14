# Order Forwarding System - Package Recommendations

## Executive Summary

For the order forwarding system to appear as normal users and automate supplier orders on https://howtfoods.com.au, we need packages that provide:
1. **Browser fingerprint randomization** (appear as different users)
2. **Session management** (fresh identity each time)
3. **Automation capabilities** (auto-fill forms when needed)
4. **Proxy/VPN rotation** (different IP addresses)
5. **Advanced privacy features** (anti-detection)

## 🎯 **HIGHLY RECOMMENDED** - Immediate Implementation

### 1. **Playwright** (CRITICAL)
```bash
yarn add -D playwright @playwright/test
yarn playwright install chromium
```

**Why:** Industry-standard browser automation with anti-detection features
**Benefits:**
- Headless browser automation for supplier orders
- Built-in stealth mode (appears as real Chrome)
- Screenshot/PDF generation for order confirmations
- Network interception for session control
- Mobile device emulation
- Geolocation spoofing

**Use Case:**
```typescript
// Auto-fill supplier forms programmatically
const browser = await chromium.launch({ headless: false })
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  viewport: { width: 1920, height: 1080 },
  locale: 'en-AU',
  timezoneId: 'Australia/Sydney',
  permissions: ['geolocation'],
  geolocation: { latitude: -33.8688, longitude: 151.2093 }, // Sydney
})
```

**Integration:** Create API route `/admin/automation/place-order` that uses Playwright server-side

---

### 2. **puppeteer-extra + puppeteer-extra-plugin-stealth** (CRITICAL)
```bash
yarn add puppeteer-extra puppeteer-extra-plugin-stealth
yarn add puppeteer-extra-plugin-user-preferences
yarn add puppeteer-extra-plugin-user-data-dir
```

**Why:** Advanced anti-detection beyond standard Playwright
**Benefits:**
- Passes bot detection tests (Cloudflare, PerimeterX, DataDome)
- Randomizes canvas fingerprints
- Spoofs WebGL renderer
- Removes automation flags (`navigator.webdriver`)
- Mimics real user behavior patterns

**Use Case:**
```typescript
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
})
```

**Integration:** Use for howtfoods.com.au order automation (they likely have bot detection)

---

### 3. **fingerprint-generator + fingerprint-injector** (HIGH PRIORITY)
```bash
yarn add fingerprint-generator fingerprint-injector
```

**Why:** Generate realistic browser fingerprints that match real users
**Benefits:**
- Creates complete browser fingerprints (headers, canvas, fonts, plugins)
- Based on real user data from BrowserLeaks.com
- Per-order randomization (appear as different customers)
- Configurable by OS, browser, device type

**Use Case:**
```typescript
import FingerprintGenerator from 'fingerprint-generator'

const fingerprintGenerator = new FingerprintGenerator({
  devices: ['desktop'],
  browsers: ['chrome'],
  operatingSystems: ['windows', 'macos'],
  locales: ['en-AU', 'en-US']
})

const fingerprint = fingerprintGenerator.getFingerprint()
// Use fingerprint.fingerprint for headers, canvas, WebGL
```

**Integration:** Generate new fingerprint per order in embedded-browser widget

---

### 4. **user-agents** (MEDIUM PRIORITY)
```bash
yarn add user-agents
```

**Why:** Rotating realistic user agents
**Benefits:**
- 500,000+ real user agent strings
- Filter by device type, browser, OS
- Weighted random selection (popular UAs more common)
- Always up-to-date with latest browsers

**Use Case:**
```typescript
import UserAgent from 'user-agents'

const userAgent = new UserAgent({ 
  deviceCategory: 'desktop',
  platform: 'Win32'
})
console.log(userAgent.toString())
// Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0
```

**Integration:** Set iframe user-agent via proxy API route

---

### 5. **uuid** + **nanoid** (LOW PRIORITY - Already Common)
```bash
yarn add uuid nanoid
```

**Why:** Generate unique session IDs and tracking tokens
**Benefits:**
- Cryptographically secure random IDs
- URL-safe format
- Collision-resistant

**Use Case:**
```typescript
import { nanoid } from 'nanoid'

const sessionId = nanoid() // '4f6h3dR7_9fG2kL5'
const orderRef = nanoid(10) // Shorter for order refs
```

**Integration:** Already implementing basic version, upgrade for better entropy

---

## 🚀 **ADVANCED** - Future Enhancements

### 6. **axios-cookiejar-support + tough-cookie**
```bash
yarn add axios-cookiejar-support tough-cookie
```

**Why:** Persistent cookie management across sessions
**Benefits:**
- Store/restore cookies between orders
- Simulate returning customer (if beneficial)
- Clear cookies for fresh identity
- Domain-specific cookie isolation

---

### 7. **playwright-extra** (If using Playwright)
```bash
yarn add playwright-extra playwright-extra-plugin-stealth
```

**Why:** Stealth plugins for Playwright (like puppeteer-extra)
**Benefits:**
- Anti-detection for Playwright
- Easier than Puppeteer if already using Playwright

---

### 8. **rotating-proxy** or **proxy-chain**
```bash
yarn add proxy-chain
```

**Why:** Rotate IP addresses for each order
**Benefits:**
- Appear from different locations
- Avoid rate limiting
- Residential proxy support
- SOCKS5/HTTP proxy rotation

**Note:** Requires proxy service subscription (BrightData, Oxylabs, etc.)

---

### 9. **random-useragent**
```bash
yarn add random-useragent
```

**Why:** Simpler alternative to `user-agents`
**Benefits:**
- Lightweight (5KB)
- Fast random selection
- Good for basic needs

---

## 📦 **UTILITY** - Quality of Life

### 10. **zod** (ALREADY INSTALLED ✅)
**Current Version:** 4.1.12 ✅
**Why:** Runtime validation for order data
**Benefits:**
- Type-safe data validation
- Error handling for API responses
- Schema validation for supplier responses

---

### 11. **date-fns** or **luxon**
```bash
yarn add date-fns
```

**Why:** Better date handling for order timestamps
**Benefits:**
- Timezone-aware formatting
- Australian date formats
- Order scheduling logic

---

### 12. **retry** or **p-retry**
```bash
yarn add p-retry
```

**Why:** Automatic retry logic for failed automation
**Benefits:**
- Exponential backoff
- Configurable retry attempts
- Error classification (retry vs fail)

---

## 🎭 **RECOMMENDED IMPLEMENTATION STRATEGY**

### **Phase 1: Core Anti-Detection** (NOW)
1. ✅ Install Playwright + Stealth Plugin
2. ✅ Install fingerprint-generator
3. ✅ Install user-agents
4. ✅ Create automation API route
5. ✅ Implement fingerprint rotation in widgets

### **Phase 2: Advanced Automation** (WEEK 2)
1. Build Playwright automation scripts
2. Add proxy rotation (if budget allows)
3. Implement retry logic
4. Add order confirmation screenshots

### **Phase 3: Polish** (WEEK 3)
1. Add cookie management
2. Session persistence (if needed)
3. Analytics/logging for success rate
4. Error handling UI

---

## 💻 **CODE IMPLEMENTATION PLAN**

### Step 1: Install Core Packages
```bash
cd /workspaces/afro/afro-store
yarn add -D playwright @playwright/test
yarn add puppeteer-extra puppeteer-extra-plugin-stealth
yarn add fingerprint-generator fingerprint-injector
yarn add user-agents nanoid
yarn add p-retry

# Install browser binaries
yarn playwright install chromium
```

### Step 2: Create Automation Service
```typescript
// src/lib/automation/browser-service.ts
import { chromium } from 'playwright'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import FingerprintGenerator from 'fingerprint-generator'
import UserAgent from 'user-agents'

export class BrowserAutomationService {
  async createStealthBrowser() {
    const fingerprint = this.generateFingerprint()
    const context = await chromium.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        `--user-agent=${fingerprint.userAgent}`
      ]
    })
    return { browser: context, fingerprint }
  }
  
  generateFingerprint() {
    const generator = new FingerprintGenerator()
    return generator.getFingerprint()
  }
}
```

### Step 3: Create API Route for Automation
```typescript
// src/api/admin/automation/place-order/route.ts
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { orderId, supplierUrl } = req.body
  
  const service = new BrowserAutomationService()
  const { browser, fingerprint } = await service.createStealthBrowser()
  
  // Navigate and auto-fill
  const page = await browser.newPage()
  await page.goto(supplierUrl)
  
  // ... automation logic
  
  return res.json({ success: true })
}
```

### Step 4: Update Widgets with Automation Option
```typescript
// Add button in embedded-browser.tsx
<Button onClick={() => handleAutomate()}>
  🤖 Auto-Fill Order (BETA)
</Button>
```

---

## 🔒 **PRIVACY & SECURITY CONSIDERATIONS**

### Best Practices:
1. **Never store sensitive data** (passwords, API keys) in widgets
2. **Use environment variables** for proxy credentials
3. **Rate limit automation** (1 order per 2 minutes)
4. **Rotate fingerprints** per order (already planned)
5. **Clear browser data** after each session
6. **Log automation attempts** for debugging
7. **Fail gracefully** with manual fallback

### howtfoods.com.au Specific:
- They likely use **Shopify** (check network tab)
- Shopify has **bot protection** (needs stealth)
- Use **Australian IPs** if possible (residential proxies)
- Mimic **Sydney timezone** and locale
- Add **2-5 second delays** between actions (human behavior)
- **Randomize mouse movements** (Playwright supports this)

---

## 💰 **COST ANALYSIS**

| Package | License | Cost | Priority |
|---------|---------|------|----------|
| Playwright | Apache 2.0 | FREE | HIGH |
| puppeteer-extra | MIT | FREE | HIGH |
| fingerprint-generator | MIT | FREE | HIGH |
| user-agents | MIT | FREE | MEDIUM |
| Residential Proxies | Subscription | $50-500/mo | LOW |
| BrightData Proxy | Subscription | $300-1000/mo | LOW |

**Total Cost (No Proxies):** $0
**Total Cost (With Proxies):** $50-1000/month depending on volume

---

## 📊 **SUCCESS METRICS**

Track these metrics after implementation:
1. **Detection Rate** - How often automation is blocked (target: <5%)
2. **Success Rate** - Orders successfully placed (target: >95%)
3. **Time per Order** - Manual vs automated (target: 10x faster)
4. **Session Isolation** - Unique fingerprints per order (target: 100%)

---

## ⚠️ **LEGAL & ETHICAL DISCLAIMER**

**Important:** Ensure your order forwarding use case complies with:
- howtfoods.com.au Terms of Service
- Australian Consumer Law
- E-commerce fraud prevention regulations
- Supplier partnership agreements

**Recommendation:** 
- Get explicit permission from howtfoods.com.au to place orders via automation
- Or negotiate API access/B2B partnership
- Document all automation for compliance purposes

---

## 🎯 **FINAL RECOMMENDATION**

**Install NOW (Phase 1):**
```bash
cd /workspaces/afro/afro-store
yarn add -D playwright @playwright/test
yarn add puppeteer-extra puppeteer-extra-plugin-stealth
yarn add fingerprint-generator user-agents nanoid p-retry
yarn playwright install chromium
```

**Total Install Time:** ~5 minutes
**Total Setup Time:** ~2 hours for basic automation
**Expected ROI:** 10x faster order processing, 100% session isolation

Would you like me to proceed with the installation and integration?
