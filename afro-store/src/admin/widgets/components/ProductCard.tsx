// Product Card Component

import { Badge, Text } from "@medusajs/ui"
import type { Product } from "../../../lib/ai/tools"

interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const hasSale = product.salePrice && product.salePrice < product.price

  return (
    <div
      onClick={() => onClick?.(product)}
      className="border border-ui-border-base rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer bg-ui-bg-base"
    >
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-24 object-cover rounded mb-2"
        />
      )}

      <Text weight="plus" size="small" className="line-clamp-2 mb-1 text-ui-fg-base">
        {product.title}
      </Text>

      <div className="flex items-center gap-2 mb-2">
        {hasSale ? (
          <>
            <Text size="large" weight="plus" className="text-ui-fg-interactive">
              ${((product.salePrice || 0) / 100).toFixed(2)}
            </Text>
            <Text size="small" className="line-through text-ui-fg-muted">
              ${(product.price / 100).toFixed(2)}
            </Text>
          </>
        ) : (
          <Text size="large" weight="plus" className="text-ui-fg-base">
            ${(product.price / 100).toFixed(2)}
          </Text>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Text size="xsmall" className="text-ui-fg-muted">
          Stock: {product.stock}
        </Text>
        {product.categories.length > 0 && (
          <Badge size="xsmall" color="grey">
            {product.categories[0]}
          </Badge>
        )}
      </div>
    </div>
  )
}