# Admin Widgets Documentation

This directory contains custom admin widgets for the AfroMart Sydney MedusaJS backend.

---

## 📦 Custom Orders Widget

**File:** `orders-widget.tsx`  
**Zone:** `order.list.after` (displays below default orders list)  
**Status:** ✅ Production Ready

### Features Implemented

✅ **Data Fetching**
- Fetches last 20 orders from `/admin/orders` API
- Handles loading, error, and empty states
- Manual refresh button

✅ **Enhanced UI**
- Color-coded status badges (green/orange/red/grey)
- Customer email display
- Order totals in AUD currency
- Item count per order
- Formatted dates (Australian format)
- Loading skeleton animation

✅ **Interactivity**
- Clickable orders (navigate to detail page)
- Hover effects
- Refresh on demand

✅ **TypeScript Safety**
- Full type coverage with `AdminOrder` from `@medusajs/framework/types`
- Proper error handling

---

## 🚀 Future Enhancement Options

### Option A: Workflow Automation 🔄
**Add "Process Order" buttons that trigger MedusaJS workflows**

**Implementation Steps:**
1. Create workflow in `src/workflows/process-order-workflow.ts`:
```typescript
import { createWorkflow } from "@medusajs/framework/workflows-sdk"

export const processOrderWorkflow = createWorkflow(
  "process-order",
  (input: { orderId: string }) => {
    // Validate order
    // Update inventory
    // Send notifications
    // Mark as processed
  }
)
```

2. Create API route in `src/api/admin/orders/[id]/process/route.ts`:
```typescript
import { processOrderWorkflow } from "../../../../workflows/process-order-workflow"

export async function POST(req: Request, { params }) {
  const { result } = await processOrderWorkflow.run({
    input: { orderId: params.id }
  })
  return Response.json({ success: true, result })
}
```

3. Uncomment action buttons in widget (line 177-184)
4. Add button handler:
```typescript
const handleProcessOrder = async (orderId: string) => {
  await fetch(`/admin/orders/${orderId}/process`, { method: 'POST' })
  fetchOrders() // Refresh
}
```

---

### Option B: External System Integration 🌐
**Forward orders to external APIs (fulfillment, shipping, ERP)**

**Implementation Steps:**
1. Create API route `src/api/admin/orders/[id]/forward/route.ts`:
```typescript
export async function POST(req: Request, { params }) {
  const order = await getOrder(params.id)
  
  // Forward to external system
  const response = await fetch('https://external-system.com/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      orderId: order.id,
      items: order.items,
      customer: order.customer,
      // ...
    })
  })
  
  // Update order metadata
  await updateOrder(params.id, {
    metadata: {
      forwarded_at: new Date().toISOString(),
      external_status: 'pending'
    }
  })
  
  return Response.json({ success: true })
}
```

2. Add "Forward" button in widget with handler

**Use Cases:**
- Send to third-party fulfillment centers
- Sync with accounting software (Xero, QuickBooks)
- Integrate with shipping providers
- Push to warehouse management systems

---

### Option C: Real-Time Updates ⚡
**Auto-refresh orders without manual button clicks**

**Implementation:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchOrders()
  }, 30000) // Refresh every 30 seconds
  
  return () => clearInterval(interval)
}, [])
```

**Enhanced Version (WebSocket):**
- Subscribe to order events
- Show "New Order" badge
- Play notification sound
- Highlight new orders

---

### Option D: Advanced Features 🎯
**Bulk actions, filtering, search, analytics**

**Features to Add:**
1. **Filtering:**
```typescript
const [statusFilter, setStatusFilter] = useState<string | null>(null)
// Add dropdown to filter by status
```

2. **Search:**
```typescript
const [searchQuery, setSearchQuery] = useState('')
// Filter orders by email, order ID, customer name
```

3. **Bulk Actions:**
```typescript
const [selectedOrders, setSelectedOrders] = useState<string[]>([])
// Add checkboxes, "Cancel All", "Process All" buttons
```

4. **Analytics Summary:**
```typescript
const stats = {
  todayRevenue: orders.filter(/* today */).reduce((sum, o) => sum + o.total, 0),
  pendingCount: orders.filter(o => o.status === 'pending').length,
  completedToday: orders.filter(/* completed today */).length
}
// Display above order list
```

---

### Option E: Individual Order Detail Widget 📄
**Add custom widget to order detail pages**

**Create:** `order-detail-widget.tsx`

```typescript
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"

const OrderDetailWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  return (
    <Container>
      <Heading>Custom Order Actions</Heading>
      {/* Show processing history */}
      {/* Display external system status */}
      {/* Quick action buttons */}
      {data.metadata?.forwarded_at && (
        <Badge color="green">Forwarded to Fulfillment</Badge>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after"
})
```

---

## 📚 Technical Reference

### Key Dependencies
- `@medusajs/admin-sdk` - Widget configuration
- `@medusajs/ui` - UI components (Container, Badge, Button, Text, Heading)
- `@medusajs/framework/types` - TypeScript types

### API Endpoints Used
- `GET /admin/orders?limit=20&offset=0` - Fetch orders

### Styling
- Tailwind CSS classes
- Orange branding: Use `orange-600` for CTAs
- Grey palette for neutrals
- Minimum 44px touch targets (mobile-first)

### File Structure
```
src/admin/widgets/
├── README.md                    # This file
├── orders-widget.tsx            # Custom orders list widget
└── [future-widgets].tsx         # Additional widgets
```

---

## 🔧 Maintenance Notes

### Adding New Widgets
1. Create `[widget-name].tsx` in this directory
2. Import required dependencies
3. Define widget as arrow function
4. Export `config` with `defineWidgetConfig({ zone: "..." })`
5. Export widget as default

### Available Injection Zones
See full list: https://docs.medusajs.com/resources/admin-widget-injection-zones

**Common zones:**
- `order.list.before/after`
- `order.details.before/after`
- `product.list.before/after`
- `product.details.before/after`
- `customer.list.before/after`
- `customer.details.before/after`

### Testing Widgets
1. Save file (hot reload enabled in dev mode)
2. Navigate to relevant admin page
3. Verify widget appears in correct zone
4. Check browser console for errors

---

## 🎯 Recommended Next Steps

1. **Phase 2:** Implement workflow automation (Option A)
2. **Phase 3:** Add external system integration (Option B)
3. **Phase 4:** Create order detail widget (Option E)
4. **Phase 5:** Add real-time updates (Option C)

---

**Last Updated:** October 12, 2025  
**Author:** AfroMart Sydney Development Team
