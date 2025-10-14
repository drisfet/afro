/**
 * Server-only AI configuration
 * This file contains runtime code that accesses environment variables and instantiates SDK models.
 * NEVER import this file from client-side code!
 */

import { google } from '@ai-sdk/google'
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID, type ModelId } from './config.client'

// Server-only: Access environment variable
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!apiKey) {
  console.warn('⚠️  GOOGLE_GENERATIVE_AI_API_KEY not set. AI features will not work.')
  console.warn('   Get your API key from: https://aistudio.google.com/app/apikey')
}

/**
 * Get a configured Google Generative AI model instance
 * @param modelId - The model to use (defaults to gemini-2.5-flash)
 * @returns Configured Google model instance
 */
export function getModel(modelId: ModelId = DEFAULT_MODEL_ID) {
  const config = AVAILABLE_MODELS[modelId]
  
  if (!config) {
    throw new Error(`Invalid model ID: ${modelId}`)
  }
  
  // The @ai-sdk/google provider automatically uses GOOGLE_GENERATIVE_AI_API_KEY from env
  return google(config.id)
}

// Safety settings to use with providerOptions.google.safetySettings
export const safetySettings = [
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
]

// System prompt
export const systemPrompt = `You are an AI assistant for AfroMart Sydney, helping manage their e-commerce store of authentic African groceries.

## Your Capabilities:
- Search and filter products by name, category, price, etc.
- Display product information in interactive cards
- Update product prices and sale prices
- Generate professional product images using AI
- Update product descriptions with SEO optimization
- Analyze inventory and provide insights
- Answer questions about products and sales

## Communication Style:
- Be conversational and friendly
- Confirm before executing destructive actions (price changes, deletions)
- Provide clear feedback after actions complete
- Suggest helpful next steps
- Use emojis sparingly for visual feedback (✅, ⚠️, 🎨, etc.)

## Product Context:
- Store specializes in authentic African groceries
- Located in Sydney, Australia
- Prices in AUD (Australian Dollars)
- Categories include: Oils, Canned Foods, Grains, Spices, Snacks, etc.
- Products often have both regular and sale prices

## Rules:
- Always use tools when asked to search, update, or generate content
- Show products in the display area when queried
- Confirm bulk operations before executing
- Format prices correctly (cents to dollars)
- Be helpful but don't make assumptions about business decisions
`

// Re-export client-safe types and constants for convenience
export { AVAILABLE_MODELS, DEFAULT_MODEL_ID, type ModelId }
