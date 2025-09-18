const MEDUSA_URL = import.meta.env.PUBLIC_MEDUSA_URL || 'http://localhost:9000'

function asJson<T = any>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as any
}

export async function storeCreateCart() {
  const res = await fetch(`${MEDUSA_URL}/store/carts`, { method: 'POST' })
  return asJson(res)
}

export async function storeAddLineItem(cartId: string, variant_id: string, quantity: number) {
  const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variant_id, quantity })
  })
  return asJson(res)
}

export async function storeUpdateCart(cartId: string, payload: any) {
  const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return asJson(res)
}

export async function storeListShippingOptions(cartId: string) {
  const res = await fetch(`${MEDUSA_URL}/store/shipping-options/${cartId}`)
  return asJson(res)
}

export async function storeAddShippingMethod(cartId: string, option_id: string) {
  const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/shipping-methods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ option_id })
  })
  return asJson(res)
}

export async function storeCreatePaymentSessions(cartId: string) {
  const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/payment-sessions`, { method: 'POST' })
  return asJson(res)
}

export async function storeSelectPaymentSession(cartId: string, provider_id: string) {
  const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/payment-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider_id })
  })
  return asJson(res)
}

export async function storeCompleteCart(cartId: string) {
  const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, { method: 'POST' })
  return asJson(res)
}

