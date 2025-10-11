import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund and Returns Policy - AfroMart Sydney",
  description: "Read our refund and returns policy for AfroMart Sydney products.",
}

export default function RefundPolicyPage() {
  return (
    <div className="content-container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Refund and Returns Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment to Quality</h2>
            <p className="text-gray-700 mb-4">
              At AfroMart Sydney, we are committed to providing high-quality African groceries 
              and products. We understand that sometimes issues may arise, and we're here to help.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Returns Policy</h2>
            <h3 className="text-xl font-semibold mb-3">Eligible Returns</h3>
            <p className="text-gray-700 mb-4">
              You may return products in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Products are damaged or defective upon arrival</li>
              <li>Wrong items were delivered</li>
              <li>Products are past their expiry date at time of delivery</li>
              <li>Products are significantly different from description</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Non-Returnable Items</h3>
            <p className="text-gray-700 mb-4">
              For health and safety reasons, the following items cannot be returned:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Fresh produce, meat, and seafood (unless defective)</li>
              <li>Opened or used products</li>
              <li>Products without original packaging</li>
              <li>Perishable goods after delivery</li>
              <li>Personal care items that have been opened</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Return Time Frame</h2>
            <p className="text-gray-700 mb-4">
              You must notify us of any issues within:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>24 hours</strong> for fresh and perishable items</li>
              <li><strong>7 days</strong> for non-perishable items</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Please contact us as soon as possible if you receive damaged, defective, or incorrect products.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Return Products</h2>
            <p className="text-gray-700 mb-4">
              To initiate a return:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
              <li>Contact us immediately:
                <ul className="list-none ml-6 mt-2 space-y-1">
                  <li>📧 Email: <a href="mailto:hello@afromartsydney.com.au" className="text-orange-600 hover:underline">hello@afromartsydney.com.au</a></li>
                  <li>📞 Phone: <a href="tel:+61299999999" className="text-orange-600 hover:underline">(02) 9999 9999</a></li>
                </ul>
              </li>
              <li>Provide your order number and details of the issue</li>
              <li>Take photos of damaged or defective products if applicable</li>
              <li>Wait for our team to review and approve your return request</li>
              <li>Follow the instructions provided by our team</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Refund Options</h2>
            <p className="text-gray-700 mb-4">
              Once your return is approved, you may choose from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Full Refund:</strong> Money returned to your original payment method</li>
              <li><strong>Store Credit:</strong> Credit towards future purchases</li>
              <li><strong>Replacement:</strong> We'll send you a replacement product</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Refund Processing Time</h2>
            <p className="text-gray-700 mb-4">
              Refunds will be processed within:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>24-48 hours for store credit</li>
              <li>5-10 business days for refunds to your original payment method</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Please note that your bank or credit card company may take additional time to process the refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Damaged or Defective Products</h2>
            <p className="text-gray-700 mb-4">
              If you receive damaged or defective products:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Do not consume or use the product</li>
              <li>Contact us immediately with photos</li>
              <li>Keep the product and packaging for inspection if required</li>
              <li>We will arrange for replacement or refund promptly</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Wrong Items Delivered</h2>
            <p className="text-gray-700 mb-4">
              If you receive incorrect items:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Contact us within 24 hours</li>
              <li>We will arrange to collect the incorrect items</li>
              <li>We will deliver the correct items at no extra charge</li>
              <li>Or provide a full refund if you prefer</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Missing Items</h2>
            <p className="text-gray-700 mb-4">
              If items are missing from your delivery:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Contact us within 24 hours</li>
              <li>Provide your order number and details of missing items</li>
              <li>We will either deliver the missing items or refund the amount</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Delivery Issues</h2>
            <p className="text-gray-700 mb-4">
              If you experience delivery problems:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Late delivery: Contact us for assistance</li>
              <li>Non-delivery: We will investigate and redeliver or refund</li>
              <li>Unable to accept delivery: Contact us to reschedule</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Australian Consumer Law</h2>
            <p className="text-gray-700 mb-4">
              Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. 
              You are entitled to a replacement or refund for a major failure and compensation for any 
              other reasonably foreseeable loss or damage. You are also entitled to have the goods 
              repaired or replaced if the goods fail to be of acceptable quality and the failure does 
              not amount to a major failure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For all returns and refund inquiries:
            </p>
            <ul className="list-none space-y-2 text-gray-700">
              <li>📧 Email: <a href="mailto:hello@afromartsydney.com.au" className="text-orange-600 hover:underline">hello@afromartsydney.com.au</a></li>
              <li>📞 Phone: <a href="tel:+61299999999" className="text-orange-600 hover:underline">(02) 9999 9999</a></li>
              <li>⏰ Hours: Monday-Friday: 9 AM - 6 PM, Saturday: 9 AM - 5 PM</li>
            </ul>
          </section>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mt-8">
            <p className="font-semibold mb-2">Need Immediate Assistance?</p>
            <p className="text-gray-700">
              If you have received damaged, defective, or incorrect products, please contact us 
              immediately at <a href="tel:+61299999999" className="text-orange-600 hover:underline font-semibold">(02) 9999 9999</a>. 
              We're here to help resolve any issues quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
