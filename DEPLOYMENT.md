# Deployment Guide

This guide covers deploying the Afro e-commerce platform to production.

## Overview

The Afro platform consists of two main parts:
1. **Backend** (Medusa) - Needs a Node.js server with PostgreSQL and Redis
2. **Storefront** (Next.js) - Can be deployed to Vercel, Netlify, or any Node.js hosting

## Prerequisites

Before deploying, ensure you have:
- Production database (PostgreSQL)
- Production Redis instance
- Stripe account with production API keys
- Domain name (optional but recommended)

## Backend Deployment

### Option 1: Railway (Recommended for beginners)

Railway offers easy deployment with PostgreSQL and Redis built-in.

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose the afro repository
   - Select the `backend` directory

3. **Add services**
   - Add PostgreSQL database
   - Add Redis service

4. **Set environment variables**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   JWT_SECRET=<generate-random-string>
   COOKIE_SECRET=<generate-random-string>
   STORE_CORS=https://your-storefront-domain.com
   ADMIN_CORS=https://your-admin-domain.com
   STRIPE_API_KEY=<your-stripe-api-key>
   STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Run migrations via Railway CLI: `railway run npx medusa migrations run`

### Option 2: Heroku

1. **Install Heroku CLI** and login

2. **Create a new Heroku app**
   ```bash
   heroku create afro-backend
   ```

3. **Add PostgreSQL and Redis**
   ```bash
   heroku addons:create heroku-postgresql:mini
   heroku addons:create heroku-redis:mini
   ```

4. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=$(openssl rand -hex 32)
   heroku config:set COOKIE_SECRET=$(openssl rand -hex 32)
   heroku config:set STORE_CORS=https://your-storefront.com
   heroku config:set STRIPE_API_KEY=your_stripe_key
   heroku config:set STRIPE_WEBHOOK_SECRET=your_webhook_secret
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

6. **Run migrations**
   ```bash
   heroku run npx medusa migrations run
   ```

### Option 3: DigitalOcean App Platform

1. **Create account** at DigitalOcean

2. **Create new app**
   - Connect GitHub repository
   - Select backend directory
   - Choose Node.js environment

3. **Add databases**
   - Add managed PostgreSQL database
   - Add managed Redis database

4. **Configure environment variables** (same as Railway)

5. **Deploy and run migrations**

### Option 4: AWS (Advanced)

For AWS deployment, you'll need:
- EC2 instance or Elastic Beanstalk
- RDS for PostgreSQL
- ElastiCache for Redis
- Application Load Balancer
- Route 53 for DNS

Refer to AWS documentation for detailed steps.

## Storefront Deployment

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

1. **Create Vercel account** at [vercel.com](https://vercel.com)

2. **Import project**
   - Click "New Project"
   - Import from GitHub
   - Select the afro repository
   - Set root directory to `storefront`

3. **Configure environment variables**
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-url.com
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

5. **Set up custom domain** (optional)
   - Go to project settings
   - Add your domain
   - Update DNS records

### Option 2: Netlify

1. **Create Netlify account**

2. **New site from Git**
   - Connect GitHub
   - Select repository
   - Set base directory to `storefront`
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment variables**
   - Add the same variables as Vercel

4. **Deploy**

### Option 3: Self-hosted

For self-hosting on your own server:

1. **Build the application**
   ```bash
   cd storefront
   npm run build
   ```

2. **Start with PM2** (process manager)
   ```bash
   npm install -g pm2
   pm2 start npm --name "afro-storefront" -- start
   pm2 save
   pm2 startup
   ```

3. **Set up Nginx** as reverse proxy
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Set up SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## Post-Deployment Checklist

### Backend
- [ ] Verify backend is accessible
- [ ] Check admin dashboard login
- [ ] Test API endpoints
- [ ] Verify database connections
- [ ] Check Redis connection
- [ ] Test Stripe webhooks
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Configure backups

### Storefront
- [ ] Verify website loads
- [ ] Test all pages
- [ ] Check mobile responsiveness
- [ ] Verify Medusa connection
- [ ] Test forms
- [ ] Check SEO meta tags
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Test on different browsers

### Security
- [ ] Use HTTPS for all domains
- [ ] Secure environment variables
- [ ] Enable CORS properly
- [ ] Use production API keys
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Regular dependency updates

## Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL=postgres://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
JWT_SECRET=<64-char-random-string>
COOKIE_SECRET=<64-char-random-string>
STORE_CORS=https://storefront.com
ADMIN_CORS=https://admin.com
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Storefront (.env.local or Vercel)
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Database Migrations

Always run migrations after deployment:

```bash
# Railway
railway run npx medusa migrations run

# Heroku
heroku run npx medusa migrations run

# SSH to server
ssh user@server
cd /path/to/backend
npx medusa migrations run
```

## Monitoring & Logging

### Recommended Services
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **New Relic**: Performance monitoring
- **Datadog**: Infrastructure monitoring

### Setting up Sentry

1. Create Sentry account
2. Install SDK:
   ```bash
   npm install @sentry/nextjs @sentry/node
   ```
3. Configure in both backend and storefront
4. Add Sentry DSN to environment variables

## Troubleshooting

### Common Issues

**Backend won't start**
- Check DATABASE_URL and REDIS_URL
- Verify migrations have run
- Check logs for errors

**Storefront can't connect**
- Verify NEXT_PUBLIC_MEDUSA_BACKEND_URL
- Check CORS settings in backend
- Ensure backend is accessible

**Stripe webhooks failing**
- Verify webhook URL in Stripe dashboard
- Check STRIPE_WEBHOOK_SECRET
- Test with Stripe CLI

## Scaling

### Database
- Enable connection pooling
- Set up read replicas
- Regular backups
- Monitor query performance

### Backend
- Horizontal scaling with load balancer
- Use Redis for caching
- CDN for static assets
- Database indexing

### Storefront
- Use CDN (Vercel/Cloudflare)
- Image optimization
- Code splitting
- Caching strategies

## Backup Strategy

### Database Backups
- Automated daily backups
- Keep 30-day retention
- Test restore process
- Store backups securely

### File Backups
- Back up uploaded files
- Version control for code
- Document configurations

## Cost Optimization

### Free Tier Options
- Vercel: Free for personal projects
- Railway: $5/month credit
- Supabase: Free PostgreSQL
- Upstash: Free Redis

### Estimated Costs (Monthly)
- Small: $20-50 (Railway + Vercel free)
- Medium: $100-200 (DigitalOcean + Vercel Pro)
- Large: $500+ (AWS with managed services)

## Support

For deployment issues:
- Check service status pages
- Review platform documentation
- Medusa Discord community
- GitHub issues

---

Good luck with your deployment! 🚀
