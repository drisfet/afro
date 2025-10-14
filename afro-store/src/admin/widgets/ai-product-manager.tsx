import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Input, Text, Label } from "@medusajs/ui"
import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { TextStreamChatTransport } from "ai"
import type { Product } from "../../lib/ai/tools"
import { DynamicDisplay } from "./components/DynamicDisplay"
import { ChatMessage } from "./components/ChatMessage"
import { searchProducts } from "../../lib/ai/tools"
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID, type ModelId } from '../../lib/ai/config.client'

const AIProductManager = () => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState("")
  const [selectedModel, setSelectedModel] = useState<ModelId>(DEFAULT_MODEL_ID)
  
  // Use official useChat hook with TextStreamChatTransport for plain text streaming
  const {
    messages,
    sendMessage,
    status,
  } = useChat({
    transport: new TextStreamChatTransport({
      api: '/admin/ai/chat',
      body: {
        modelId: selectedModel,
      },
    }),
    onFinish: async ({ message }) => {
      // Extract product queries from completed responses
      const content = message.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join(' ')
        .toLowerCase()
      
      if (content.includes('show') || content.includes('find') || content.includes('search')) {
        const query = extractQuery(content)
        if (query) {
          const result = await searchProducts(query, 8)
          setDisplayedProducts(result.products)
        }
      }
    },
    onError: (error) => {
      console.error('AI chat error:', error)
    }
  })
  
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const extractQuery = (text: string): string | null => {
    // Simple extraction - matches words after "show", "find", "search"
    const patterns = [
      /show\s+(?:me\s+)?(.+?)(?:\s+products?)?$/i,
      /find\s+(.+?)(?:\s+products?)?$/i,
      /search\s+(?:for\s+)?(.+?)(?:\s+products?)?$/i,
    ]
    
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }
    return null
  }

  const handleExampleQuery = async (query: string) => {
    // Use sendMessage from the SDK
    sendMessage({ text: query })
    const result = await searchProducts(query, 8)
    setDisplayedProducts(result.products)
  }

  const handleProductClick = async (product: Product) => {
    const query = `Tell me about ${product.title}`
    sendMessage({ text: query })
  }

  const isLoading = status === 'submitted' || status === 'streaming'

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          variant="primary"
          size="large"
        >
          🤖 AI Product Manager
        </Button>
      </div>
    )
  }

  return (
    <Container
      className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4 w-[900px] h-[650px]'} shadow-2xl z-50 flex flex-col divide-y bg-ui-bg-base border border-ui-border-base rounded-lg overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <Heading level="h3">AI Product Manager</Heading>
            <Text size="small" className="text-ui-fg-subtle mt-1">
              Ask me anything about your products
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <Label className="text-xs text-ui-fg-muted">Model:</Label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelId)}
              className="px-2 py-1 text-xs border border-ui-border-base rounded bg-ui-bg-base text-ui-fg-base"
            >
              {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
                <option key={key} value={key}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="transparent"
              size="small"
            >
              {isExpanded ? '⬇️' : '⬆️'}
            </Button>
            <Button
              onClick={() => setIsMinimized(true)}
              variant="transparent"
              size="small"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Display Area */}
      <DynamicDisplay
        products={displayedProducts}
        onProductClick={handleProductClick}
      />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-ui-bg-subtle">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Text className="text-ui-fg-muted mb-4">
              Hi! I'm your AI assistant. I can help you manage products.
            </Text>
            <Text size="small" className="text-ui-fg-subtle mb-4">
              Using: {AVAILABLE_MODELS[selectedModel].name}
            </Text>
            <div className="flex flex-wrap gap-2 justify-center">
              {['chips', 'palm oil', 'fufu'].map(query => (
                <Button
                  key={query}
                  size="small"
                  variant="secondary"
                  onClick={() => handleExampleQuery(query)}
                >
                  Show me {query}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              // Extract text content from message parts (SDK format)
              const textContent = message.parts
                .filter((part: any) => part.type === 'text')
                .map((part: any) => part.text)
                .join(' ')
              
              return (
                <ChatMessage
                  key={message.id}
                  role={message.role as 'user' | 'assistant'}
                  content={textContent}
                />
              )
            })}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-ui-bg-base rounded-lg px-4 py-2 border border-ui-border-base">
                  <Text size="small" className="text-ui-fg-muted">Thinking...</Text>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) {
            sendMessage({ text: input })
            setInput("")
          }
        }}
        className="px-6 py-4 bg-ui-bg-base"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message... (e.g., 'Show me chips products')"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            variant="primary"
          >
            Send
          </Button>
        </div>
      </form>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default AIProductManager
