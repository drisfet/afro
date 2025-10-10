# Afro Storefront - Next.js Frontend

This is the customer-facing storefront for the Afro e-commerce platform, built with Next.js.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (copy from .env.template to .env.local)

3. Start the development server:
```bash
npm run dev
```

The storefront will be available at http://localhost:8000

## Features

- Server-side rendering for optimal SEO
- Responsive design with Tailwind CSS
- Integration with Medusa backend
- Stripe payment integration
- TypeScript for type safety

## Pages

- `/` - Home page
- `/about` - About page
- `/contact` - Contact form

## Configuration

Configuration is done through:
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS theme
- `.env.local` - Environment variables

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Styling

The project uses Tailwind CSS with a custom theme. Global styles are in `src/styles/globals.css`.

## Medusa Integration

The storefront connects to the Medusa backend using:
- `@medusajs/medusa-js` - JavaScript client
- `medusa-react` - React hooks
- `@tanstack/react-query` - Data fetching

Configuration is in `src/lib/medusa-client.ts`.
