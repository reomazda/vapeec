export async function createCheckoutSession(items: { id: string; title: string; price: number; currency: string; quantity: number }[]) {
  const res = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  })
  if (!res.ok) throw new Error('Failed to create checkout session')
  return res.json() as Promise<{ id: string; url: string }>
}

