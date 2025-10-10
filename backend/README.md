# Afro Backend - Medusa E-commerce API

This is the backend service for the Afro e-commerce platform, powered by Medusa.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (copy from .env.template)

3. Run migrations:
```bash
npx medusa migrations run
```

4. Start the server:
```bash
npm run dev
```

The API will be available at http://localhost:9000

## Admin Dashboard

Access the admin dashboard at http://localhost:9000/app

Default credentials after seeding:
- Email: admin@medusa-test.com
- Password: supersecret

## API Documentation

The API documentation is available at http://localhost:9000/docs

## Configuration

All configuration is done in `medusa-config.js`. Key settings include:

- Database connection
- Redis connection
- CORS settings
- Plugin configurations
- JWT secrets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed the database with sample data
