"use client"

import * as React from "react"
import { HttpTypes } from "@medusajs/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { ShoppingCart, Percent, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { addToCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"

interface DealsCarouselClientProps {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default function DealsCarouselClient({
  products,
  region,
  countryCode,
}: DealsCarouselClientProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [addingToCart, setAddingToCart] = React.useState<string | null>(null)
  const { toast } = useToast()

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const handleQuickAdd = async (product: HttpTypes.StoreProduct) => {
    const variant = product.variants?.[0]
    
    if (!variant?.id) {
      toast({
        title: "Error",
        description: "This product is currently unavailable.",
        variant: "destructive",
      })
      return
    }

    setAddingToCart(product.id)

    try {
      await addToCart({
        variantId: variant.id,
        quantity: 1,
        countryCode,
      })

      toast({
        title: "Added to cart!",
        description: `${product.title} has been added to your cart.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(null)
    }
  }

  return (
    <div className="w-full bg-white py-10 border-t border-gray-100">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Today's Hot Deals
              </h2>
            </div>
            <p className="text-gray-600">
              Limited time offers on your favourite products
            </p>
          </div>
          <LocalizedClientLink
            href="/collections/special-offers"
            className="hidden md:flex text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            View all deals →
          </LocalizedClientLink>
        </div>

        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => {
              const price = getProductPrice({ product })
              const cheapestPrice = price?.cheapestPrice

              const discountPercentage = cheapestPrice?.percentage_diff
                ? Math.abs(Math.round(parseFloat(cheapestPrice.percentage_diff)))
                : null

              return (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {discountPercentage && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge
                          variant="destructive"
                          className="bg-red-500 text-white font-bold shadow-md"
                        >
                          {discountPercentage}% OFF
                        </Badge>
                      </div>
                    )}

                    <LocalizedClientLink href={`/products/${product.handle}`}>
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <Thumbnail
                          thumbnail={product.thumbnail}
                          images={product.images}
                          size="full"
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </LocalizedClientLink>

                    <div className="p-4">
                      <LocalizedClientLink
                        href={`/products/${product.handle}`}
                        className="block mb-2 hover:text-orange-600 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1">
                          {product.title}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {product.description}
                          </p>
                        )}
                      </LocalizedClientLink>

                      {cheapestPrice && (
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl font-bold text-orange-600">
                            {cheapestPrice.calculated_price}
                          </span>
                          {cheapestPrice.price_type === "sale" &&
                            cheapestPrice.original_price && (
                              <span className="text-sm text-gray-500 line-through">
                                {cheapestPrice.original_price}
                              </span>
                            )}
                        </div>
                      )}

                      <Button
                        className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-sm"
                        onClick={() => handleQuickAdd(product)}
                        disabled={addingToCart === product.id}
                      >
                        {addingToCart === product.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Quick Add
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          <div className="hidden md:block">
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </div>
        </Carousel>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index + 1 === current
                  ? "w-8 bg-orange-500"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-6 md:hidden text-center">
          <LocalizedClientLink
            href="/collections/special-offers"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            View all deals →
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
