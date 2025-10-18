"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"

interface CategoryTransitionState {
  isTransitioning: boolean
  selectedCategory: {
    id: string
    name: string
    emoji: string
    gradient: string
    position: { x: number; y: number; width: number; height: number }
  } | null
}

interface CategoryTransitionContextType {
  state: CategoryTransitionState
  startTransition: (
    category: {
      id: string
      name: string
      emoji: string
      gradient: string
    },
    element: HTMLElement,
    targetHref: string
  ) => void
}

const CategoryTransitionContext = createContext<CategoryTransitionContextType | null>(null)

export function useCategoryTransition() {
  const context = useContext(CategoryTransitionContext)
  if (!context) {
    throw new Error("useCategoryTransition must be used within CategoryTransitionProvider")
  }
  return context
}

export function CategoryTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const [state, setState] = useState<CategoryTransitionState>({
    isTransitioning: false,
    selectedCategory: null,
  })

  // Detect route changes and reset transition only when page is ready
  useEffect(() => {
    if (state.isTransitioning && pathname !== previousPathname.current) {
      // Route has changed, wait for page to fully load before dismissing overlay
      const timer = setTimeout(() => {
        setState({
          isTransitioning: false,
          selectedCategory: null,
        })
      }, 800) // Longer delay to ensure smooth transition to loaded page

      previousPathname.current = pathname
      return () => clearTimeout(timer)
    }
  }, [pathname, state.isTransitioning])

  const startTransition = (
    category: {
      id: string
      name: string
      emoji: string
      gradient: string
    },
    element: HTMLElement,
    targetHref: string
  ) => {
    // Get the element's position
    const rect = element.getBoundingClientRect()
    
    // Set transition state
    setState({
      isTransitioning: true,
      selectedCategory: {
        ...category,
        position: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        },
      },
    })

    // Navigate after animation reaches full screen
    setTimeout(() => {
      router.push(targetHref)
    }, 800) // Match animation duration
  }

  return (
    <CategoryTransitionContext.Provider value={{ state, startTransition }}>
      {children}
      
      {/* Fullscreen Transition Overlay - Stays visible until new page loads */}
      <AnimatePresence mode="wait">
        {state.isTransitioning && state.selectedCategory && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {/* Expanding Background */}
            <motion.div
              className={`absolute bg-gradient-to-br ${state.selectedCategory.gradient}`}
              initial={{
                left: state.selectedCategory.position.x,
                top: state.selectedCategory.position.y,
                width: state.selectedCategory.position.width,
                height: state.selectedCategory.position.height,
                borderRadius: "0.75rem", // rounded-xl
              }}
              animate={{
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                borderRadius: "0px",
              }}
              transition={{
                duration: 0.8,
                ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for smooth effect
              }}
            />

            {/* Animated Card Content */}
            <motion.div
              className="absolute flex flex-col items-center justify-center"
              initial={{
                left: state.selectedCategory.position.x,
                top: state.selectedCategory.position.y,
                width: state.selectedCategory.position.width,
                height: state.selectedCategory.position.height,
              }}
              animate={{
                left: "50%",
                top: "50%",
                width: "auto",
                height: "auto",
                x: "-50%",
                y: "-50%",
              }}
              transition={{
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              {/* Emoji Circle */}
              <motion.div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white flex items-center justify-center shadow-2xl mb-6"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                <span className="text-6xl sm:text-7xl" role="img" aria-label={state.selectedCategory.name}>
                  {state.selectedCategory.emoji}
                </span>
              </motion.div>

              {/* Category Name */}
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.4,
                }}
              >
                {state.selectedCategory.name}
              </motion.h2>

              {/* Loading Spinner */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.3,
                }}
              >
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CategoryTransitionContext.Provider>
  )
}
