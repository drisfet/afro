const Hero = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white">
      <div className="content-container py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Authentic African Groceries
          </h1>
          <p className="text-lg md:text-xl mb-8 leading-relaxed">
            Sydney's premier destination for authentic African products. Order online and get 
            same-day delivery to your door! Special discounts available for first-time orders.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 inline-block">
            <p className="text-xl font-semibold mb-2">🏪 Physical Store Coming Soon!</p>
            <p className="text-sm">Stay tuned for our Sydney location opening</p>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Shop on the go
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              disabled
              className="flex items-center gap-3 px-6 py-3 bg-black/50 text-white rounded-lg cursor-not-allowed opacity-60"
            >
              <span className="text-2xl">🍎</span>
              <div className="text-left">
                <div className="text-xs">Coming Soon</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </button>
            <button 
              disabled
              className="flex items-center gap-3 px-6 py-3 bg-black/50 text-white rounded-lg cursor-not-allowed opacity-60"
            >
              <span className="text-2xl">🤖</span>
              <div className="text-left">
                <div className="text-xs">Coming Soon</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-8 fill-white">
          <path d="M0,40 C240,90 480,10 720,40 C960,70 1200,0 1440,40 L1440,80 L0,80 Z"></path>
        </svg>
      </div>
    </div>
  )
}

export default Hero
