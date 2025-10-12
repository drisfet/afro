"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Main menu items
const SideMenuItems = {
  Home: "/",
  Shop: "/store",
  About: "/about",
  Contact: "/contact",
  Account: "/account",
}

// Main categories from site architecture
const Categories = [
  {
    name: "Special Offers",
    href: "/store",
    subcategories: []
  },
  {
    name: "Swallows",
    href: "/categories/swallows",
    subcategories: []
  },
  {
    name: "Grains",
    href: "/categories/grains",
    subcategories: []
  },
  {
    name: "Fruits and Vegetables",
    href: "/categories/fruits-and-vegetables",
    subcategories: [
      { name: "Vegetables", href: "/categories/vegetables" },
      { name: "Leaves", href: "/categories/leaves" },
      { name: "Fruits", href: "/categories/fruits" },
    ]
  },
  {
    name: "Dairy and Eggs",
    href: "/categories/dairy-and-eggs",
    subcategories: []
  },
  {
    name: "Meat and Poultry",
    href: "/categories/meat-and-poultry",
    subcategories: [
      { name: "Fresh Meat", href: "/categories/fresh-meat" },
      { name: "Chicken", href: "/categories/chicken" },
    ]
  },
  {
    name: "Fish and Seafood",
    href: "/categories/fish-and-seafood",
    subcategories: [
      { name: "Frozen Foods", href: "/categories/frozen-foods" },
      { name: "Dry Fish", href: "/categories/dry-fish" },
    ]
  },
  {
    name: "Sauces and Spices",
    href: "/categories/sauces-and-spices",
    subcategories: []
  },
  {
    name: "Canned Food and Oil",
    href: "/categories/canned-food-and-oil",
    subcategories: []
  },
  {
    name: "Herbal Drinks",
    href: "/categories/herbal-drinks",
    subcategories: []
  },
  {
    name: "Personal Hygiene",
    href: "/categories/personal-hygiene",
    subcategories: []
  },
  {
    name: "Hair Products",
    href: "/categories/hair-products",
    subcategories: []
  },
]

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="flex items-center gap-2 hover:text-orange-600 transition-colors font-medium h-full px-2 lg:hidden"
        data-testid="mobile-nav-trigger"
      >
        <Menu className="h-6 w-6" />
        <span>Menu</span>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-[320px] sm:w-[380px] flex flex-col p-0 overflow-y-auto"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle className="text-xl font-bold flex items-center justify-between">
            <span>Menu</span>
            <SheetClose className="hover:text-orange-600 transition-colors">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        {/* Main Menu Items */}
        <nav className="px-6 py-4 border-b space-y-1">
          {Object.entries(SideMenuItems).map(([name, href]) => (
            <LocalizedClientLink
              key={name}
              href={href}
              className="block py-3 text-base font-medium hover:text-orange-600 transition-colors active:bg-gray-50 rounded-md px-3 -mx-3 min-h-[44px] flex items-center"
              onClick={() => setOpen(false)}
              data-testid={`mobile-${name.toLowerCase()}-link`}
            >
              {name}
            </LocalizedClientLink>
          ))}
        </nav>

        {/* Categories */}
        <div className="flex-1 px-6 py-4">
          <h3 className="font-semibold text-base mb-3 text-gray-900">
            Categories
          </h3>
          
          <Accordion type="single" collapsible className="space-y-1">
            {Categories.map((category) => {
              if (category.subcategories.length > 0) {
                return (
                  <AccordionItem key={category.name} value={category.name} className="border-none">
                    <AccordionTrigger className="py-3 px-3 -mx-3 hover:no-underline hover:text-orange-600 rounded-md min-h-[44px] text-base font-normal">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 space-y-1">
                      <LocalizedClientLink
                        href={category.href}
                        className="block py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors pl-4 min-h-[44px] flex items-center"
                        onClick={() => setOpen(false)}
                      >
                        All {category.name}
                      </LocalizedClientLink>
                      {category.subcategories.map((sub) => (
                        <LocalizedClientLink
                          key={sub.name}
                          href={sub.href}
                          className="block py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors pl-4 min-h-[44px] flex items-center"
                          onClick={() => setOpen(false)}
                        >
                          {sub.name}
                        </LocalizedClientLink>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )
              }

              return (
                <div key={category.name} className="border-none">
                  <LocalizedClientLink
                    href={category.href}
                    className="block py-3 px-3 -mx-3 hover:text-orange-600 transition-colors rounded-md min-h-[44px] flex items-center text-base font-normal"
                    onClick={() => setOpen(false)}
                  >
                    {category.name}
                  </LocalizedClientLink>
                </div>
              )
            })}
          </Accordion>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t mt-auto">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} AfroMart Sydney. All rights reserved.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
