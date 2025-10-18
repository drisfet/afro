import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Button, Text } from "@medusajs/ui"
import { AdminOrder } from "@medusajs/framework/types"
import { useEffect, useState } from "react"

const OrdersWidget = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/admin/orders?limit=20&offset=0', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`)
      }
      
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleOrderClick = (orderId: string) => {
    // Navigate to order details page
    window.location.href = `/app/orders/${orderId}`
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4 bg-ui-bg-base border-b border-ui-border-base">
        <div>
          <Heading level="h2" className="text-ui-fg-base">Custom Orders Widget</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1">
            Enhanced order display with automation capabilities
          </Text>
        </div>
        <Button 
          variant="secondary" 
          size="small"
          onClick={fetchOrders}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
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
            <Text className="text-ui-fg-subtle">No orders found.</Text>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="border border-ui-border-base rounded-lg p-4 hover:bg-ui-bg-subtle transition-colors cursor-pointer bg-ui-bg-base"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Text weight="plus" size="large" className="text-ui-fg-base">
                      Order #{order.display_id}
                    </Text>
                    <Text size="small" className="text-ui-fg-subtle">
                      {order.email || 'No email'}
                    </Text>
                  </div>
                  <Badge color={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-ui-border-base">
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
                        Items
                      </Text>
                      <Text weight="plus" className="text-ui-fg-base">
                        {order.items?.length || 0}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text size="small" className="text-ui-fg-subtle">
                      {order.created_at ? formatDate(order.created_at as string) : 'N/A'}
                    </Text>
                  </div>
                </div>

                {/* Future extension point: Action buttons */}
                {/* <div className="mt-3 pt-3 border-t flex gap-2">
                  <Button size="small" variant="secondary">
                    Process Order
                  </Button>
                  <Button size="small" variant="secondary">
                    Forward to System
                  </Button>
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Future extension points documented:
        - Add workflow trigger buttons per order
        - Integrate with external APIs for order forwarding
        - Add real-time updates via polling/WebSocket
        - Implement bulk actions
        - Add custom metadata display
        - Create filtering/search functionality
      */}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.after", // Shows below the original orders widget
})

export default OrdersWidget
