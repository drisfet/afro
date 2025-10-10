# Setup Guide

This guide will walk you through setting up the Afro e-commerce platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v20.x or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (v10.x or higher)
   - Comes with Node.js
   - Verify installation: `npm --version`

3. **PostgreSQL** (v12 or higher)
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

4. **Redis** (v6 or higher)
   - macOS: `brew install redis`
   - Ubuntu: `sudo apt-get install redis-server`
   - Windows: Use [WSL](https://redis.io/docs/getting-started/installation/install-redis-on-windows/) or Docker

### Optional Tools

- **Docker**: For containerized development
- **Stripe CLI**: For testing webhook events locally

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/drisfet/afro.git
cd afro
```

### 2. Install Dependencies

Install all dependencies for the monorepo:

```bash
npm install
```

This will install dependencies for both the backend and storefront.

### 3. Start PostgreSQL

Ensure PostgreSQL is running:

```bash
# macOS/Linux
sudo service postgresql start

# or if using Homebrew on macOS
brew services start postgresql
```

Create the database:

```bash
createdb medusa-store
```

### 4. Start Redis

Ensure Redis is running:

```bash
# macOS/Linux
redis-server

# or if using Homebrew on macOS
brew services start redis
```

### 5. Configure Backend

Navigate to the backend directory:

```bash
cd backend
```

Copy the environment template:

```bash
cp .env.template .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgres://localhost/medusa-store
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secure_random_string_here
COOKIE_SECRET=your_secure_random_string_here
STORE_CORS=http://localhost:8000,http://localhost:3000
ADMIN_CORS=http://localhost:7001,http://localhost:7000
```

For JWT and Cookie secrets, generate random strings:

```bash
# Generate secure random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Run Database Migrations

```bash
npx medusa migrations run
```

### 7. Create Admin User

```bash
npx medusa user -e admin@example.com -p supersecret
```

Replace with your desired email and password.

### 8. Configure Storefront

Navigate to the storefront directory:

```bash
cd ../storefront
```

Copy the environment template:

```bash
cp .env.template .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### 9. Start the Application

From the root directory, start both services:

```bash
cd ..
npm run dev
```

Or start them separately:

**Backend (Terminal 1):**
```bash
npm run backend:dev
```

**Storefront (Terminal 2):**
```bash
npm run storefront:dev
```

## Verify Installation

### Backend
- API: http://localhost:9000
- Admin Dashboard: http://localhost:9000/app
- API Docs: http://localhost:9000/docs

### Storefront
- Website: http://localhost:8000

## Setting Up Stripe (Optional)

1. Create a Stripe account at [stripe.com](https://stripe.com)

2. Get your API keys from the Stripe Dashboard

3. Add to `backend/.env`:
```env
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. Add to `storefront/.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

5. Install Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:9000/stripe/hooks
```

## Common Issues

### Port Already in Use

If ports 9000 or 8000 are already in use, you can change them:

**Backend**: Edit `package.json` in backend workspace
**Storefront**: Edit `package.json` in storefront workspace

### Database Connection Error

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Try creating the database manually: `createdb medusa-store`

### Redis Connection Error

- Ensure Redis is running: `redis-cli ping` (should return "PONG")
- Check Redis URL in `.env`

### Module Not Found

- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## Next Steps

- Read the main [README.md](../README.md) for more information
- Check out the [Medusa documentation](https://docs.medusajs.com/)
- Explore the [Next.js documentation](https://nextjs.org/docs)

## Getting Help

If you encounter issues:
1. Check this guide again carefully
2. Search for the error message online
3. Check the Medusa Discord community
4. Open an issue on GitHub
