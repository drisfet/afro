import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - AfroMart Sydney",
  description: "Learn about AfroMart Sydney - your trusted source for authentic African groceries and products in Sydney, Australia.",
}

export default function AboutPage() {
  return (
    <div className="content-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About AfroMart Sydney</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to AfroMart Sydney - your premier destination for authentic African groceries, 
            provisions, and specialty products right here in Sydney, Australia.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At AfroMart, we're passionate about bringing the authentic flavors and ingredients of 
            Africa to Sydney. We understand the importance of having access to familiar foods from 
            home, which is why we carefully curate our selection to serve the diverse African 
            diaspora community in Sydney.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Fresh and authentic African groceries</li>
            <li>Traditional swallows and grains</li>
            <li>African sauces and spices</li>
            <li>Fish and seafood products</li>
            <li>Personal care and hair products</li>
            <li>Fresh fruits and vegetables</li>
            <li>Meat and poultry</li>
            <li>And much more!</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Convenient Delivery Across Sydney</h2>
          <p className="text-gray-700 mb-4">
            Shop online from the comfort of your home and enjoy fast, reliable delivery across 
            Sydney. We're committed to making authentic African products accessible to everyone 
            in the greater Sydney area.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Special Offers</h2>
          <p className="text-gray-700 mb-4">
            We offer exclusive discounts for first-time orders! Start your African culinary 
            journey with AfroMart today and experience the convenience of having authentic 
            ingredients delivered to your doorstep.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Physical Store Coming Soon!</h2>
          <p className="text-gray-700 mb-4">
            We're excited to announce that we'll soon be opening our physical store location 
            in Sydney. Stay tuned for updates on our grand opening, where you'll be able to 
            browse our full range of products in person.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose AfroMart?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li><strong>Authenticity:</strong> Genuine African products sourced with care</li>
            <li><strong>Quality:</strong> Fresh products delivered with quality assurance</li>
            <li><strong>Convenience:</strong> Easy online ordering with fast delivery</li>
            <li><strong>Community:</strong> Supporting the African diaspora in Sydney</li>
            <li><strong>Service:</strong> Dedicated customer support for all your needs</li>
          </ul>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mt-8">
            <p className="text-lg font-semibold mb-2">Ready to shop?</p>
            <p className="text-gray-700">
              Browse our extensive collection of African groceries and products. 
              Order online today and experience the authentic taste of home!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
