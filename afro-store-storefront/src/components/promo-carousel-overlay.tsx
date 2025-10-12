"use client"

import * as React from "react"
import { X, ArrowRight, Gift, Truck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// CMS-managed promo data structure
interface PromoSlide {
  id: string
  type: "free-delivery" | "promo-code" | "sale" | "announcement"
  icon: React.ReactNode
  badge?: string
  title: string
  description: string
  highlight?: string // Promo code or special text
  ctaText: string
  ctaLink: string
  gradient: string
}

// This data would ideally come from your CMS/backend
const promoSlides: PromoSlide[] = [
  {
    id: "free-delivery",
    type: "free-delivery",
    icon: <Truck className="h-12 w-12" />,
    badge: "Limited Time",
    title: "Free Delivery in Sydney",
    description: "Get your authentic African & Caribbean groceries delivered to your door at no extra cost!",
    highlight: "Orders over $50",
    ctaText: "Start Shopping",
    ctaLink: "/store",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "promo-code",
    type: "promo-code",
    icon: <Gift className="h-12 w-12" />,
    badge: "New Customers",
    title: "$10 Off Your First Order",
    description: "Use code at checkout to save on your first purchase from AfroMart Sydney",
    highlight: "WELCOME10",
    ctaText: "Shop Now",
    ctaLink: "/store",
    gradient: "from-orange-500 to-red-500",
  },
]

interface PromoCarouselOverlayProps {
  /**
   * Array of promo slides to display
   * In production, fetch this from your CMS
   */
  slides?: PromoSlide[]
  
  /**
   * Whether to show the overlay automatically on first visit
   * @default true
   */
  autoShow?: boolean
  
  /**
   * Delay in milliseconds before showing the overlay
   * @default 1000
   */
  showDelay?: number
  
  /**
   * LocalStorage key to track if user has seen the promo
   * @default "afromart-promo-seen"
   */
  storageKey?: string
  
  /**
   * Number of minutes before the "Don't show again" preference expires
   * After this time, the overlay will show again
   * @default 30 (30 minutes)
   */
  expirationMinutes?: number
}

export default function PromoCarouselOverlay({
  slides = promoSlides,
  autoShow = true,
  showDelay = 1000,
  storageKey = "afromart-promo-seen",
  expirationMinutes = 5,
}: PromoCarouselOverlayProps) {
  const [open, setOpen] = React.useState(false)
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [dontShowAgain, setDontShowAgain] = React.useState(false)

  // Auto-show on every visit (unless user opted out and expiration hasn't passed)
  React.useEffect(() => {
    if (!autoShow) return

    // Check if user opted out and if the preference has expired
    const storedData = localStorage.getItem(storageKey)
    
    if (storedData) {
      try {
        const { timestamp } = JSON.parse(storedData)
        const expirationTime = timestamp + (expirationMinutes * 60 * 1000) // Convert minutes to milliseconds
        const now = Date.now()
        
        // If not expired, don't show
        if (now < expirationTime) {
          return
        }
        
        // Expired, clear old data and show overlay
        localStorage.removeItem(storageKey)
      } catch (e) {
        // Old format (just "true"), clear it and show overlay
        localStorage.removeItem(storageKey)
      }
    }

    // Show after delay
    const timer = setTimeout(() => {
      setOpen(true)
    }, showDelay)

    return () => clearTimeout(timer)
  }, [autoShow, showDelay, storageKey, expirationMinutes])

  // Track carousel state
  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Handle close
  const handleClose = () => {
    // Save preference with timestamp if checkbox is checked
    if (dontShowAgain) {
      const data = {
        timestamp: Date.now(),
        expiresIn: expirationMinutes,
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
    }
    setOpen(false)
    setDontShowAgain(false) // Reset for next time
  }

  // Handle CTA click
  const handleCTA = () => {
    // Save preference with timestamp if checkbox is checked
    if (dontShowAgain) {
      const data = {
        timestamp: Date.now(),
        expiresIn: expirationMinutes,
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
    }
    setOpen(false)
    setDontShowAgain(false) // Reset for next time
  }

  if (slides.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent 
        className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[600px] p-0 gap-0 overflow-hidden border-0 max-h-[90vh] overflow-y-auto"
        // Make it easy to dismiss
        onPointerDownOutside={() => handleClose()}
        onEscapeKeyDown={() => handleClose()}
      >
        {/* Custom close button - always visible */}
        <button
          onClick={() => handleClose()}
          className="absolute right-3 top-3 z-20 rounded-full bg-white/95 p-2 shadow-lg backdrop-blur-sm opacity-100 ring-offset-background transition-all hover:bg-white hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
        </button>

        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id}>
                {/* Full gradient background - no white borders */}
                <div className={cn(
                  "relative overflow-hidden bg-gradient-to-br",
                  slide.gradient
                )}>
                  {/* Lighter overlay for better text readability */}
                  <div className="absolute inset-0 bg-white/5" />
                  
                  {/* Content - centered and balanced padding */}
                  <div className="relative px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-14 flex flex-col items-center">
                    {/* Badge */}
                    {slide.badge && (
                      <div className="mb-4">
                        <Badge 
                          className="bg-white/20 backdrop-blur-sm text-white font-semibold shadow-lg text-xs sm:text-sm border-white/30"
                        >
                          {slide.badge}
                        </Badge>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="mb-4 sm:mb-6">
                      <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-full bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30">
                        <div className="text-white [&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-10 sm:[&>svg]:h-10 md:[&>svg]:w-12 md:[&>svg]:h-12">
                          {slide.icon}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <DialogHeader className="text-center mb-3 sm:mb-4 space-y-2 max-w-lg mx-auto">
                      <DialogTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                        {slide.title}
                      </DialogTitle>
                      <DialogDescription className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed drop-shadow-md">
                        {slide.description}
                      </DialogDescription>
                    </DialogHeader>

                    {/* Highlight (Promo Code / Special Text) */}
                    {slide.highlight && (
                      <div className="my-4 sm:my-6">
                        <div className="inline-block w-full max-w-[280px] sm:max-w-md mx-auto">
                          <div className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 rounded-xl bg-white/95 backdrop-blur-sm font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wider shadow-2xl text-center border-2 border-white/50">
                            <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", slide.gradient)}>
                              {slide.highlight}
                            </span>
                          </div>
                          {slide.type === "promo-code" && (
                            <div className="text-center mt-2 text-xs sm:text-sm text-white/90 font-medium">
                              Copy this code at checkout
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="flex flex-col items-center gap-2 sm:gap-3 mt-6 sm:mt-8 w-full max-w-xs mx-auto">
                      <LocalizedClientLink href={slide.ctaLink} className="w-full">
                        <Button 
                          onClick={handleCTA}
                          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all bg-white hover:bg-white/90 text-gray-900 border-2 border-white/50"
                        >
                          {slide.ctaText}
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </LocalizedClientLink>

                      {/* Don't show again checkbox */}
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="dont-show-again"
                          checked={dontShowAgain}
                          onCheckedChange={(checked: boolean) => setDontShowAgain(checked)}
                          className="border-white/50 bg-white/20 data-[state=checked]:bg-white data-[state=checked]:text-gray-900"
                        />
                        <label
                          htmlFor="dont-show-again"
                          className="text-xs sm:text-sm text-white/90 cursor-pointer select-none"
                        >
                          Don't show for {expirationMinutes} minutes
                        </label>
                      </div>

                      {/* Dismiss button */}
                      <button
                        onClick={() => handleClose()}
                        className="text-xs sm:text-sm text-white/80 hover:text-white underline transition-colors py-2"
                      >
                        I'll browse first
                      </button>
                    </div>

                    {/* Carousel indicators (if multiple slides) */}
                    {count > 1 && (
                      <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                        {Array.from({ length: count }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                              "h-2 rounded-full transition-all",
                              index === current
                                ? "w-8 bg-white shadow-md"
                                : "w-2 bg-white/40 hover:bg-white/60"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Swipe hint (mobile only, first slide) */}
                    {count > 1 && current === 0 && (
                      <div className="sm:hidden text-center mt-3 sm:mt-4">
                        <p className="text-xs text-white/70 animate-pulse">
                          Swipe for more offers →
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Desktop navigation arrows */}
          {count > 1 && (
            <div className="hidden md:block">
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </div>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
