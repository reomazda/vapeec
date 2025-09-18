const MEDUSA_URL = import.meta.env.PUBLIC_MEDUSA_URL || 'http://localhost:9000'
const MEDUSA_ADMIN_TOKEN = import.meta.env.MEDUSA_ADMIN_TOKEN

export type MedusaProduct = {
  id: string
  title: string
  description?: string
  handle?: string
  thumbnail?: string
  variants?: { id: string; title: string; prices?: { amount: number; currency_code: string }[] }[]
}

export async function listProducts(params: Record<string, string | number> = {}) {
  try {
    const query = new URLSearchParams({
      limit: '24',
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ),
    })
    const res = await fetch(`${MEDUSA_URL}/store/products?${query}`, {
      cache: 'no-store' as any,
    })
    if (!res.ok) {
      console.warn('listProducts: non-OK response', res.status, res.statusText)
      return []
    }
    const json = await res.json()
    return (json.products || []) as MedusaProduct[]
  } catch (err) {
    console.warn('listProducts: fetch failed', err)
    return []
  }
}

export async function retrieveProduct(idOrHandle: string) {
  // try handle first
  let res = await fetch(`${MEDUSA_URL}/store/products?handle=${encodeURIComponent(idOrHandle)}`)
  if (res.ok) {
    const json = await res.json()
    if (json.products?.[0]) return json.products[0] as MedusaProduct
  }
  res = await fetch(`${MEDUSA_URL}/store/products/${idOrHandle}`)
  if (!res.ok) throw new Error('Product not found')
  const json = await res.json()
  return json.product as MedusaProduct
}

// Admin CRUD (requires MEDUSA_ADMIN_TOKEN)
async function adminFetch(path: string, init?: RequestInit) {
  if (!MEDUSA_ADMIN_TOKEN) throw new Error('MEDUSA_ADMIN_TOKEN is required')
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MEDUSA_ADMIN_TOKEN}`,
      ...(init?.headers || {})
    }
  })
  if (!res.ok) throw new Error(`Admin API error ${res.status}`)
  return res.json()
}

export async function adminCreateProduct(input: Partial<MedusaProduct>) {
  return adminFetch('/admin/products', { method: 'POST', body: JSON.stringify({ title: input.title, description: input.description, status: 'published' }) })
}

export async function adminUpdateProduct(id: string, input: Partial<MedusaProduct>) {
  return adminFetch(`/admin/products/${id}`, { method: 'POST', body: JSON.stringify(input) })
}

export async function adminDeleteProduct(id: string) {
  return adminFetch(`/admin/products/${id}`, { method: 'DELETE' })
}
