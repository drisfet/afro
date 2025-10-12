"use client"

import { HttpTypes } from "@medusajs/types"
import { ShoppingCart, Plus } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import PreviewPrice from "./price"
import { VariantPrice } from "@/types/global"

interface EnhancedProductPreviewProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isFeatured?: boolean
  cheapestPrice: VariantPrice | null
}

export default function EnhancedProductPreview({
  product,
  region,
  isFeatured,
  cheapestPrice,
}: EnhancedProductPreviewProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  // Determine if product is new (created within last 30 days)
  const isNew = product.created_at
    ? new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    : false

  // Determine if product is on sale
  const isOnSale = cheapestPrice?.price_type === "sale"

  // Calculate discount percentage
  const discountPercentage = isOnSale && cheapestPrice?.percentage_diff
    ? Math.abs(parseInt(cheapestPrice.percentage_diff))
    : null

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)

    try {
      // TODO: Implement actual cart add logic with MedusaJS
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group relative">
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="block"
      >
        <div className="relative" data-testid="product-wrapper">
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {isNew && (
              <Badge variant="info" className="shadow-md">
                NEW
              </Badge>
            )}
            {isOnSale && discountPercentage && (
              <Badge variant="destructive" className="bg-red-500 text-white shadow-md">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Product Image */}
          <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-3">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
            />
            
            {/* Quick Add Button - Shows on hover (desktop) or always (mobile) */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent",
                "translate-y-full group-hover:translate-y-0 transition-transform duration-200",
                "md:opacity-0 md:group-hover:opacity-100"
              )}
            >
              <Button
                onClick={handleQuickAdd}
                disabled={isAdding}
                className="w-full h-10 bg-white hover:bg-gray-100 text-gray-900 font-medium shadow-lg"
                size="sm"
              >
                {isAdding ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h3
              className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors"
              data-testid="product-title"
            >
              {product.title}
            </h3>

            {/* Price Display */}
            <div className="flex items-baseline gap-2">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </LocalizedClientLink>

      {/* Mobile Quick Add Button (Below card) */}
      <div className="mt-2 md:hidden">
        <Button
          onClick={handleQuickAdd}
          disabled={isAdding}
          variant="outline"
          className="w-full h-10 border-orange-500 text-orange-600 hover:bg-orange-50"
          size="sm"
        >
          {isAdding ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
