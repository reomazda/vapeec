import type { APIRoute } from 'astro'
import Stripe from 'stripe'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const items: { id: string; title: string; price: number; currency: string; quantity: number }[] = body.items || []
    if (!items.length) return new Response(JSON.stringify({ error: 'No items' }), { status: 400 })

    const key = process.env.STRIPE_SECRET_KEY
    if (!key) return new Response(JSON.stringify({ error: 'STRIPE_SECRET_KEY not set' }), { status: 500 })
    const stripe = new Stripe(key, { apiVersion: '2024-06-20' })

    const site = process.env.SITE_URL || 'http://localhost:4321'
    const success_url = `${site}/ja/cart?success=1`
    const cancel_url = `${site}/ja/cart?canceled=1`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url,
      cancel_url,
      line_items: items.map((i) => ({
        quantity: i.quantity,
        price_data: {
          currency: i.currency.toLowerCase(),
          product_data: { name: i.title },
          unit_amount: i.price,
        },
      })),
    })

    return new Response(JSON.stringify({ id: session.id, url: session.url }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), { status: 500 })
  }
}

export const GET: APIRoute = async () => new Response('Method Not Allowed', { status: 405 })

