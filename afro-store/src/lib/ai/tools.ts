// AI Tools for Product Management

export interface Product {
  id: string
  title: string
  description?: string
  price: number
  salePrice?: number | null
  currency: string
  stock: number
  image?: string | null
  categories: string[]
  handle: string
}

export async function searchProducts(query: string, limit: number = 10): Promise<{ count: number; products: Product[] }> {
  try {
    // Simplified field selection without calculated_price to avoid currency_code requirement
    // We'll get raw variant prices instead
    const params = new URLSearchParams({ 
      q: query, 
      limit: limit.toString(), 
      fields: '+variants,+images,+categories'
    })
    const response = await fetch('/admin/products?' + params, { 
      headers: { 
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    if (!response.ok) {
      console.error('Product search failed:', response.status, await response.text())
      throw new Error('API error')
    }
    const data = await response.json()
    const products = data.products || []
    return {
      count: products.length,
      products: products.map((p: any) => ({
        id: p.id, 
        title: p.title, 
        description: p.description || '', 
        price: p.variants?.[0]?.prices?.find((pr: any) => pr.currency_code === 'aud')?.amount || 0,
        salePrice: p.metadata?.salePrice || null, 
        currency: 'aud', 
        stock: p.variants?.[0]?.inventory_quantity || 0,
        image: p.thumbnail || p.images?.[0]?.url || null, 
        categories: p.categories?.map((c: any) => c.name) || [], 
        handle: p.handle
      }))
    }
  } catch (error) { 
    console.error('searchProducts error:', error); 
    return { count: 0, products: [] } 
  }
}
