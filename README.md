# Afro - E-commerce Platform

A modern e-commerce platform built with Medusa (headless commerce engine) and Next.js, featuring a clean architecture and best practices in web development.

## 🎯 Project Overview

This project is structured as a monorepo containing:
- **Backend**: Medusa-powered headless commerce API
- **Storefront**: Next.js-based frontend application

The implementation focuses on creating a scalable, maintainable e-commerce solution without product items (as per specifications), emphasizing core functionalities and infrastructure.

## 🚀 Technology Stack

### Backend
- **Medusa**: Headless commerce platform (v1.20.0)
- **PostgreSQL**: Database for storing commerce data
- **Redis**: Caching and event bus
- **Stripe**: Payment processing integration
- **TypeORM**: Database ORM

### Frontend
- **Next.js 14**: React framework with server-side rendering
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Medusa React**: Official React hooks for Medusa
- **TanStack Query**: Data fetching and state management

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v20.x or higher)
- npm (v10.x or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/drisfet/afro.git
cd afro
```

### 2. Install dependencies

```bash
# Install root dependencies and workspaces
npm install
```

### 3. Set up environment variables

#### Backend (.env)
Copy the template and configure your environment:

```bash
cd backend
cp .env.template .env
```

Edit `backend/.env` with your configurations:
```env
DATABASE_URL=postgres://localhost/medusa-store
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secure_jwt_secret
COOKIE_SECRET=your_secure_cookie_secret
STRIPE_API_KEY=your_stripe_api_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

#### Storefront (.env.local)
```bash
cd ../storefront
cp .env.template .env.local
```

Edit `storefront/.env.local`:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Database Setup

Create a PostgreSQL database:

```bash
createdb medusa-store
```

Run Medusa migrations:

```bash
cd backend
npx medusa migrations run
```

### 5. Seed the database (optional)

```bash
npm run seed
```

## 🏃 Running the Application

### Development Mode

You can run both backend and storefront simultaneously:

```bash
# From the root directory
npm run dev
```

Or run them separately:

```bash
# Backend only (runs on http://localhost:9000)
npm run backend:dev

# Storefront only (runs on http://localhost:8000)
npm run storefront:dev
```

### Production Mode

```bash
# Build all workspaces
npm run build

# Start production servers
npm run start
```

## 📁 Project Structure

```
afro/
├── backend/                 # Medusa backend
│   ├── medusa-config.js    # Medusa configuration
│   ├── package.json
│   └── .env.template
├── storefront/             # Next.js frontend
│   ├── src/
│   │   ├── pages/         # Next.js pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utility functions
│   │   └── styles/       # Global styles
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🎨 Features Implemented

### Storefront Pages
- **Home Page**: Landing page with hero section and key features
- **About Page**: Information about the platform and technology stack
- **Contact Page**: Contact form for user inquiries

### Infrastructure
- **Monorepo Setup**: Organized workspace structure
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first styling with custom theme
- **Responsive Design**: Mobile-first approach
- **Medusa Integration**: Connected to headless commerce backend
- **Stripe Integration**: Ready for payment processing
- **Best Practices**: Following modern web development standards

## 🔧 Configuration

### Medusa Backend

The backend is configured with the following plugins:
- **medusa-fulfillment-manual**: Manual order fulfillment
- **medusa-payment-manual**: Manual payment method
- **medusa-payment-stripe**: Stripe payment integration
- **@medusajs/file-local**: Local file storage
- **@medusajs/cache-inmemory**: In-memory caching
- **@medusajs/event-bus-local**: Local event bus

### Next.js Storefront

Configured with:
- Server-side rendering enabled
- Image optimization for localhost and placeholder images
- Custom path aliases (@/*)
- Tailwind CSS with custom color palette

## 📚 Documentation Resources

### Medusa Documentation
- [Medusa Documentation](https://docs.medusajs.com/)
- [Medusa Next.js Starter](https://docs.medusajs.com/starters/nextjs-medusa-starter)
- [Medusa API Reference](https://docs.medusajs.com/api/store)

### Next.js Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Stripe Documentation
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Integration with Medusa](https://docs.medusajs.com/plugins/payment/stripe)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 🚢 Deployment

### Backend Deployment
The Medusa backend can be deployed to various platforms:
- Railway
- Heroku
- DigitalOcean
- AWS

Ensure you have:
- PostgreSQL database
- Redis instance
- Environment variables configured

### Storefront Deployment
The Next.js storefront can be deployed to:
- Vercel (recommended)
- Netlify
- Any platform supporting Node.js

## 🔒 Security Best Practices

- Environment variables are never committed to version control
- JWT secrets are randomly generated and secure
- Stripe API keys are kept secret
- CORS is properly configured for frontend/backend communication
- All dependencies are kept up to date

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Medusa](https://medusajs.com/) - Headless commerce platform
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Stripe](https://stripe.com/) - Payment processing

## 📞 Support

For questions or support, please:
- Open an issue on GitHub
- Contact through the website contact form
- Refer to the documentation links above

---

Built with ❤️ following best practices in web development and maximum attention to detail.