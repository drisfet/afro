"use client"

export default function ContactPage() {
  return (
    <div className="content-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <span>📞</span> Phone
                </h3>
                <a 
                  href="tel:+61299999999" 
                  className="text-orange-600 hover:underline text-lg"
                >
                  (02) 9999 9999
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <span>✉️</span> Email
                </h3>
                <a 
                  href="mailto:hello@afromartsydney.com.au" 
                  className="text-orange-600 hover:underline text-lg"
                >
                  hello@afromartsydney.com.au
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <span>📍</span> Location
                </h3>
                <p className="text-gray-700">
                  AfroMart Sydney<br />
                  Sydney, NSW<br />
                  Australia
                </p>
                <p className="text-sm text-orange-600 font-semibold mt-2">
                  🏪 Physical store location coming soon!
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                <p className="text-gray-700">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 5:00 PM<br />
                  Sunday: 10:00 AM - 4:00 PM
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-gray-500 cursor-not-allowed">
                  <span className="text-2xl">📘</span> Facebook (Coming Soon)
                </span>
                <span className="flex items-center gap-2 text-gray-500 cursor-not-allowed">
                  <span className="text-2xl">📷</span> Instagram (Coming Soon)
                </span>
                <span className="flex items-center gap-2 text-gray-500 cursor-not-allowed">
                  <span className="text-2xl">🐦</span> Twitter (Coming Soon)
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-3">Follow us for updates on our physical store opening!</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Help Center */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-gray-700 mb-4">
            Check out our helpful resources or get in touch with our support team.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a 
              href="/order-tracking" 
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors"
            >
              <span className="text-2xl mb-2 block">📦</span>
              <h3 className="font-semibold mb-1">Track Order</h3>
              <p className="text-sm text-gray-600">Check your order status</p>
            </a>
            <a 
              href="/refund-and-returns-policy" 
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors"
            >
              <span className="text-2xl mb-2 block">↩️</span>
              <h3 className="font-semibold mb-1">Returns</h3>
              <p className="text-sm text-gray-600">View our return policy</p>
            </a>
            <a 
              href="/terms-and-conditions" 
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors"
            >
              <span className="text-2xl mb-2 block">📄</span>
              <h3 className="font-semibold mb-1">Terms</h3>
              <p className="text-sm text-gray-600">Read our terms</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
