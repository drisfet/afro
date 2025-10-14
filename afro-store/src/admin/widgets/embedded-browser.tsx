/**
 * Embedded Browser Widget
 * 
 * Displays supplier website in iframe for manual order placement.
 * Includes advanced anti-detection features for normal user appearance.
 * Each session appears as a fresh, independent visitor.
 */

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Text, Badge } from "@medusajs/ui"
import { AdminOrder } from "@medusajs/framework/types"
import { useEffect, useState, useRef } from "react"
import { orderForwardingState } from "./order-forwarder"

// Generate unique session ID for each widget instance
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const EmbeddedBrowserWidget = () => {
  const [currentOrder, setCurrentOrder] = useState<AdminOrder | null>(null)
  const [isMinimized, setIsMinimized] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [iframeUrl, setIframeUrl] = useState('')
  const [sessionId, setSessionId] = useState(() => generateSessionId())
  const [automationStatus, setAutomationStatus] = useState<string>('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Create fresh iframe URL with cache-busting and session parameters
  const createFreshUrl = (baseUrl: string) => {
    const url = new URL(baseUrl)
    
    // Add cache-busting parameters to appear as fresh visitor
    url.searchParams.set('_t', Date.now().toString())
    url.searchParams.set('_sid', sessionId)
    
    return url.toString()
  }

  // Listen for orders from the forwarder widget
  useEffect(() => {
    const unsubscribe = orderForwardingState.subscribe((order) => {
      if (order) {
        setCurrentOrder(order)
        setIsMinimized(false)
        
        // Create fresh session ID for each new order
        const newSessionId = generateSessionId()
        setSessionId(newSessionId)
        
        // Load supplier URL with fresh session parameters
        const savedUrl = localStorage.getItem('supplier_url') || 'https://howtfoods.com.au'
        const freshUrl = createFreshUrl(savedUrl)
        setIframeUrl(freshUrl)
      }
    })

    return unsubscribe
  }, [sessionId])

  // Initialize iframe URL from localStorage
  useEffect(() => {
    const savedUrl = localStorage.getItem('supplier_url') || 'https://howtfoods.com.au'
    if (savedUrl && !iframeUrl) {
      setIframeUrl(createFreshUrl(savedUrl))
    }
  }, [])

  const handleReload = () => {
    // Reload with fresh session ID to appear as new visitor
    const newSessionId = generateSessionId()
    setSessionId(newSessionId)
    
    const savedUrl = localStorage.getItem('supplier_url') || 'https://howtfoods.com.au'
    const freshUrl = createFreshUrl(savedUrl)
    setIframeUrl(freshUrl)
  }

  const handleGoBack = () => {
    // Try to send back navigation message to iframe
    try {
      iframeRef.current?.contentWindow?.history.back()
    } catch (e) {
      console.warn('Cannot control iframe navigation (cross-origin)')
    }
  }

  const handleOpenAutomatedBrowser = async () => {
    if (!currentOrder) return
    
    setAutomationStatus('🔄 Opening stealth browser...')
    
    try {
      const response = await fetch('/admin/automation/browser', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'open-browser',
          orderId: currentOrder.id,
          supplierUrl: localStorage.getItem('supplier_url') || 'https://howtfoods.com.au'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAutomationStatus(`✅ Browser opened with session: ${data.session.id.slice(-8)}`)
        setSessionId(data.session.id)
        console.log('[Embedded Browser] Automation session:', data.session)
      } else {
        setAutomationStatus('❌ Failed to open browser')
      }
    } catch (error) {
      console.error('[Embedded Browser] Automation error:', error)
      setAutomationStatus('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown'))
    }
  }

  const handleCopyOrderDetails = () => {
    if (!currentOrder) return
    
    const orderText = `
Order #${currentOrder.display_id}
Customer: ${currentOrder.email}
Total: ${formatCurrency(currentOrder.total, currentOrder.currency_code)}

Items:
${currentOrder.items?.map((item: any) => 
  `- ${item.quantity}x ${item.title} (${item.variant?.sku || 'N/A'})`
).join('\n')}

Shipping Address:
${currentOrder.shipping_address?.first_name} ${currentOrder.shipping_address?.last_name}
${currentOrder.shipping_address?.address_1}
${currentOrder.shipping_address?.address_2 || ''}
${currentOrder.shipping_address?.city}, ${currentOrder.shipping_address?.province} ${currentOrder.shipping_address?.postal_code}
${currentOrder.shipping_address?.country_code?.toUpperCase()}
Phone: ${currentOrder.shipping_address?.phone || 'N/A'}
`.trim()
    
    navigator.clipboard.writeText(orderText)
    alert('Order details copied to clipboard!')
  }

  const formatCurrency = (amount: number, currencyCode: string = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount)
  }

  if (isMinimized && !currentOrder) {
    return null // Don't show anything if no order is selected
  }

  if (isMinimized && currentOrder) {
    return (
      <div className="fixed bottom-0 right-20 z-50">
        <div 
          onClick={() => setIsMinimized(false)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-t-lg shadow-lg px-4 py-2 cursor-pointer transition-all duration-200 flex items-center gap-2 border-t-2 border-x-2 border-orange-600"
        >
          <span className="text-lg">🌐</span>
          <div className="flex flex-col">
            <Text size="xsmall" weight="plus" className="text-white leading-tight">
              Browser: Order #{currentOrder.display_id}
            </Text>
            <Text size="xsmall" className="text-orange-100 leading-tight">
              {currentOrder.items?.length || 0} items • Click to expand
            </Text>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container
      className={`fixed ${
        isFullscreen 
          ? 'inset-0' 
          : 'top-4 right-4 w-[1000px] h-[800px]'
      } shadow-2xl z-[100] flex flex-col bg-ui-bg-base border border-ui-border-base rounded-lg overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ui-border-base bg-ui-bg-subtle">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌐</span>
          <div>
            <Heading level="h3">Supplier Browser</Heading>
            {currentOrder && (
              <Text size="small" className="text-ui-fg-subtle">
                Forwarding Order #{currentOrder.display_id} • {currentOrder.items?.length || 0} items • {formatCurrency(currentOrder.total, currentOrder.currency_code)}
              </Text>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="transparent"
            size="small"
            onClick={handleGoBack}
            title="Go Back"
          >
            ◀️
          </Button>
          <Button
            variant="transparent"
            size="small"
            onClick={handleReload}
            title="Reload with fresh session"
          >
            🔄
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={handleOpenAutomatedBrowser}
            title="Open automated stealth browser"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            🤖 Auto
          </Button>
          <Button
            variant="transparent"
            size="small"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? '⬇️' : '⬆️'}
          </Button>
          <Button
            variant="transparent"
            size="small"
            onClick={() => setIsMinimized(true)}
            title="Minimize"
          >
            ➖
          </Button>
        </div>
      </div>

      {/* Order Details Sidebar */}
      {currentOrder && (
        <div className="px-4 py-3 bg-ui-bg-subtle border-b border-ui-border-base">
          <div className="flex justify-between items-start">
            <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
              <div>
                <Text size="xsmall" className="text-ui-fg-muted uppercase font-medium mb-1">
                  Customer
                </Text>
                <Text size="small" className="text-ui-fg-base">{currentOrder.email}</Text>
                <Text size="xsmall" className="text-ui-fg-subtle mt-1">
                  {currentOrder.shipping_address?.first_name} {currentOrder.shipping_address?.last_name}
                </Text>
              </div>
              <div>
                <Text size="xsmall" className="text-ui-fg-muted uppercase font-medium mb-1">
                  Shipping To
                </Text>
                <Text size="xsmall" className="leading-relaxed text-ui-fg-base">
                  {currentOrder.shipping_address?.address_1}<br />
                  {currentOrder.shipping_address?.city}, {currentOrder.shipping_address?.province} {currentOrder.shipping_address?.postal_code}
                </Text>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="small"
                variant="secondary"
                onClick={handleCopyOrderDetails}
              >
                📋 Copy Details
              </Button>
              <Button
                size="small"
                onClick={() => {
                  // Open order details in new tab
                  window.open(`/app/orders/${currentOrder.id}`, '_blank')
                }}
              >
                📄 View Full Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Browser/iframe Container */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {iframeUrl ? (
          <>
            {/* Enhanced privacy iframe - appears as normal user */}
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              className="w-full h-full border-0"
              title="Supplier Store Browser"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
              referrerPolicy="no-referrer"
              allow="geolocation; microphone; camera"
              loading="eager"
            />
            
            {/* Subtle session indicator - top right corner */}
            <div className="absolute top-2 right-2 pointer-events-none">
              <Badge color="grey" size="xsmall" className="opacity-60 text-xs">
                🔒 {sessionId.slice(-6)}
              </Badge>
              {automationStatus && (
                <Badge 
                  color={automationStatus.includes('✅') ? 'green' : automationStatus.includes('❌') ? 'red' : 'blue'} 
                  size="small"
                  className="block mt-1"
                >
                  {automationStatus}
                </Badge>
              )}
            </div>
            
            {/* Subtle privacy hint - auto-fades */}
            <div className="absolute bottom-3 left-4 right-4 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="bg-ui-bg-base/90 backdrop-blur-sm border border-ui-border-base rounded-md px-3 py-2 shadow-sm max-w-md">
                <Text size="xsmall" className="text-ui-fg-subtle">
                  <span className="text-orange-600">🔒</span> Privacy mode active • Fresh session per order • Click <strong>Copy Details</strong> above to paste order info
                </Text>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Text className="text-ui-fg-subtle mb-4">
                No supplier URL configured. Go to Order Forwarder to set it up.
              </Text>
              <Button onClick={() => setIsMinimized(true)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Items List at Bottom */}
      {currentOrder && currentOrder.items && (
        <div className="border-t border-ui-border-base bg-ui-bg-subtle px-4 py-3 max-h-48 overflow-y-auto">
          <Text size="small" weight="plus" className="mb-2 text-ui-fg-base">Order Items:</Text>
          <div className="space-y-1">
            {currentOrder.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-sm py-1">
                <div className="flex-1">
                  <Text size="small" className="text-ui-fg-base">
                    <Badge size="small" className="mr-2">{item.quantity}x</Badge>
                    {item.title}
                  </Text>
                  {item.variant?.sku && (
                    <Text size="xsmall" className="text-ui-fg-subtle ml-12">
                      SKU: {item.variant.sku}
                    </Text>
                  )}
                </div>
                <Text size="small" className="text-ui-fg-subtle font-medium">
                  {formatCurrency(item.unit_price * item.quantity, currentOrder.currency_code)}
                </Text>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.after", // Appears after the order list
})

export default EmbeddedBrowserWidget
