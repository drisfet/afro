import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import QuickActions from "@modules/home/components/quick-actions"
import CategoryGrid from "@modules/home/components/category-grid"
import DealsCarousel from "@modules/home/components/deals-carousel"
import PromoCarouselOverlay from "@/components/promo-carousel-overlay"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "AfroMart Sydney - Authentic African Groceries Online",
  description:
    "Sydney's premier online destination for authentic African groceries, provisions, and specialty products. Same-day delivery available. Physical store coming soon!",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      {/* Promo Overlay - Shows on first visit */}
      <PromoCarouselOverlay />
      
      <Hero />
      <QuickActions />
      <CategoryGrid />
      <DealsCarousel countryCode={countryCode} />
      <div className="py-12 bg-gray-50">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
