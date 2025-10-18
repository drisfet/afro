// Dynamic Display Area Component

import { Text } from "@medusajs/ui"
import type { Product } from "../../../lib/ai/tools"
import { ProductCard } from "./ProductCard"

interface DynamicDisplayProps {
  products: Product[]
  onProductClick?: (product: Product) => void
}

export const DynamicDisplay = ({ products, onProductClick }: DynamicDisplayProps) => {
  if (products.length === 0) {
    return (
      <div className="p-8 text-center bg-ui-bg-subtle border-b border-ui-border-base">
        <div className="text-4xl mb-2">✨</div>
        <Text className="text-ui-fg-muted">
          Ask me to show products, and they'll appear here!
        </Text>
        <Text size="small" className="text-ui-fg-subtle mt-1">
          Try: "Show me chips products" or "Find palm oil"
        </Text>
      </div>
    )
  }

  return (
    <div className="px-6 py-4 border-b border-ui-border-base bg-ui-bg-base max-h-[280px] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <Text size="small" className="text-ui-fg-muted">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </Text>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
          />
        ))}
      </div>
    </div>
  )
}