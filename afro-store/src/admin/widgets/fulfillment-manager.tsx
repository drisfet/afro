/**
 * Order Fulfillment Manager Widget
 * 
 * Marks orders as fulfilled and sends confirmation emails to customers.
 * Use after successfully placing order with supplier.
 */

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Text, Textarea, Label, Input } from "@medusajs/ui"
import { AdminOrder } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
import { orderForwardingState } from "./order-forwarder"

const FulfillmentManager = () => {
  const [currentOrder, setCurrentOrder] = useState<AdminOrder | null>(null)
  const [isMinimized, setIsMinimized] = useState(true)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingProvider, setTrackingProvider] = useState('australia-post')
  const [customerNote, setCustomerNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Listen for orders from the forwarder widget
  useEffect(() => {
    const unsubscribe = orderForwardingState.subscribe((order) => {
      if (order) {
        setCurrentOrder(order)
        // Pre-fill customer note
        setCustomerNote(`Your order #${order.display_id} has been forwarded to our fulfillment partner and will be shipped shortly.`)
      }
    })
    
    return unsubscribe
  }, [])

  const handleMarkFulfilled = async () => {
    if (!currentOrder) return
    
    setIsProcessing(true)
    setSuccessMessage('')
    
    try {
      // Create fulfillment
      const fulfillmentResponse = await fetch(`/admin/orders/${currentOrder.id}/fulfillments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: currentOrder.items?.map((item: any) => ({
            id: item.id,
            quantity: item.quantity
          })),
          no_notification: false, // Send customer notification
          metadata: {
            tracking_number: trackingNumber || undefined,
            tracking_provider: trackingProvider || undefined,
            fulfillment_note: customerNote || undefined,
            forwarded_to_supplier: true,
            forwarded_at: new Date().toISOString()
          }
        })
      })
      
      if (!fulfillmentResponse.ok) {
        const errorData = await fulfillmentResponse.json()
        throw new Error(errorData.message || 'Failed to create fulfillment')
      }
      
      // If tracking number provided, add it to the order
      if (trackingNumber) {
        await fetch(`/admin/orders/${currentOrder.id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metadata: {
              ...currentOrder.metadata,
              tracking_number: trackingNumber,
              tracking_provider: trackingProvider
            }
          })
        })
      }
      
      setSuccessMessage(`✅ Order #${currentOrder.display_id} marked as fulfilled! Customer has been notified.`)
      
      // Clear form after 3 seconds
      setTimeout(() => {
        setCurrentOrder(null)
        setTrackingNumber('')
        setCustomerNote('')
        setSuccessMessage('')
        setIsMinimized(true)
      }, 3000)
      
    } catch (error) {
      console.error('Fulfillment error:', error)
      alert(`Failed to fulfill order: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number, currencyCode: string = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount)
  }

  if (!currentOrder || isMinimized) {
    return null
  }

  return (
    <Container
      className="fixed bottom-4 right-4 w-[600px] shadow-2xl z-50 flex flex-col divide-y bg-ui-bg-base border border-ui-border-base rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h3">Fulfill Order #{currentOrder.display_id}</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1">
            Mark as fulfilled and notify customer
          </Text>
        </div>
        <Button
          variant="transparent"
          size="small"
          onClick={() => setIsMinimized(true)}
        >
          ✕
        </Button>
      </div>

      {/* Form */}
      <div className="px-6 py-4 space-y-4">
        {successMessage ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <Text className="text-green-700 font-medium">{successMessage}</Text>
          </div>
        ) : (
          <>
            {/* Order Summary */}
            <div className="bg-ui-bg-subtle rounded-lg p-4 border border-ui-border-base">
              <Text size="small" weight="plus" className="mb-2 text-ui-fg-base">Order Summary</Text>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <Text size="small" className="text-ui-fg-subtle">Customer:</Text>
                  <Text size="small" className="text-ui-fg-base">{currentOrder.email}</Text>
                </div>
                <div className="flex justify-between">
                  <Text size="small" className="text-ui-fg-subtle">Items:</Text>
                  <Text size="small" className="text-ui-fg-base">{currentOrder.items?.length || 0}</Text>
                </div>
                <div className="flex justify-between">
                  <Text size="small" className="text-ui-fg-subtle">Total:</Text>
                  <Text size="small" weight="plus" className="text-ui-fg-base">
                    {formatCurrency(currentOrder.total, currentOrder.currency_code)}
                  </Text>
                </div>
              </div>
            </div>

            {/* Tracking Information (Optional) */}
            <div>
              <Label className="mb-2">Tracking Number (Optional)</Label>
              <Input
                placeholder="Enter tracking number if available"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2">Shipping Provider</Label>
              <select
                value={trackingProvider}
                onChange={(e) => setTrackingProvider(e.target.value)}
                className="w-full px-3 py-2 border border-ui-border-base rounded bg-ui-bg-base text-ui-fg-base"
              >
                <option value="australia-post">Australia Post</option>
                <option value="fastway">Fastway</option>
                <option value="dhl">DHL</option>
                <option value="fedex">FedEx</option>
                <option value="ups">UPS</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Customer Note */}
            <div>
              <Label className="mb-2">Customer Notification Message</Label>
              <Textarea
                placeholder="Message to send to customer..."
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                rows={4}
              />
              <Text size="xsmall" className="text-ui-fg-subtle mt-1">
                This message will be included in the fulfillment notification email
              </Text>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleMarkFulfilled}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? '⏳ Processing...' : '✅ Mark as Fulfilled & Notify Customer'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsMinimized(true)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Text size="xsmall" className="text-blue-900">
                <strong>ℹ️ What happens next:</strong>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>Order status will be updated to "fulfilled"</li>
                  <li>Customer will receive email notification</li>
                  <li>Tracking info will be added if provided</li>
                  <li>Order will move to "completed" section</li>
                </ul>
              </Text>
            </div>
          </>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after", // Shows on order details page
})

export default FulfillmentManager
