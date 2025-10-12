"use client"

import { useState, useTransition } from "react"
import { HttpTypes } from "@medusajs/types"
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

interface CartDrawerProps {
  cart: HttpTypes.StoreCart | null
  children?: React.ReactNode
}

export default function CartDrawer({ cart, children }: CartDrawerProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const itemCount = cart?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0
  const subtotal = cart?.items?.reduce(
    (acc, item) => acc + (item.total || 0),
    0
  ) || 0

  const handleUpdateQuantity = (lineId: string, quantity: number) => {
    startTransition(async () => {
      try {
        await updateLineItem({ lineId, quantity })
        toast({
          title: "Cart updated",
          description: "Item quantity has been updated.",
          duration: 2000,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update quantity. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    })
  }

  const handleRemoveItem = (lineId: string) => {
    startTransition(async () => {
      try {
        await deleteLineItem(lineId)
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
          duration: 2000,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove item. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    })
  }

  const formatPrice = (amount: number, currencyCode: string = "AUD") => {
    // MedusaJS stores prices in cents, convertToLocale handles the formatting
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currencyCode,
    }).format(amount)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="icon"
            className="relative h-10 w-10"
            data-testid="cart-button"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
              {itemCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Add some delicious items to get started!
              </p>
              <Button
                onClick={() => setOpen(false)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item: any) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex gap-4 p-4 bg-white rounded-lg border transition-opacity",
                    isPending && "opacity-50 pointer-events-none"
                  )}
                >
                  {/* Product Image */}
                  <LocalizedClientLink
                    href={`/products/${item.product?.handle}`}
                    className="flex-shrink-0"
                    onClick={() => setOpen(false)}
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      <Thumbnail
                        thumbnail={item.thumbnail}
                        images={item.product?.images}
                        size="square"
                      />
                    </div>
                  </LocalizedClientLink>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <LocalizedClientLink
                      href={`/products/${item.product?.handle}`}
                      onClick={() => setOpen(false)}
                    >
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors">
                        {item.product_title}
                      </h4>
                    </LocalizedClientLink>
                    
                    {item.variant_title && (
                      <p className="text-xs text-gray-600 mt-1">
                        {item.variant_title}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleUpdateQuantity(item.id, (item.quantity || 1) - 1)
                          }
                          disabled={isPending || (item.quantity || 1) <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleUpdateQuantity(item.id, (item.quantity || 1) + 1)
                          }
                          disabled={isPending}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPrice(item.total || 0, cart.region?.currency_code)}
                        </p>
                        {item.quantity && item.quantity > 1 && (
                          <p className="text-xs text-gray-600">
                            {formatPrice((item.total || 0) / item.quantity, cart.region?.currency_code)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals */}
        {cart && cart.items && cart.items.length > 0 && (
          <SheetFooter className="px-6 py-4 border-t bg-gray-50">
            <div className="w-full space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal, cart.region?.currency_code)}
                </span>
              </div>

              {/* Shipping Note */}
              <p className="text-xs text-gray-600 text-center">
                Shipping and taxes calculated at checkout
              </p>

              {/* Checkout Button */}
              <LocalizedClientLink href="/checkout" className="block">
                <Button
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base shadow-lg"
                  onClick={() => setOpen(false)}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </LocalizedClientLink>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                className="w-full h-10"
                onClick={() => setOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
