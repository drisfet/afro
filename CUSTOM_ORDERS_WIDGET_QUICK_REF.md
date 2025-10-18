# Quick Reference: Custom Orders Widget Implementation

## 🎯 One-Line Summary
Create a custom Medusa Admin widget to display orders with enhanced UI and future automation capabilities.

## 📁 File to Create
```
/workspaces/afro/afro-store/src/admin/widgets/orders-widget.tsx
```

## 🔑 Key Commands
```bash
cd /workspaces/afro/afro-store
yarn dev  # Start backend + admin
# Admin URL: https://${CODESPACE_NAME}-9000.app.github.dev/app
```

## 📦 Required Imports
```typescript
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Button, Text } from "@medusajs/ui"
import { AdminOrder } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
```

## 🎨 Widget Template (Minimal)
```typescript
const OrdersWidget = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  
  useEffect(() => {
    // TODO: Fetch orders from /admin/orders API
  }, [])

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Custom Orders</Heading>
      </div>
      {/* TODO: Display orders */}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before" // Shows at top of orders page
})

export default OrdersWidget
```

## 🎯 Injection Zones
- `order.list.before` ← **Use this**
- `order.list.after`
- `order.details.before`
- `order.details.after`

## 🎨 Medusa UI Components
- `Container` - Card wrapper
- `Heading` - Titles
- `Badge` - Status indicators
- `Button` - Actions
- `Table` - Data tables
- `Text` - Body text

## 🌈 Branding Colors
- Orange: `bg-orange-600` `text-orange-600`
- Neutral: slate palette
- Status badges: `<Badge color="green|orange|red|default">`

## ✅ Success Checklist
1. Widget shows on `/admin/orders` page
2. Orders fetch and display
3. Loading state works
4. Empty state works
5. Styling matches admin design
6. No TypeScript errors
7. Commented for future enhancements

## 🚀 Future Enhancements (Don't implement yet)
- Workflow triggers
- External API forwarding
- Real-time updates
- Bulk actions
- Custom metadata

## 📚 Full Documentation
See `CUSTOM_ORDERS_WIDGET_PROMPT.md` for comprehensive details.
