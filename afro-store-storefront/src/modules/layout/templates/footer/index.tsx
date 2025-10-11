import { listCategories } from "@lib/data/categories"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const productCategories = await listCategories()

  // Key product categories for footer
  const footerCategories = [
    { name: "Swallows", handle: "swallows" },
    { name: "Sweets and Chips", handle: "sweets-and-chips" },
    { name: "Sauces and Spices", handle: "sauces-and-spices" },
    { name: "Fish and Seafood", handle: "fish-and-seafood" },
    { name: "Grains", handle: "grains" },
    { name: "Packets", handle: "packets" },
    { name: "Dairy and Eggs", handle: "dairy-and-eggs" },
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-200 w-full">
      <div className="content-container py-12">
        {/* Logo */}
        <div className="mb-8">
          <LocalizedClientLink href="/">
            <div className="flex items-center gap-2">
              <div className="text-4xl">🌍</div>
              <div>
                <div className="text-2xl font-bold text-orange-600">AfroMart</div>
                <div className="text-sm text-gray-500">Sydney</div>
              </div>
            </div>
          </LocalizedClientLink>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Product Catalog */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product Catalog</h3>
            <ul className="space-y-2">
              {footerCategories.map((category) => (
                <li key={category.handle}>
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {category.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <LocalizedClientLink
                  href="/about"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  About Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/contact"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Contact Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/order-tracking"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Order Tracking
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/refund-and-returns-policy"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Returns Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/terms-and-conditions"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Terms & Conditions
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Privacy Policy
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2"
                >
                  <span>📘</span> Facebook (Coming Soon)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2"
                >
                  <span>📷</span> Instagram (Coming Soon)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2"
                >
                  <span>�</span> Twitter (Coming Soon)
                </a>
              </li>
            </ul>
          </div>

          {/* Stay informed + Download app */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <div className="mb-6">
              <input
                type="email"
                placeholder="Your email address"
                disabled
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded bg-gray-50 cursor-not-allowed"
              />
              <button
                type="button"
                disabled
                className="w-full bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
              >
                Subscribe (Coming Soon)
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Newsletter coming soon - get early access to deals, new products, and exclusive offers!
              </p>
            </div>

            <h3 className="font-semibold text-lg mb-3">Mobile App</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded cursor-not-allowed">
                <span>🍎</span>
                <div className="text-left">
                  <div className="text-xs">Coming Soon</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded cursor-not-allowed">
                <span>🤖</span>
                <div className="text-left">
                  <div className="text-xs">Coming Soon</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <Text className="text-sm text-gray-600">
            © AfroMart Sydney {new Date().getFullYear()}. All rights reserved. Created by{" "}
            <span className="font-semibold text-orange-600">dRof</span>
          </Text>
          <Text className="text-xs text-gray-500 mt-2">
            Physical store location coming soon to Sydney!
          </Text>
        </div>
      </div>
    </footer>
  )
}
