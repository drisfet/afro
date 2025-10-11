"use client"

import { Popover, PopoverPanel, Transition, Disclosure } from "@headlessui/react"
import { ArrowRightMini, XMark, ChevronDown } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

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

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center gap-2 transition-all ease-out duration-200 focus:outline-none hover:text-orange-600 font-medium"
                >
                  <span className="text-xl">☰</span> Menu
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 -translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-full"
              >
                <PopoverPanel className="fixed left-0 top-0 w-80 h-screen z-50 bg-white shadow-2xl overflow-y-auto">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b">
                      <h2 className="text-xl font-bold">Menu</h2>
                      <button 
                        onClick={close}
                        className="hover:text-orange-600 transition-colors"
                        data-testid="close-menu-button"
                      >
                        <XMark className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Main Menu Items */}
                    <div className="p-6 border-b">
                      <ul className="space-y-3">
                        {Object.entries(SideMenuItems).map(([name, href]) => (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              className="text-lg hover:text-orange-600 transition-colors block"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              {name}
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Categories */}
                    <div className="flex-1 p-6">
                      <h3 className="font-semibold text-lg mb-4">Categories</h3>
                      <ul className="space-y-2">
                        {Categories.map((category) => {
                          if (category.subcategories.length > 0) {
                            return (
                              <li key={category.name}>
                                <Disclosure>
                                  {({ open: isOpen }) => (
                                    <>
                                      <Disclosure.Button className="flex justify-between items-center w-full text-left hover:text-orange-600 transition-colors py-2">
                                        <span>{category.name}</span>
                                        <ChevronDown
                                          className={clx(
                                            "w-4 h-4 transition-transform",
                                            isOpen && "rotate-180"
                                          )}
                                        />
                                      </Disclosure.Button>
                                      <Disclosure.Panel className="pl-4 space-y-2 mt-2">
                                        <LocalizedClientLink
                                          href={category.href}
                                          className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1"
                                          onClick={close}
                                        >
                                          All {category.name}
                                        </LocalizedClientLink>
                                        {category.subcategories.map((sub) => (
                                          <LocalizedClientLink
                                            key={sub.name}
                                            href={sub.href}
                                            className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1"
                                            onClick={close}
                                          >
                                            {sub.name}
                                          </LocalizedClientLink>
                                        ))}
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                              </li>
                            )
                          }

                          return (
                            <li key={category.name}>
                              <LocalizedClientLink
                                href={category.href}
                                className="block hover:text-orange-600 transition-colors py-2"
                                onClick={close}
                              >
                                {category.name}
                              </LocalizedClientLink>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t space-y-4">
                      <div
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && (
                          <div className="flex items-center justify-between">
                            <CountrySelect
                              toggleState={toggleState}
                              regions={regions}
                            />
                            <ArrowRightMini
                              className={clx(
                                "transition-transform duration-150",
                                toggleState.state ? "-rotate-90" : ""
                              )}
                            />
                          </div>
                        )}
                      </div>
                      <Text className="text-xs text-gray-500">
                        © {new Date().getFullYear()} AfroMart Sydney. All rights reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
