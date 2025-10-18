# AI Product Manager Widget - Architecture Specification

**Vision:** A conversational AI assistant with generative UI for natural language product management.

---

## 🎯 Concept Overview

**User Experience:**
```
┌─────────────────────────────────────────────────────────────────┐
│ 🤖 AI Product Manager                            [Minimize] [✕] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 📦 DYNAMIC DISPLAY AREA                                 │  │
│  │                                                         │  │
│  │  [Product Card: Palm Oil]  [Product Card: Plantain]   │  │
│  │  • $12.99 → $10.99 (20% off)                          │  │
│  │  • Stock: 45 units                                     │  │
│  │  • Category: Oils & Vinegar                           │  │
│  │                                                         │  │
│  │  [Edit Price] [Generate Image] [Update Description]   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 💬 CONVERSATION                                         │  │
│  │                                                         │  │
│  │ You: Show me chips products                            │  │
│  │ AI: Found 12 chips products. Displaying top 5...      │  │
│  │     [5 interactive product cards appear above ⬆️]       │  │
│  │                                                         │  │
│  │ You: Change the price of "Plantain Chips" to $8.99    │  │
│  │ AI: ✅ Updated! Price changed from $9.99 to $8.99     │  │
│  │     Sale price automatically set to $7.99 (10% off)    │  │
│  │                                                         │  │
│  │ You: Generate a new product image for it              │  │
│  │ AI: 🎨 Generating image... [Progress bar]              │  │
│  │     ✅ New image created and uploaded!                 │  │
│  │     [Preview shows in display area above ⬆️]           │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [Type your message...                    ] [Send] [🎤 Voice] │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Technical Architecture

### **Stack Selection**

#### Option A: Vercel AI SDK (Recommended)
```json
{
  "dependencies": {
    "ai": "^3.3.0",  // Vercel AI SDK with RSC
    "@ai-sdk/google": "^0.0.31",  // Gemini models
    "ai/rsc": "streaming UI components"
  }
}
```

**Pros:**
- Built-in streaming UI (`createStreamableUI`)
- Tool calling with structured outputs
- React Server Components integration
- Message history management
- Optimistic UI updates

#### Option B: Google Genkit (Alternative)
```json
{
  "dependencies": {
    "genkit": "^0.9.0",
    "@genkit-ai/googleai": "^0.9.0"
  }
}
```

**Pros:**
- More control over flows
- Better for complex workflows
- Firebase integration

**Verdict:** Use **Vercel AI SDK** for this use case (better UI streaming).

---

### **Architecture Layers**

```
┌──────────────────────────────────────────────┐
│  Frontend Widget (React Component)          │
│  - Chat Interface (useChat hook)            │
│  - Dynamic Display Area (renders UI stream) │
│  - Interactive Product Cards                │
└──────────────────────────────────────────────┘
                    ↕️ HTTP/SSE
┌──────────────────────────────────────────────┐
│  API Route (/admin/ai/chat)                 │
│  - Receives messages                         │
│  - Calls AI with tools                      │
│  - Streams responses + UI components        │
└──────────────────────────────────────────────┘
                    ↕️ Function Calls
┌──────────────────────────────────────────────┐
│  AI Tools (Function Calling)                │
│  - searchProducts(query)                    │
│  - getProductDetails(id)                    │
│  - updateProductPrice(id, price)            │
│  - generateProductImage(id)                 │
│  - updateDescription(id, description)       │
└──────────────────────────────────────────────┘
                    ↕️ Database
┌──────────────────────────────────────────────┐
│  Medusa Database                            │
│  - Products, variants, prices               │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Implementation Plan

### **Phase 1: Setup AI SDK**

**Install dependencies:**
```bash
cd /workspaces/afro/afro-store
yarn add ai @ai-sdk/google zod
```

**Configure Gemini API:**
```typescript
// src/lib/ai/config.ts
import { google } from '@ai-sdk/google'

export const aiModel = google('gemini-1.5-flash', {
  safetySettings: [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  ],
})
```

---

### **Phase 2: Create AI Tools**

**Define product management tools:**
```typescript
// src/lib/ai/tools.ts
import { tool } from 'ai'
import { z } from 'zod'

export const searchProductsTool = tool({
  description: 'Search for products by name, category, or description',
  parameters: z.object({
    query: z.string().describe('Search query (e.g., "chips", "palm oil")'),
    limit: z.number().optional().default(10),
  }),
  execute: async ({ query, limit }) => {
    const products = await searchProducts(query, limit)
    return {
      count: products.length,
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.variants[0]?.prices[0]?.amount,
        stock: p.variants[0]?.inventory_quantity,
        image: p.thumbnail,
      })),
    }
  },
})

export const updateProductPriceTool = tool({
  description: 'Update the price of a product',
  parameters: z.object({
    productId: z.string(),
    newPrice: z.number().describe('New price in cents (e.g., 899 for $8.99)'),
  }),
  execute: async ({ productId, newPrice }) => {
    const updated = await updateProductPrice(productId, newPrice)
    return {
      success: true,
      productId,
      oldPrice: updated.oldPrice,
      newPrice,
      message: `Price updated from $${updated.oldPrice/100} to $${newPrice/100}`,
    }
  },
})

export const generateProductImageTool = tool({
  description: 'Generate a new product image using AI',
  parameters: z.object({
    productId: z.string(),
    prompt: z.string().optional(),
  }),
  execute: async ({ productId, prompt }) => {
    const product = await getProduct(productId)
    const generatedPrompt = prompt || `Professional product photo of ${product.title}, African grocery item, clean white background, high resolution`
    
    // Use Imagen or similar
    const imageUrl = await generateImage(generatedPrompt)
    await updateProductImage(productId, imageUrl)
    
    return {
      success: true,
      imageUrl,
      message: 'New image generated and uploaded!',
    }
  },
})

export const tools = {
  searchProducts: searchProductsTool,
  updatePrice: updateProductPriceTool,
  generateImage: generateProductImageTool,
  // Add more tools...
}
```

---

### **Phase 3: Create API Route**

**Streaming chat endpoint:**
```typescript
// src/api/admin/ai/chat/route.ts
import { streamText } from 'ai'
import { aiModel } from '../../../../lib/ai/config'
import { tools } from '../../../../lib/ai/tools'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: aiModel,
    messages,
    tools,
    system: `You are an AI assistant for AfroMart Sydney's product management system.
    
    You help merchants:
    - Find and filter products
    - Update prices and sale prices
    - Generate product images and descriptions
    - Manage inventory
    - Analyze product performance
    
    When asked to show products, use the searchProducts tool.
    When asked to update something, use the appropriate tool.
    Always confirm actions before executing mutations.
    
    Be conversational, helpful, and precise.`,
    maxSteps: 5, // Allow multiple tool calls
  })

  return result.toDataStreamResponse()
}
```

---

### **Phase 4: Build Widget UI**

**Main widget component:**
```typescript
// src/admin/widgets/ai-product-manager.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"
import { useChat } from 'ai/react'
import { useState } from 'react'
import { ProductCard } from './components/ProductCard'
import { ChatInterface } from './components/ChatInterface'
import { DynamicDisplay } from './components/DynamicDisplay'

const AIProductManager = () => {
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [isMinimized, setIsMinimized] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/admin/ai/chat',
    onFinish: (message) => {
      // Parse tool results and update display
      const toolResults = extractToolResults(message)
      if (toolResults.products) {
        setDisplayedProducts(toolResults.products)
      }
    },
  })

  return (
    <Container className="fixed bottom-4 right-4 w-[800px] h-[600px] shadow-2xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="flex items-center gap-2 text-white">
          <span className="text-2xl">🤖</span>
          <Heading level="h3" className="text-white">AI Product Manager</Heading>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
          <button>✕</button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-[calc(100%-64px)]">
          {/* Dynamic Display Area */}
          <DynamicDisplay products={displayedProducts} />

          {/* Chat Interface */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message... (e.g., 'Show me chips products')"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                Send
              </button>
              <button type="button" className="px-4 py-2 border rounded-lg">
                🎤
              </button>
            </div>
          </form>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default AIProductManager
```

---

### **Phase 5: Dynamic Display Components**

**Interactive product cards:**
```typescript
// src/admin/widgets/components/ProductCard.tsx
export const ProductCard = ({ product, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <img src={product.image} alt={product.title} className="w-full h-32 object-cover rounded" />
      
      <h3 className="font-bold mt-2">{product.title}</h3>
      
      {isEditing ? (
        <input
          type="number"
          defaultValue={product.price / 100}
          onBlur={(e) => {
            onUpdate(product.id, { price: parseFloat(e.target.value) * 100 })
            setIsEditing(false)
          }}
          className="w-full px-2 py-1 border rounded"
        />
      ) : (
        <p className="text-lg font-bold text-orange-600">
          ${(product.price / 100).toFixed(2)}
        </p>
      )}
      
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 text-sm bg-blue-100 rounded hover:bg-blue-200"
        >
          Edit Price
        </button>
        <button
          onClick={() => onUpdate(product.id, { generateImage: true })}
          className="px-3 py-1 text-sm bg-purple-100 rounded hover:bg-purple-200"
        >
          Generate Image
        </button>
      </div>
    </div>
  )
}
```

**Dynamic display area:**
```typescript
// src/admin/widgets/components/DynamicDisplay.tsx
export const DynamicDisplay = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 border-b">
        <p>Ask me to show products, and they'll appear here! ✨</p>
      </div>
    )
  }
  
  return (
    <div className="p-4 border-b bg-white max-h-[250px] overflow-y-auto">
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

---

## 🎯 Example Interactions

### **1. Product Search**
```
User: "Show me all chips products"

AI: "Found 12 chips products in your catalog. Displaying top 10..."
[10 product cards appear in display area]
```

### **2. Price Update**
```
User: "Change the price of Plantain Chips to $8.99"

AI: "✅ Updated! 
- Old price: $9.99
- New price: $8.99
- Sale price automatically set to $7.99 (10% off)"

[Product card updates in real-time]
```

### **3. Image Generation**
```
User: "Generate a new image for Palm Oil"

AI: "🎨 Generating professional product photo..."
[Progress indicator]
AI: "✅ Complete! New image uploaded and set as primary."

[Product card shows new image]
```

### **4. Bulk Operations**
```
User: "Show me all products under $5"

AI: "Found 23 products under $5. Here are the top 10..."
[Cards displayed]

User: "Increase all of them by 10%"

AI: "⚠️ This will update 23 products. Confirm?"

User: "Yes"

AI: "✅ Updated 23 products! Average price: $4.85 → $5.34"
[All cards update with new prices]
```

### **5. Smart Suggestions**
```
User: "Which products need better descriptions?"

AI: "I found 15 products with short descriptions (< 50 chars):
- Palm Oil (12 chars)
- Fufu Flour (8 chars)
- Plantain Chips (15 chars)
...

Would you like me to generate descriptions for them?"

User: "Yes, generate for the first 5"

AI: "🤖 Generating optimized descriptions..."
[Progress bar]
AI: "✅ Done! Updated 5 products with SEO-friendly descriptions."
```

---

## 🚀 Advanced Features

### **Voice Input**
```typescript
const { startRecording, stopRecording } = useSpeechRecognition({
  onResult: (transcript) => {
    setInput(transcript)
  },
})
```

### **Streaming UI Components**
```typescript
// In API route
import { createStreamableUI } from 'ai/rsc'

const ui = createStreamableUI()

// Stream product cards as they load
for (const product of products) {
  ui.append(<ProductCard product={product} />)
}

return ui.value
```

### **Memory/Context**
```typescript
// Store conversation context
const systemPrompt = `
Previous actions in this session:
- Updated 5 product prices
- Generated 2 images
- Current focus: Chips category

Continue helping the merchant...
`
```

---

## 📦 File Structure
```
afro-store/src/
├── admin/
│   └── widgets/
│       ├── ai-product-manager.tsx       # Main widget
│       └── components/
│           ├── ChatInterface.tsx
│           ├── DynamicDisplay.tsx
│           ├── ProductCard.tsx
│           └── LoadingIndicator.tsx
├── api/
│   └── admin/
│       └── ai/
│           └── chat/
│               └── route.ts             # Streaming API
└── lib/
    └── ai/
        ├── config.ts                     # AI model setup
        ├── tools.ts                      # Function tools
        └── helpers.ts                    # Utilities
```

---

## ✅ Success Criteria

1. ✅ Natural language product queries work
2. ✅ Products display in interactive cards
3. ✅ Real-time price updates
4. ✅ AI image generation functional
5. ✅ Streaming responses smooth
6. ✅ Tool calling executes correctly
7. ✅ Conversation context maintained
8. ✅ Error handling graceful
9. ✅ UI responsive and modern

---

## 🎯 Next Steps

Ready to implement this? I'll build it phase by phase:

1. **Phase 1:** Install AI SDK + configure Gemini
2. **Phase 2:** Create product management tools
3. **Phase 3:** Build streaming API route
4. **Phase 4:** Create widget UI
5. **Phase 5:** Test and polish

**Shall we start with Phase 1?** 🚀
