# Quick Start Guide

Get Afro e-commerce platform running in 5 minutes!

## Prerequisites

- Node.js v20+ installed
- PostgreSQL running
- Redis running

## Steps

### 1. Clone and Install

```bash
git clone https://github.com/drisfet/afro.git
cd afro
npm install
```

### 2. Setup Backend

```bash
cd backend
cp .env.template .env
```

Edit `.env` with your database URL:
```env
DATABASE_URL=postgres://localhost/medusa-store
REDIS_URL=redis://localhost:6379
```

Run migrations:
```bash
npx medusa migrations run
```

### 3. Setup Storefront

```bash
cd ../storefront
cp .env.template .env.local
```

The default settings should work:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### 4. Start Development

From the root directory:
```bash
npm run dev
```

**That's it!** 🎉

- Backend: http://localhost:9000
- Storefront: http://localhost:8000
- Admin: http://localhost:9000/app

## Next Steps

1. Create an admin user:
   ```bash
   cd backend
   npx medusa user -e admin@example.com -p admin123
   ```

2. Visit http://localhost:8000 to see the storefront

3. Visit http://localhost:9000/app to access the admin dashboard

## Troubleshooting

**Database error?**
```bash
createdb medusa-store
```

**Port in use?**
Change port in package.json files

**Module errors?**
```bash
rm -rf node_modules
npm install
```

## Full Documentation

- [Complete Setup Guide](SETUP.md)
- [Architecture Documentation](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
