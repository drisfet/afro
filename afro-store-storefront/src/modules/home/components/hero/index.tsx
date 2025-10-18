"use client"

import { Search, MapPin, ShoppingBag, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/store?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600">
      {/* Main Hero Content */}
      <div className="content-container pt-6 pb-8 md:pt-8 md:pb-12">
        {/* Location Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge 
            variant="secondary" 
            className="bg-white/90 text-orange-700 hover:bg-white border-none shadow-sm px-3 py-1.5 text-sm font-medium"
          >
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            Delivering to Sydney
          </Badge>
          <Badge 
            variant="success" 
            className="shadow-sm px-3 py-1.5 text-sm font-medium"
          >
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Same-day delivery
          </Badge>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            Authentic African & Caribbean Groceries
          </h1>
          <p className="text-base md:text-lg text-white/95 max-w-2xl">
            Sydney's premier online African grocer. Fresh produce, specialty ingredients, and traditional foods delivered to your door.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, categories..."
              className="w-full h-14 pl-12 pr-4 rounded-xl border-none shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-white/50 transition-shadow"
              aria-label="Search products"
            />
          </div>
        </form>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-white/95">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">200+ Products</div>
              <div className="text-xs text-white/80">Fresh & Authentic</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-white/95">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl">🏪</span>
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Store Coming Soon</div>
              <div className="text-xs text-white/80">Physical Location</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 60" 
          className="w-full h-6 md:h-8 fill-white"
          preserveAspectRatio="none"
        >
          <path d="M0,30 C240,50 480,10 720,30 C960,50 1200,10 1440,30 L1440,60 L0,60 Z"></path>
        </svg>
      </div>
    </div>
  )
}

export default Hero

