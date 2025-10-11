import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions - AfroMart Sydney",
  description: "Read our terms and conditions for using AfroMart Sydney services.",
}

export default function TermsPage() {
  return (
    <div className="content-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using AfroMart Sydney's website and services, you agree to be 
              bound by these Terms and Conditions. If you do not agree to these terms, please do 
              not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
            <p className="text-gray-700 mb-4">
              You must be at least 18 years old to use our services. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Use our services only for lawful purposes</li>
              <li>Not interfere with the proper functioning of our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Products and Pricing</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate product descriptions and pricing. However:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>All prices are in Australian Dollars (AUD)</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to limit quantities</li>
              <li>Product availability may vary</li>
              <li>We are not responsible for typographical errors</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Orders and Payment</h2>
            <p className="text-gray-700 mb-4">
              When you place an order:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>You make an offer to purchase products at the stated price</li>
              <li>We reserve the right to accept or reject any order</li>
              <li>Payment must be made in full before delivery</li>
              <li>We accept major credit cards and other specified payment methods</li>
              <li>You authorize us to charge your payment method for the order total</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Delivery</h2>
            <p className="text-gray-700 mb-4">
              Our delivery terms:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Orders placed before 11 AM may be delivered same day</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Delivery is available within specified areas in Sydney</li>
              <li>Delivery fees apply and vary by location</li>
              <li>You must be available to receive delivery</li>
              <li>Risk passes to you upon delivery</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              Please refer to our <a href="/refund-and-returns-policy" className="text-orange-600 hover:underline">Refund and Returns Policy</a> for detailed information about returns, refunds, and exchanges.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Product Quality</h2>
            <p className="text-gray-700 mb-4">
              We take pride in the quality of our products:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Fresh products are subject to availability</li>
              <li>We follow all food safety regulations</li>
              <li>Products are sold "as is" with no warranty beyond statutory requirements</li>
              <li>Contact us immediately if you receive damaged or defective products</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content on our website, including text, images, logos, and software, is owned by 
              AfroMart Sydney or our licensors and is protected by intellectual property laws. 
              You may not use our content without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law, AfroMart Sydney shall not be liable for 
              any indirect, incidental, special, or consequential damages arising from your use of 
              our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of New South Wales, Australia. Any disputes shall be 
              subject to the exclusive jurisdiction of the courts of New South Wales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of our services constitutes acceptance 
              of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms, please contact us:
            </p>
            <ul className="list-none space-y-2 text-gray-700">
              <li>📧 Email: <a href="mailto:hello@afromartsydney.com.au" className="text-orange-600 hover:underline">hello@afromartsydney.com.au</a></li>
              <li>📞 Phone: <a href="tel:+61299999999" className="text-orange-600 hover:underline">(02) 9999 9999</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
