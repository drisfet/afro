"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion } from "./regions"

/**
 * Fetch products on sale or featured for deals carousel
 * Prioritizes products with sale prices, then falls back to newest products
 */
export async function getDealProducts(
  countryCode: string,
  limit: number = 10
): Promise<HttpTypes.StoreProduct[]> {
  try {
    const region = await getRegion(countryCode)

    if (!region) {
      return []
    }

    const headers = {
      ...(await getAuthHeaders()),
    }

    const next = {
      ...(await getCacheOptions("products")),
    }

    // Fetch products with calculated prices and metadata
    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        limit: limit * 2, // Fetch more to filter for deals
        region_id: region.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+images",
        order: "-created_at", // Get newest products first
      },
      headers,
      next,
      cache: "force-cache",
    })

    if (!response.products || response.products.length === 0) {
      return []
    }

    // Filter products that have sale prices or are featured
    const dealProducts = response.products
      .filter((product) => {
        // Check if product has any variants with sale prices
        const hasSaleVariant = product.variants?.some((variant) => {
          const price = variant.calculated_price
          return (
            price &&
            price.calculated_price?.price_list_type === "sale" &&
            price.original_amount &&
            price.calculated_amount &&
            price.original_amount > price.calculated_amount
          )
        })

        // Check if product is marked as featured in metadata
        const isFeatured = product.metadata?.featured === true

        return hasSaleVariant || isFeatured
      })
      .slice(0, limit)

    // If we don't have enough deal products, fill with newest products
    if (dealProducts.length < limit) {
      const additionalProducts = response.products
        .filter((p) => !dealProducts.find((dp) => dp.id === p.id))
        .slice(0, limit - dealProducts.length)

      return [...dealProducts, ...additionalProducts]
    }

    return dealProducts
  } catch (error) {
    console.error("Error fetching deal products:", error)
    return []
  }
}
