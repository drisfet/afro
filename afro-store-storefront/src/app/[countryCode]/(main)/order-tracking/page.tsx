"use client"

import { useState } from "react"
import { Metadata } from "next"

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    
    // TODO: Implement actual order tracking logic with Medusa API
    setTimeout(() => {
      setIsSearching(false)
      alert("Order tracking functionality will be implemented with Medusa API")
    }, 1000)
  }

  return (
    <div className="content-container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Order Tracking</h1>
        <p className="text-gray-600 mb-8">
          Enter your order ID and email address to track your order status.
        </p>

        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                Order ID *
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                placeholder="Enter your order ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can find your order ID in the confirmation email
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use the email address associated with your order
              </p>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Track Order"}
            </button>
          </form>
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Same-Day Delivery:</strong> Place your order before 11 AM to receive it the same day!
            </p>
            <p>
              <strong>Standard Delivery:</strong> Orders placed after 11 AM will be delivered the next business day.
            </p>
            <p>
              <strong>Tracking Updates:</strong> You'll receive email updates when your order is:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Confirmed and being prepared</li>
              <li>Out for delivery</li>
              <li>Delivered</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need help with your order?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-white border-2 border-orange-600 text-orange-600 px-6 py-2 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
            >
              Contact Support
            </a>
            <a
              href="tel:+61299999999"
              className="inline-block bg-white border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              📞 (02) 9999 9999
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
