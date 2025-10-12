# AfroMart Sydney - Mobile-First Implementation Guide
## Quick Start for Development Team

**Based on**: UI_UX_ASSESSMENT_REPORT.md  
**Timeline**: 12 weeks (phased approach)  
**Priority**: Mobile-first, incremental improvements  

---

## Phase 1: Foundation (Weeks 1-2) 🎯

### ⚠️ IMPORTANT: Package Manager

**This project uses YARN, not npm!** See `PACKAGE_MANAGER_GUIDE.md` for details.

### Setup Commands

```bash
cd /workspaces/afro/afro-store-storefront

# Install shadcn/ui dependencies
yarn add clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-toast @radix-ui/react-scroll-area cmdk

# Install TanStack Query
yarn add @tanstack/react-query

# Install Vercel AI SDK
yarn add ai @ai-sdk/openai @ai-sdk/anthropic zod

# Install animation library
yarn add framer-motion
```

### Tawk.to Integration

1. Sign up at https://www.tawk.to/
2. Get your property ID
3. Add to `/src/app/layout.tsx`:

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="tawk-to" strategy="lazyOnload">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
```

### TanStack Query Setup

Create `/src/providers/query-provider.tsx`:

```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

Add to root layout:

```tsx
import { QueryProvider } from '@/providers/query-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
```

---

## Core Component Updates

### 1. Mobile Navigation with Sheet Drawer

Create `/src/components/mobile-nav.tsx`:

```tsx
'use client'

import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4 mt-4">
          {/* Add navigation items */}
          <a href="/categories" className="text-lg font-semibold">Categories</a>
          <a href="/deals" className="text-lg font-semibold">Deals</a>
          <a href="/new-arrivals" className="text-lg font-semibold">New Arrivals</a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

### 2. Cart Drawer

Create `/src/components/cart-drawer.tsx`:

```tsx
'use client'

import { ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export function CartDrawer({ cart }) {
  const itemCount = cart?.items?.length || 0
  const total = cart?.total || 0

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 -mx-6 px-6">
          {/* Cart items here */}
        </ScrollArea>

        <SheetFooter className="border-t pt-4">
          <div className="w-full space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" asChild>
              <a href="/checkout">Proceed to Checkout</a>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

### 3. Toast Notification System

Create `/src/components/toast-provider.tsx`:

```tsx
'use client'

import { Toaster } from '@/components/ui/toaster'

export function ToastProvider() {
  return <Toaster />
}
```

Add to layout and use throughout app:

```tsx
import { useToast } from '@/components/ui/use-toast'

function AddToCartButton({ productId }) {
  const { toast } = useToast()

  const handleAddToCart = async () => {
    try {
      await addToCart(productId)
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      })
    }
  }

  return <Button onClick={handleAddToCart}>Add to Cart</Button>
}
```

---

## Phase 2: Enhanced UX (Weeks 3-4) 🚀

### Command Palette Search

```bash
# Install Radix UI command component (already installed)
# cmdk is already added in Phase 1
```

Create `/src/components/search-command.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export function SearchCommand() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search products...</span>
        <kbd className="pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search products..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Products">
            {/* Product search results */}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
```

---

## Phase 3: AI Integration (Weeks 5-6) 🤖

### API Key Settings Page

Create `/src/app/settings/ai/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AISettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [provider, setProvider] = useState('openai')

  const handleSave = async () => {
    localStorage.setItem('ai_api_key', apiKey)
    localStorage.setItem('ai_provider', provider)
    // Show success toast
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant Settings</CardTitle>
          <CardDescription>
            Configure your AI assistant with your own API key. Your key is stored locally and never sent to our servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger id="provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                <SelectItem value="google">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{' '}
              {provider === 'openai' && <a href="https://platform.openai.com" target="_blank" className="underline">OpenAI Platform</a>}
              {provider === 'anthropic' && <a href="https://console.anthropic.com" target="_blank" className="underline">Anthropic Console</a>}
              {provider === 'google' && <a href="https://makersuite.google.com" target="_blank" className="underline">Google AI Studio</a>}
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### AI Search API Route

Create `/src/app/api/ai/search/route.ts`:

```ts
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { NextRequest } from 'next/server'

const searchResultSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    relevance: z.number(),
    reason: z.string(),
  })),
})

export async function POST(req: NextRequest) {
  const { query, apiKey, products } = await req.json()

  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 400 })
  }

  try {
    const result = await generateObject({
      model: openai(apiKey, 'gpt-4o-mini'),
      schema: searchResultSchema,
      prompt: `Given this natural language query: "${query}"
      
      And these products:
      ${JSON.stringify(products)}
      
      Return the most relevant product IDs with relevance scores (0-1) and reasons.`,
    })

    return Response.json(result.object)
  } catch (error) {
    return Response.json({ error: 'AI search failed' }, { status: 500 })
  }
}
```

---

## Environment Variables

Create `.env.local`:

```bash
# MedusaJS Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Optional: Admin fallback API key (for demos)
ADMIN_AI_API_KEY=
ADMIN_AI_DAILY_LIMIT=1000

# Tawk.to
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_property_id

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=
```

---

## Testing Checklist

### Mobile Testing
- [ ] iPhone SE (375px) - smallest target
- [ ] iPhone 13 Pro (390px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] iPad Mini (768px)
- [ ] Test on actual devices, not just Chrome DevTools

### Performance Testing
- [ ] Run Lighthouse on mobile
- [ ] Check Core Web Vitals
- [ ] Test on slow 3G connection
- [ ] Verify images are optimized

### Functionality Testing
- [ ] Cart operations (add, update, remove)
- [ ] Search with and without AI
- [ ] Navigation drawer on mobile
- [ ] Toast notifications
- [ ] Live chat widget loads
- [ ] Checkout flow complete

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/mobile-navigation

# Make changes
git add .
git commit -m "feat: add mobile navigation with sheet drawer"

# Push and create PR
git push origin feature/mobile-navigation
```

### Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `test:` Tests
- `chore:` Maintenance

---

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
yarn global add vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

---

## Support & Resources

### Documentation
- Full Assessment: `/workspaces/afro/UI_UX_ASSESSMENT_REPORT.md`
- MedusaJS Docs: https://docs.medusajs.com/
- shadcn/ui: https://ui.shadcn.com/
- Vercel AI SDK: https://sdk.vercel.ai/
- TanStack Query: https://tanstack.com/query/

### Community
- MedusaJS Discord: https://discord.gg/medusajs
- GitHub Discussions: File issues and questions

### Contact
- Project Owner: dRof
- Report Issues: GitHub Issues
- Live Chat: Tawk.to (once integrated)

---

## Quick Wins (Prioritize These First)

1. **Mobile Navigation** - Immediate UX improvement
2. **Cart Drawer** - Better mobile cart experience
3. **Toast Notifications** - User feedback on actions
4. **Loading States** - Professional feel
5. **Tawk.to Chat** - Customer support ready

Start with these and iterate based on user feedback!

---

**Last Updated**: October 12, 2025  
**Version**: 1.0  
**Status**: Ready for Development ✅
