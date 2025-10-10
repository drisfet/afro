import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Afro - E-commerce Store</title>
        <meta name="description" content="Modern e-commerce store built with Medusa and Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Afro</h1>
              <nav className="flex gap-6">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-gray-900">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
              Welcome to Afro
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your modern e-commerce experience powered by Medusa and Next.js. 
              Built with best practices and ready to scale.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/about"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Learn More
              </Link>
              <Link
                href="/contact"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Fast & Modern
              </h4>
              <p className="text-gray-600">
                Built with Next.js for optimal performance and user experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-4xl mb-4">🛒</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Powered by Medusa
              </h4>
              <p className="text-gray-600">
                Headless commerce platform with all the features you need.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-600 text-4xl mb-4">💳</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payments
              </h4>
              <p className="text-gray-600">
                Integrated with Stripe for secure and reliable transactions.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2025 Afro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
