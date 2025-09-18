import { create } from 'zustand'

export type CartItem = {
  id: string
  title: string
  price: number // in minor unit
  currency: string
  image?: string
  quantity: number
}

type State = {
  items: CartItem[]
}

type Actions = {
  hydrate: () => void
  add: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  updateQty: (id: string, quantity: number) => void
  remove: (id: string) => void
  clear: () => void
}

const KEY = 'cart:v1'

export const useCartStore = create<State & Actions>((set, get) => ({
  items: [],
  hydrate: () => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) set({ items: JSON.parse(raw) })
    } catch {}
  },
  add: (item) => set((s) => {
    const idx = s.items.findIndex((i) => i.id === item.id)
    if (idx >= 0) {
      const next = [...s.items]
      next[idx] = { ...next[idx], quantity: next[idx].quantity + (item.quantity ?? 1) }
      persist(next)
      return { items: next }
    }
    const next = [...s.items, { ...item, quantity: item.quantity ?? 1 } as CartItem]
    persist(next)
    return { items: next }
  }),
  updateQty: (id, q) => set((s) => {
    const next = s.items.map((i) => (i.id === id ? { ...i, quantity: q } : i)).filter((i) => i.quantity > 0)
    persist(next)
    return { items: next }
  }),
  remove: (id) => set((s) => {
    const next = s.items.filter((i) => i.id !== id)
    persist(next)
    return { items: next }
  }),
  clear: () => set(() => { persist([]); return { items: [] } })
}))

function persist(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
}

