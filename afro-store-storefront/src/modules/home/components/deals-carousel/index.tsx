import { listProductsForDisplay } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import DealsCarouselClient from "./client"

export default async function DealsCarousel({
  countryCode,
}: {
  countryCode: string
}) {
  try {
    // Fetch region for the country
    const region = await getRegion(countryCode)
    
    if (!region) {
      return null // Gracefully handle missing region
    }

    // Fetch products that are on sale or featured
    const { response } = await listProductsForDisplay({
      pageParam: 1,
      queryParams: {
        limit: 20,
      },
      countryCode,
    })

    if (!response?.products || response.products.length === 0) {
      return null // Gracefully handle no products
    }

    // Filter for sale items or featured products
    const dealProducts = response.products
      .filter((product) => {
        const hasSalePrice = product.variants?.some(
          (variant: any) =>
            variant.calculated_price?.price_type === "sale" &&
            variant.calculated_price?.percentage_diff
        )
        const isFeatured = product.metadata?.featured === true
        return hasSalePrice || isFeatured
      })
      .slice(0, 8)

    if (dealProducts.length === 0) {
      return null
    }

    return (
      <DealsCarouselClient
        products={dealProducts}
        region={region}
        countryCode={countryCode}
      />
    )
  } catch (error) {
    console.error("Error loading deals carousel:", error)
    return null
  }
}
