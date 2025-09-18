const MEDUSA_URL = import.meta.env.PUBLIC_MEDUSA_URL || 'http://localhost:9000'

async function storeFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    credentials: 'include'
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

export async function registerCustomer(input: { email: string; password: string; first_name?: string; last_name?: string }) {
  return storeFetch('/store/customers', { method: 'POST', body: JSON.stringify(input) })
}

export async function loginCustomer(input: { email: string; password: string }) {
  return storeFetch('/store/auth', { method: 'POST', body: JSON.stringify(input) })
}

export async function getMe() {
  return storeFetch('/store/auth')
}

export async function logoutCustomer() {
  return storeFetch('/store/auth/logout', { method: 'POST' })
}

