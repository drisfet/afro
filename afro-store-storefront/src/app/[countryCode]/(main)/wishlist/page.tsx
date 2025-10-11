import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Wishlist - AfroMart Sydney",
  description: "View and manage your wishlist of African groceries and products.",
}

export default function WishlistPage() {
  // TODO: Implement actual wishlist functionality with Medusa API or localStorage
  const wishlistItems: any[] = []

  return (
    <div className="content-container py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Save your favorite products to your wishlist so you can easily find them later.
            </p>
            <Link
              href="/store"
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
              <button className="text-orange-600 hover:text-orange-700 font-semibold">
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Wishlist items will be rendered here */}
            </div>
          </div>
        )}

        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">How to use your wishlist</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-3">❤️</div>
              <h3 className="font-semibold mb-2">Save Products</h3>
              <p className="text-gray-600 text-sm">
                Click the heart icon on any product to add it to your wishlist
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">👁️</div>
              <h3 className="font-semibold mb-2">Track Favorites</h3>
              <p className="text-gray-600 text-sm">
                Keep track of products you love and want to buy later
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🛒</div>
              <h3 className="font-semibold mb-2">Quick Add to Cart</h3>
              <p className="text-gray-600 text-sm">
                Easily add wishlist items to your cart when you're ready to purchase
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Browse our categories</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/categories/swallows"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              Swallows
            </Link>
            <Link
              href="/categories/grains"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              Grains
            </Link>
            <Link
              href="/categories/sauces-and-spices"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              Sauces & Spices
            </Link>
            <Link
              href="/categories/fish-and-seafood"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              Fish & Seafood
            </Link>
            <Link
              href="/store"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
