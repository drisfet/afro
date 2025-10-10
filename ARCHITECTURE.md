# Architecture Documentation

## Overview

Afro is a modern e-commerce platform built using a headless commerce architecture. This document describes the system architecture, design decisions, and technical implementation.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Users/Clients                        │
└─────────────┬───────────────────────────────┬───────────────┘
              │                               │
              │                               │
        ┌─────▼─────┐                  ┌──────▼──────┐
        │ Storefront│                  │   Admin     │
        │ (Next.js) │                  │ Dashboard   │
        └─────┬─────┘                  └──────┬──────┘
              │                               │
              │         HTTP/REST             │
              │                               │
        ┌─────▼───────────────────────────────▼─────┐
        │         Medusa Backend API                │
        │         (Node.js/Express)                 │
        └─────┬─────────────────────────┬───────────┘
              │                         │
              │                         │
     ┌────────▼────────┐       ┌────────▼────────┐
     │   PostgreSQL    │       │      Redis      │
     │    Database     │       │  Cache/Events   │
     └─────────────────┘       └─────────────────┘
              │
              │
     ┌────────▼────────┐
     │     Stripe      │
     │    Payments     │
     └─────────────────┘
```

## Technology Stack

### Frontend (Storefront)
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **API Client**: Medusa JS SDK
- **Rendering**: Server-Side Rendering (SSR) + Static Generation

### Backend (API)
- **Framework**: Medusa (Express.js)
- **Language**: JavaScript/TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: TypeORM
- **API Style**: REST

### Infrastructure
- **Database**: PostgreSQL 12+
- **Cache/Queue**: Redis 6+
- **File Storage**: Local (configurable to S3)
- **Payment**: Stripe

## System Components

### 1. Storefront (Next.js)

**Purpose**: Customer-facing website

**Key Features**:
- Server-side rendering for SEO
- Responsive design
- Fast page loads
- Integration with Medusa API

**Directory Structure**:
```
storefront/
├── src/
│   ├── pages/           # Next.js pages (file-based routing)
│   ├── components/      # React components
│   │   ├── layout/     # Layout components (Header, Footer)
│   │   └── ui/         # UI components (Button, etc.)
│   ├── lib/            # Utility functions and API clients
│   └── styles/         # Global styles
├── public/             # Static assets
└── next.config.js      # Next.js configuration
```

**Routing**:
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- Future: `/products`, `/cart`, `/checkout`

### 2. Backend (Medusa)

**Purpose**: Headless commerce API

**Key Features**:
- RESTful API
- Admin dashboard
- Product management
- Order processing
- Payment integration
- Customer management

**Directory Structure**:
```
backend/
├── src/
│   ├── api/           # Custom API routes
│   ├── services/      # Business logic
│   ├── models/        # Data models
│   ├── migrations/    # Database migrations
│   └── subscribers/   # Event subscribers
├── medusa-config.js   # Medusa configuration
└── package.json
```

**API Endpoints**:
- `/store/*` - Storefront API
- `/admin/*` - Admin API
- `/app` - Admin dashboard

### 3. Database (PostgreSQL)

**Purpose**: Persistent data storage

**Schema**:
- Products
- Collections
- Customers
- Orders
- Carts
- Payments
- Shipping
- Regions

**Characteristics**:
- Relational data model
- ACID compliance
- Foreign key constraints
- Indexes for performance

### 4. Cache (Redis)

**Purpose**: Caching and event bus

**Usage**:
- Session storage
- Cache frequently accessed data
- Event bus for async operations
- Rate limiting

## Design Patterns

### 1. Headless Architecture

**Benefits**:
- Decoupled frontend and backend
- Flexibility to change frontend without affecting backend
- Multiple frontends possible (web, mobile, etc.)
- Better scalability

### 2. Monorepo Structure

**Benefits**:
- Shared configuration
- Consistent tooling
- Easy cross-project changes
- Single version control

**Implementation**:
- npm workspaces
- Separate package.json for each workspace
- Root package.json for coordination

### 3. Component-Based UI

**Benefits**:
- Reusable components
- Consistent design
- Easier testing
- Better maintainability

**Implementation**:
- React functional components
- TypeScript interfaces for props
- Tailwind CSS for styling

### 4. API-First Design

**Benefits**:
- Clear separation of concerns
- Easy to test
- Can support multiple clients
- Version control

## Data Flow

### Customer Browsing Flow

```
1. User visits storefront (Next.js)
2. Next.js fetches data from Medusa API
3. Medusa queries PostgreSQL
4. Data returned to Next.js
5. Page rendered and sent to user
```

### Order Processing Flow

```
1. Customer adds items to cart
2. Cart stored in session (Redis)
3. Customer proceeds to checkout
4. Payment processed via Stripe
5. Order created in database
6. Email notification sent
7. Order confirmation displayed
```

## Security Considerations

### Authentication
- JWT tokens for API authentication
- Secure cookie storage
- Token expiration
- Refresh token rotation

### Data Protection
- Environment variables for secrets
- HTTPS in production
- CORS configuration
- SQL injection prevention (ORM)
- XSS prevention (React escaping)

### Payment Security
- PCI compliance via Stripe
- No card data stored locally
- Webhook signature verification
- 3D Secure support

## Performance Optimization

### Frontend
- Server-side rendering
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading
- CDN for static assets

### Backend
- Database indexing
- Query optimization
- Redis caching
- Connection pooling
- Rate limiting

### Database
- Proper indexing
- Query optimization
- Regular VACUUM operations
- Read replicas for scaling

## Scalability

### Horizontal Scaling
- Stateless backend (can run multiple instances)
- Load balancer distribution
- Shared Redis for sessions
- Database connection pooling

### Vertical Scaling
- Increase server resources
- Database optimization
- Cache more aggressively

### CDN Integration
- Static assets served from CDN
- Image optimization
- Edge caching

## Monitoring & Logging

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API metrics

### Infrastructure Monitoring
- Server health
- Database performance
- Redis metrics
- Uptime monitoring

### Logging
- Application logs
- Access logs
- Error logs
- Audit logs

## Deployment Architecture

### Development
```
Local Machine
├── Backend: localhost:9000
├── Storefront: localhost:8000
├── PostgreSQL: localhost:5432
└── Redis: localhost:6379
```

### Production
```
Cloud Infrastructure
├── Backend: api.domain.com (Railway/Heroku)
├── Storefront: domain.com (Vercel)
├── PostgreSQL: Managed database
├── Redis: Managed cache
└── CDN: Cloudflare/AWS CloudFront
```

## Best Practices Implemented

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent code style
- Component documentation

### Version Control
- Git for version control
- Feature branch workflow
- Pull request reviews
- Semantic versioning

### Testing Strategy
- Unit tests for utilities
- Integration tests for API
- E2E tests for critical flows
- Manual testing checklist

### Documentation
- README with setup instructions
- Code comments for complex logic
- API documentation
- Architecture documentation

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic infrastructure setup
- ✅ Storefront pages (Home, About, Contact)
- ✅ Medusa backend configuration
- ✅ Documentation

### Phase 2 (Planned)
- Product catalog integration
- Shopping cart functionality
- Checkout process
- User authentication

### Phase 3 (Future)
- Product search
- Filtering and sorting
- Wishlist
- Product reviews

### Phase 4 (Advanced)
- Multi-language support
- Multi-currency
- Mobile apps
- Advanced analytics

## Dependencies

### Critical Dependencies
- Next.js: Frontend framework
- Medusa: Commerce platform
- PostgreSQL: Database
- Redis: Caching
- Stripe: Payments

### Development Dependencies
- TypeScript: Type checking
- Tailwind CSS: Styling
- ESLint: Code linting

## Maintenance

### Regular Tasks
- Dependency updates
- Security patches
- Database backups
- Performance monitoring
- Log review

### Monthly Tasks
- Review analytics
- Update documentation
- Dependency audit
- Performance audit

## Troubleshooting

### Common Issues
1. **Connection errors**: Check DATABASE_URL and REDIS_URL
2. **Build failures**: Clear node_modules and reinstall
3. **CORS errors**: Verify CORS configuration in backend
4. **Slow queries**: Add database indexes

### Debug Mode
- Set `DEBUG=*` for detailed logs
- Check browser console for frontend errors
- Review backend logs for API issues

## References

- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Stripe Documentation](https://stripe.com/docs)

---

Last Updated: 2025-10-10
