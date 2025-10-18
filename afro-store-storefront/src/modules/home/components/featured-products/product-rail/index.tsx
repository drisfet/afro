import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import EnhancedProductPreview from "@modules/products/components/product-preview/enhanced"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price,+images",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 small:gap-x-6 small:gap-y-12">
        {pricedProducts &&
          pricedProducts.map((product) => {
            const { cheapestPrice } = getProductPrice({ product })
            
            return (
              <li key={product.id}>
                <EnhancedProductPreview 
                  product={product} 
                  region={region} 
                  isFeatured 
                  cheapestPrice={cheapestPrice}
                />
              </li>
            )
          })}
      </ul>
    </div>
  )
}
