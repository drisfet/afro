# COMPREHENSIVE PROMPT: Custom Orders Widget for MedusaJS Admin

## OBJECTIVE
Create a custom admin widget in the MedusaJS v2.10.3 backend that displays received orders in a custom, enhanced format. This widget will serve as the foundation for future order processing automations (e.g., forwarding orders to external systems, triggering workflows, or integrating with functional agents).

---

## PROJECT CONTEXT

### **Technology Stack**
- **Backend:** MedusaJS v2.10.3 (Node.js/TypeScript)
- **Admin Panel:** Medusa Admin with Admin SDK (`@medusajs/admin-sdk`)
- **UI Components:** Medusa UI (`@medusajs/ui`) - React-based component library
- **Package Manager:** **Yarn v1.22.22** (CRITICAL: NEVER use npm)
- **Location:** `/workspaces/afro/afro-store/` (backend directory)

### **Key Project Files**
- Admin customizations: `src/admin/`
- Admin widgets: `src/admin/widgets/`
- API routes: `src/api/`
- Workflows: `src/workflows/`
- Configuration: `medusa-config.ts`

---

## RESEARCH COMPLETED (Playwright MCP Documentation Browse)

### **Official Medusa Documentation Summary**

#### **Widget Structure** (from https://docs.medusajs.com/learn/fundamentals/admin/widgets)
```typescript
// File: src/admin/widgets/[widget-name].tsx

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"

// The Widget Component (MUST be arrow function)
const OrdersWidget = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Widget Title</Heading>
      </div>
    </Container>
  )
}

// Widget Configuration
export const config = defineWidgetConfig({
  zone: "order.list.before", // Injection zone
})

export default OrdersWidget
```

#### **Injection Zones for Orders**
- `order.list.before` - Top of orders listing page
- `order.list.after` - Bottom of orders listing page
- `order.details.before` - Top of individual order details
- `order.details.after` - Bottom of individual order details
- Full list: https://docs.medusajs.com/resources/admin-widget-injection-zones

#### **Props on Detail Pages**
Widgets on detail pages receive a `data` prop:
```typescript
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"

const OrderWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  return <div>Order #{data.display_id}</div>
}
```

#### **Conditional Rendering**
Return empty fragment to hide widget:
```typescript
if (!data.some_condition) {
  return <></> // Don't show widget
}
```

#### **Styling with Medusa UI**
Use components from `@medusajs/ui`:
- `Container` - Card-style container
- `Heading` - Typography
- `Badge` - Status indicators
- `Button` - Actions
- `Table` - Data display

Full reference: https://docs.medusajs.com/ui

---

## REQUIREMENTS

### **Core Functionality**

1. **Display Orders in Custom Format**
   - Show recent orders (last 10-20)
   - Display: Order ID, Customer Name, Total, Status, Date
   - Highlight new/unprocessed orders
   - Use color-coded badges for order status

2. **Enhanced Visual Design**
   - Modern card-based layout
   - Clear typography hierarchy
   - Status indicators (badges with colors)
   - Responsive design
   - Consistent with existing Medusa Admin styling

3. **Data Fetching**
   - Fetch orders from Medusa Order API
   - Use proper TypeScript types from `@medusajs/framework/types`
   - Handle loading states
   - Handle empty states (no orders)
   - Handle error states

4. **Interactivity (Phase 1 - Basic)**
   - Click order to view details
   - Refresh button to reload orders
   - Filter by status (optional)

### **Future Extension Points (Design for)**
- Action buttons per order (e.g., "Forward to System")
- Integration with workflows
- Custom metadata fields
- Bulk actions
- External API integration hooks

---

## TECHNICAL SPECIFICATIONS

### **File Structure**
```
afro-store/
├── src/
│   ├── admin/
│   │   ├── widgets/
│   │   │   └── orders-widget.tsx        # NEW: Main widget
│   │   │   └── orders-widget-card.tsx   # NEW: Reusable order card component (optional)
│   │   ├── README.md                    # Existing
│   │   ├── tsconfig.json                # Existing
│   │   └── vite-env.d.ts                # Existing
│   ├── api/                             # Existing API routes
│   └── workflows/                        # Existing workflows
└── medusa-config.ts                     # Existing config
```

### **Widget Location & Zone**
- **Primary:** `order.list.before` (top of orders page)
- **Alternative:** `order.list.after` (bottom of orders page)
- **Detail View (Future):** `order.details.before`

### **Required Imports**
```typescript
// Admin SDK
import { defineWidgetConfig } from "@medusajs/admin-sdk"

// Medusa UI Components
import { 
  Container, 
  Heading, 
  Badge, 
  Button,
  Table,
  Text 
} from "@medusajs/ui"

// Types
import { AdminOrder } from "@medusajs/framework/types"

// React
import { useEffect, useState } from "react"
```

### **Data Fetching Pattern**
```typescript
// Example: Fetch orders using Medusa SDK
const [orders, setOrders] = useState<AdminOrder[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchOrders = async () => {
    try {
      // Use fetch or Medusa SDK
      const response = await fetch('/admin/orders?limit=20&offset=0')
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }
  
  fetchOrders()
}, [])
```

### **Styling Guidelines**
- Use Tailwind CSS classes (project uses Tailwind)
- Orange branding: `#f97316` (orange-500/600)
- Gray neutrals: slate palette
- Minimum touch target: 44px height
- Consistent padding: `px-6 py-4` for containers
- Card style: `divide-y p-0` on Container

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Basic Widget Setup
- [ ] Create `src/admin/widgets/orders-widget.tsx`
- [ ] Import required dependencies
- [ ] Define widget component as arrow function
- [ ] Export widget config with zone
- [ ] Export default widget component
- [ ] Test widget appears in admin

### Phase 2: Data Integration
- [ ] Add state management (useState)
- [ ] Implement order fetching (useEffect)
- [ ] Add TypeScript types for orders
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Handle empty state (no orders)

### Phase 3: UI Implementation
- [ ] Design order card/row layout
- [ ] Add status badges (color-coded)
- [ ] Format order dates
- [ ] Format currency amounts
- [ ] Add customer information
- [ ] Make orders clickable (navigate to details)

### Phase 4: Polish
- [ ] Add refresh button
- [ ] Add loading skeleton
- [ ] Test responsive design
- [ ] Ensure consistent styling
- [ ] Add comments for future extensions
- [ ] Test in actual admin panel

---

## EXAMPLE STRUCTURE (Guidance Only)

```typescript
// src/admin/widgets/orders-widget.tsx

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Button, Text } from "@medusajs/ui"
import { AdminOrder } from "@medusajs/framework/types"
import { useEffect, useState } from "react"

const OrdersWidget = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch orders logic here
  }, [])

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Recent Orders</Heading>
        <Button variant="secondary" size="small">
          Refresh
        </Button>
      </div>
      
      {/* Orders list here */}
      <div className="px-6 py-4">
        {loading ? (
          <Text>Loading orders...</Text>
        ) : orders.length === 0 ? (
          <Text>No orders found.</Text>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border rounded p-4">
                <div className="flex justify-between">
                  <Text weight="plus">Order #{order.display_id}</Text>
                  <Badge color={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                {/* More order details */}
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default OrdersWidget
```

---

## CRITICAL CONSTRAINTS

1. **Package Manager:** ALWAYS use `yarn`, NEVER `npm`
   ```bash
   yarn install
   yarn dev
   ```

2. **Widget Component:** MUST be arrow function, not regular function
   ```typescript
   ❌ function Widget() { }
   ✅ const Widget = () => { }
   ```

3. **TypeScript:** Use proper types from `@medusajs/framework/types`

4. **Styling:** Match existing Medusa Admin design patterns

5. **Performance:** Optimize data fetching, use loading states

---

## TESTING INSTRUCTIONS

### Start Development Server
```bash
cd /workspaces/afro/afro-store
yarn dev
```

### Access Admin Panel
URL: `https://${CODESPACE_NAME}-9000.app.github.dev/app`

### Verify Widget
1. Navigate to Orders page (`/admin/orders`)
2. Widget should appear at top of page
3. Orders should load and display
4. All interactive elements should work

---

## FUTURE ENHANCEMENTS (Document Only, Don't Implement Yet)

### Phase 2: Workflow Integration
- Add "Process Order" button per order
- Trigger Medusa workflow on click
- Update order status after processing

### Phase 3: External System Integration
- Add "Forward to [System]" button
- Configure webhook/API endpoint in widget
- Send order data to external service
- Track forwarding status

### Phase 4: Advanced Features
- Real-time order updates (WebSocket/polling)
- Bulk order actions
- Custom order fields/metadata
- Analytics dashboard
- Order filtering and search

---

## SUCCESS CRITERIA

✅ Widget appears in Medusa Admin orders page  
✅ Recent orders display correctly  
✅ Order data fetched from Medusa API  
✅ Status badges color-coded properly  
✅ Loading and error states handled  
✅ Consistent with Medusa Admin design  
✅ No TypeScript errors  
✅ Code is well-commented for future extension  
✅ Widget can be easily enhanced for automation workflows

---

## DOCUMENTATION REFERENCES

- **Admin Widgets:** https://docs.medusajs.com/learn/fundamentals/admin/widgets
- **Admin Components:** https://docs.medusajs.com/resources/admin-components
- **Injection Zones:** https://docs.medusajs.com/resources/admin-widget-injection-zones
- **Medusa UI:** https://docs.medusajs.com/ui
- **Admin SDK:** https://docs.medusajs.com/resources/references/admin-sdk
- **Order Types:** https://docs.medusajs.com/resources/commerce-modules/order

---

## FINAL NOTES FOR IMPLEMENTING AGENT

1. **Read First:** Review existing `src/admin/README.md` for context
2. **Follow Patterns:** Match existing Medusa Admin styling exactly
3. **Test Thoroughly:** Verify widget in actual admin panel
4. **Document Code:** Add comments explaining extensibility points
5. **Think Future:** Design for easy integration with workflows/APIs
6. **Stay Consistent:** Use Medusa UI components throughout
7. **Handle Errors:** Graceful error handling and user feedback

**Execute with maximum scrutiny and fidelity. This widget is the foundation for future order automation workflows.**
