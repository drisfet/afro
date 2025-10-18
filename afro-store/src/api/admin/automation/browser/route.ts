/**
 * Browser Automation API Route
 * 
 * Provides endpoints for automated order placement on supplier website.
 * Uses stealth browser with anti-detection features.
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BrowserAutomationService } from "../../../../lib/automation/browser-service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = req.body as any
  const { action, orderId, supplierUrl = 'https://howtfoods.com.au' } = body

  console.log(`[Automation API] Received request - Action: ${action}, Order: ${orderId}`)

  try {
    switch (action) {
      case 'open-browser':
        return await handleOpenBrowser(req, res, supplierUrl)
      
      case 'get-session-info':
        return await handleGetSessionInfo(req, res)
      
      case 'take-screenshot':
        return await handleTakeScreenshot(req, res)
      
      default:
        return res.status(400).json({ 
          error: 'Invalid action. Supported: open-browser, get-session-info, take-screenshot' 
        })
    }
  } catch (error) {
    console.error('[Automation API] Error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}

/**
 * Open stealth browser and navigate to supplier
 */
async function handleOpenBrowser(req: MedusaRequest, res: MedusaResponse, supplierUrl: string) {
  const service = new BrowserAutomationService()
  
  // Simple retry logic (3 attempts)
  let attempts = 0
  const maxAttempts = 3
  
  while (attempts < maxAttempts) {
    try {
      await service.createStealthBrowser({ 
        headless: false, 
        supplierUrl 
      })
      await service.navigateToSupplier(supplierUrl)
      break // Success
    } catch (error) {
      attempts++
      console.log(`[Automation API] Attempt ${attempts} failed. Retries left: ${maxAttempts - attempts}`)
      
      if (attempts >= maxAttempts) {
        throw error // Max retries reached
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  const fingerprint = service.generateFingerprint()

  return res.json({
    success: true,
    message: 'Browser opened successfully',
    session: {
      id: fingerprint.sessionId,
      userAgent: fingerprint.userAgent,
      viewport: fingerprint.viewport,
      location: 'Sydney, Australia'
    }
  })
}

/**
 * Get current session information
 */
async function handleGetSessionInfo(req: MedusaRequest, res: MedusaResponse) {
  const service = new BrowserAutomationService()
  const fingerprint = service.generateFingerprint()

  return res.json({
    session: {
      id: fingerprint.sessionId,
      userAgent: fingerprint.userAgent,
      viewport: fingerprint.viewport,
      locale: fingerprint.locale,
      timezone: fingerprint.timezone,
      geolocation: fingerprint.geolocation
    }
  })
}

/**
 * Take screenshot of current page
 */
async function handleTakeScreenshot(req: MedusaRequest, res: MedusaResponse) {
  const service = new BrowserAutomationService()
  const filename = `order-confirmation-${Date.now()}.png`
  
  try {
    await service.takeScreenshot(filename)
    return res.json({
      success: true,
      filename,
      path: `/screenshots/${filename}`
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to take screenshot',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
