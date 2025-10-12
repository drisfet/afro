"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCategoryTransition } from "@/providers/category-transition-provider"
import { useRef } from "react"
import { 
  Sparkles, 
  Wheat, 
  Package,
  Leaf, 
  Milk, 
  Drumstick, 
  Fish, 
  Flame, 
  Soup,
  Coffee,
  Droplet,
  Scissors
} from "lucide-react"

interface Category {
  id: string
  name: string
  href: string
  icon: React.ReactNode
  emoji: string
  productCount?: number
  gradient: string
}

const categories: Category[] = [
  {
    id: "special-offers",
    name: "Special Offers",
    href: "/store",
    icon: <Sparkles className="h-6 w-6" />,
    emoji: "🔥",
    productCount: 25,
    gradient: "from-red-500 to-orange-500",
  },
  {
    id: "swallows",
    name: "Swallows",
    href: "/categories/swallows",
    icon: <Wheat className="h-6 w-6" />,
    emoji: "🫓",
    productCount: 18,
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "grains",
    name: "Grains",
    href: "/categories/grains",
    icon: <Package className="h-6 w-6" />,
    emoji: "🌾",
    productCount: 32,
    gradient: "from-yellow-600 to-amber-600",
  },
  {
    id: "fruits-vegetables",
    name: "Fruits & Vegetables",
    href: "/categories/fruits-and-vegetables",
    icon: <Leaf className="h-6 w-6" />,
    emoji: "🥬",
    productCount: 45,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "dairy-eggs",
    name: "Dairy & Eggs",
    href: "/categories/dairy-and-eggs",
    icon: <Milk className="h-6 w-6" />,
    emoji: "🥛",
    productCount: 15,
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    id: "meat-poultry",
    name: "Meat & Poultry",
    href: "/categories/meat-and-poultry",
    icon: <Drumstick className="h-6 w-6" />,
    emoji: "🍗",
    productCount: 28,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "fish-seafood",
    name: "Fish & Seafood",
    href: "/categories/fish-and-seafood",
    icon: <Fish className="h-6 w-6" />,
    emoji: "🐟",
    productCount: 22,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "sauces-spices",
    name: "Sauces & Spices",
    href: "/categories/sauces-and-spices",
    icon: <Flame className="h-6 w-6" />,
    emoji: "🌶️",
    productCount: 38,
    gradient: "from-orange-600 to-red-600",
  },
  {
    id: "canned-oil",
    name: "Canned Food & Oil",
    href: "/categories/canned-food-and-oil",
    icon: <Soup className="h-6 w-6" />,
    emoji: "🥫",
    productCount: 30,
    gradient: "from-slate-500 to-gray-600",
  },
  {
    id: "herbal-drinks",
    name: "Herbal Drinks",
    href: "/categories/herbal-drinks",
    icon: <Coffee className="h-6 w-6" />,
    emoji: "🍵",
    productCount: 12,
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    id: "personal-hygiene",
    name: "Personal Hygiene",
    href: "/categories/personal-hygiene",
    icon: <Droplet className="h-6 w-6" />,
    emoji: "🧴",
    productCount: 20,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "hair-products",
    name: "Hair Products",
    href: "/categories/hair-products",
    icon: <Scissors className="h-6 w-6" />,
    emoji: "💇",
    productCount: 17,
    gradient: "from-purple-500 to-pink-600",
  },
]

const CategoryGrid = () => {
  const { startTransition } = useCategoryTransition()
  const cardRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({})

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    category: Category
  ) => {
    e.preventDefault() // Prevent default navigation
    
    const element = cardRefs.current[category.id]
    if (element) {
      startTransition(
        {
          id: category.id,
          name: category.name,
          emoji: category.emoji,
          gradient: category.gradient,
        },
        element,
        category.href
      )
    }
  }

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="content-container">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600">
            Browse our authentic African & Caribbean groceries
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <a
              key={category.id}
              ref={(el) => {
                cardRefs.current[category.id] = el
              }}
              onClick={(e) => handleCategoryClick(e, category)}
              href={category.href}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Vibrant Gradient Background - Always Visible */}
              <div 
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-100 transition-all duration-300 group-hover:scale-110",
                  category.gradient
                )}
              />
              
              {/* White Overlay for Text Contrast */}
              <div className="absolute inset-0 bg-white/40 group-hover:bg-white/30 transition-all duration-300" />
              
              {/* Content */}
              <div className="relative p-5 flex flex-col items-center text-center min-h-[160px] justify-between">
                {/* Icon/Emoji with Enhanced Shadow */}
                <div className="mb-3">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-125 transition-all duration-300">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300" role="img" aria-label={category.name}>
                      {category.emoji}
                    </span>
                  </div>
                </div>

                {/* Category Name - Bold and Clear */}
                <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 group-hover:text-orange-600 transition-colors drop-shadow-sm">
                  {category.name}
                </h3>

                {/* Product Count Badge - More Prominent */}
                {category.productCount && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs font-semibold bg-white/90 text-gray-800 hover:bg-white shadow-sm"
                  >
                    {category.productCount}+ items
                  </Badge>
                )}
              </div>

              {/* Hover Arrow - Always Visible but Enhanced on Hover */}
              <div className="absolute top-3 right-3 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <svg 
                    className="w-4 h-4 text-gray-700 group-hover:text-orange-600 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Decorative Corner Accent */}
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/20 rounded-tr-full transform -translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryGrid
