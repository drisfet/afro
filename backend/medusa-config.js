module.exports = {
  projectConfig: {
    // Redis URL for event bus and cache
    redis_url: process.env.REDIS_URL || "redis://localhost:6379",
    
    // Database configuration
    database_url: process.env.DATABASE_URL || "postgres://localhost/medusa-store",
    database_type: "postgres",
    database_logging: true,
    
    // Store CORS configuration
    store_cors: process.env.STORE_CORS || "http://localhost:8000,http://localhost:3000",
    
    // Admin CORS configuration
    admin_cors: process.env.ADMIN_CORS || "http://localhost:7001,http://localhost:7000",
    
    // JWT Secret
    jwt_secret: process.env.JWT_SECRET || "supersecret",
    cookie_secret: process.env.COOKIE_SECRET || "supersecret",
  },
  
  plugins: [
    {
      resolve: `medusa-fulfillment-manual`,
      options: {},
    },
    {
      resolve: `medusa-payment-manual`,
      options: {},
    },
    {
      resolve: `medusa-payment-stripe`,
      options: {
        api_key: process.env.STRIPE_API_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    },
    {
      resolve: `@medusajs/file-local`,
      options: {
        upload_dir: "uploads",
      },
    },
    {
      resolve: "@medusajs/cache-inmemory",
      options: {},
    },
    {
      resolve: "@medusajs/event-bus-local",
      options: {},
    },
  ],
  
  modules: {},
};
