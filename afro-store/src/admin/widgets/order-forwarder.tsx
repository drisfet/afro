/**
 * Order Forwarder Widget
 * 
 * Shows orders with ability to forward them to an external supplier/warehouse.
 * When clicked, opens the embedded browser widget with order details pre-filled.
 */

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Button, Text, Label, Input } from "@medusajs/ui"
import { AdminOrder } from "@medusajs/framework/types"
import { useEffect, useState } from "react"

// Order forwarding state management
const orderForwardingState = {
  listeners: [] as Array<(order: AdminOrder | null) => void>,
  currentOrder: null as AdminOrder | null,
  
  setOrder(order: AdminOrder | null) {
    this.currentOrder = order
    this.listeners.forEach(listener => listener(order))
  },
  
  subscribe(listener: (order: AdminOrder | null) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
}

// Export for use in other widgets
export { orderForwardingState }

const OrderForwarder = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supplierUrl, setSupplierUrl] = useState(() => {
    // Load saved supplier URL from localStorage
    return localStorage.getItem('supplier_url') || 'https://howtfoods.com.au'
  })
  const [isEditingUrl, setIsEditingUrl] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // MedusaJS v2 API format
      const params = new URLSearchParams({
        limit: '20',
        offset: '0',
        fields: '+items,+shipping_address,+customer'
      })
      
      const response = await fetch(`/admin/orders?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to fetch orders: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Filter for pending/processing orders only
      const filteredOrders = (data.orders || []).filter((order: AdminOrder) => {
        return order.status === 'pending' || order.status === 'processing'
      })
      
      setOrders(filteredOrders)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSaveUrl = () => {
    localStorage.setItem('supplier_url', supplierUrl)
    setIsEditingUrl(false)
  }

  const handleForwardOrder = (order: AdminOrder) => {
    // Set the order in global state so the browser widget can pick it up
    orderForwardingState.setOrder(order)
    
    // Visual feedback
    console.log('Order forwarded to browser widget:', order.display_id)
  }

  const getStatusColor = (status: string): "green" | "orange" | "red" | "blue" | "grey" | "purple" => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'green'
      case 'pending':
      case 'processing':
        return 'orange'
      case 'canceled':
      case 'cancelled':
      case 'failed':
        return 'red'
      default:
        return 'grey'
    }
  }

  const formatCurrency = (amount: number, currencyCode: string = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-AU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4 bg-ui-bg-base border-b border-ui-border-base">
        <div>
          <Heading level="h2" className="text-ui-fg-base">Order Forwarder</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1">
            Forward orders to your supplier for fulfillment
          </Text>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="small"
            onClick={fetchOrders}
            disabled={loading}
          >
            {loading ? '↻' : '🔄'} Refresh
          </Button>
        </div>
      </div>

      {/* Supplier URL Configuration */}
            {/* Supplier URL Configuration */}
      <div className="px-6 py-4 bg-ui-bg-subtle border-b border-ui-border-base">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label className="text-ui-fg-base font-medium mb-2">Supplier Website URL</Label>
            <div className="flex gap-2">
              <Input
                value={supplierUrl}
                onChange={(e) => setSupplierUrl(e.target.value)}
                placeholder="https://howtfoods.com.au"
                className="flex-1 bg-ui-bg-base text-ui-fg-base"
                disabled={!isEditingUrl}
              />
              {isEditingUrl ? (
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={handleSaveUrl}
                >
                  ✓ Save
                </Button>
              ) : (
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={() => setIsEditingUrl(true)}
                >
                  ✎ Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        {loading && orders.length === 0 ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-ui-border-base rounded-lg p-4 animate-pulse bg-ui-bg-base">
                <div className="h-4 bg-ui-bg-subtle rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-ui-bg-subtle rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Text className="text-red-600">{error}</Text>
            <Button 
              variant="secondary" 
              size="small" 
              className="mt-4"
              onClick={fetchOrders}
            >
              Try Again
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Text className="text-ui-fg-subtle">No pending orders to forward.</Text>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-ui-border-base rounded-lg p-4 hover:bg-ui-bg-subtle transition-colors bg-ui-bg-base"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Text weight="plus" size="large" className="text-ui-fg-base">
                      Order #{order.display_id}
                    </Text>
                    <Text size="small" className="text-ui-fg-subtle mt-1">
                      {order.email || 'No email'} • {order.items?.length || 0} items
                    </Text>
                  </div>
                  <Badge color={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                
                {/* Order Items Preview */}
                <div className="mb-3 p-3 bg-ui-bg-subtle rounded text-sm border border-ui-border-base">
                  <Text size="small" className="font-medium mb-2 text-ui-fg-base">Items:</Text>
                  <div className="space-y-1">
                    {order.items?.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <Text size="xsmall" className="text-ui-fg-base">
                          {item.quantity}x {item.title}
                        </Text>
                        <Text size="xsmall" className="text-ui-fg-subtle font-medium">
                          {formatCurrency(item.unit_price * item.quantity, order.currency_code)}
                        </Text>
                      </div>
                    ))}
                    {order.items && order.items.length > 3 && (
                      <Text size="xsmall" className="text-ui-fg-muted italic">
                        +{order.items.length - 3} more items...
                      </Text>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-ui-border-base">
                  <div className="flex gap-4">
                    <div>
                      <Text size="xsmall" className="text-ui-fg-muted uppercase">
                        Total
                      </Text>
                      <Text weight="plus" className="text-ui-fg-base">
                        {formatCurrency(order.total, order.currency_code)}
                      </Text>
                    </div>
                    <div>
                      <Text size="xsmall" className="text-ui-fg-muted uppercase">
                        Date
                      </Text>
                      <Text size="small" className="text-ui-fg-base">
                        {order.created_at ? formatDate(order.created_at as string) : 'N/A'}
                      </Text>
                    </div>
                  </div>
                  
                  <Button
                    size="small"
                    onClick={() => handleForwardOrder(order)}
                  >
                    📤 Forward to Supplier
                  </Button>
                </div>
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

export default OrderForwarder
