import Head from 'next/head'
import Link from 'next/link'

export default function About() {
  return (
    <>
      <Head>
        <title>About - Afro</title>
        <meta name="description" content="Learn more about Afro e-commerce platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <h1 className="text-3xl font-bold text-gray-900 cursor-pointer">Afro</h1>
              </Link>
              <nav className="flex gap-6">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/about" className="text-gray-900 font-semibold">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">About Afro</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Afro is a modern e-commerce platform built with cutting-edge technologies 
              to provide the best shopping experience. Our platform is powered by Medusa, 
              a headless commerce engine that offers flexibility and scalability.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Technology Stack</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Medusa:</strong> Headless commerce platform for the backend</li>
              <li><strong>Next.js:</strong> React framework for the frontend</li>
              <li><strong>TypeScript:</strong> Type-safe development</li>
              <li><strong>Tailwind CSS:</strong> Utility-first CSS framework</li>
              <li><strong>Stripe:</strong> Secure payment processing</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Key Features</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Responsive design that works on all devices</li>
              <li>Fast page loads with Next.js optimization</li>
              <li>Secure checkout process with Stripe integration</li>
              <li>Scalable architecture built on modern web standards</li>
              <li>Easy to maintain and extend</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Mission</h3>
            <p className="text-gray-700 mb-6">
              We aim to provide a seamless shopping experience while maintaining 
              the highest standards of performance, security, and user experience. 
              Our platform is built following industry best practices and is designed 
              to scale with your business needs.
            </p>
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
