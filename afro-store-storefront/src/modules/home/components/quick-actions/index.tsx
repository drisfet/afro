"use client"

import { Flame, Sparkles, ShoppingCart, Leaf, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  variant?: "default" | "primary"
}

const quickActions: QuickAction[] = [
  {
    id: "deals",
    label: "Today's Deals",
    icon: <Flame className="h-5 w-5" />,
    href: "/collections/special-offers",
    variant: "primary",
  },
  {
    id: "new",
    label: "New Arrivals",
    icon: <Sparkles className="h-5 w-5" />,
    href: "/collections/new-arrivals",
  },
  {
    id: "fresh",
    label: "Fresh Produce",
    icon: <Leaf className="h-5 w-5" />,
    href: "/collections/fruits-and-vegetables",
  },
  {
    id: "groceries",
    label: "Groceries",
    icon: <ShoppingCart className="h-5 w-5" />,
    href: "/store",
  },
  {
    id: "pantry",
    label: "Pantry Essentials",
    icon: <Package className="h-5 w-5" />,
    href: "/collections/provisions",
  },
]

const QuickActions = () => {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="content-container py-4">
        {/* Horizontal Scrollable Container */}
        <div className="relative -mx-4 px-4">
          <div 
            className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {quickActions.map((action) => (
              <a
                key={action.id}
                href={action.href}
                className="snap-start"
              >
                <Button
                  variant={action.variant === "primary" ? "default" : "outline"}
                  size="lg"
                  className={cn(
                    "h-14 px-6 whitespace-nowrap font-medium transition-all hover:scale-105",
                    action.variant === "primary" 
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md" 
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  )}
                >
                  <span className="mr-2">{action.icon}</span>
                  {action.label}
                </Button>
              </a>
            ))}
          </div>
        </div>

        {/* Scroll Indicator (optional - shows on mobile) */}
        <div className="flex justify-center gap-1 mt-2 md:hidden">
          {quickActions.map((_, index) => (
            <div
              key={index}
              className="h-1 w-1 rounded-full bg-gray-300"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default QuickActions
