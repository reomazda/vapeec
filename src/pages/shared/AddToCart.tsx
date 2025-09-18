import React, { useEffect } from 'react'
import { useCartStore } from '@/stores/cart'

export default function AddToCart({ id, title, price, currency, image, label = 'Add to Cart' }: { id: string; title: string; price: number; currency: string; image?: string, label?: string }) {
  const add = useCartStore((s) => s.add)
  const hydrate = useCartStore((s) => s.hydrate)
  useEffect(() => { hydrate() }, [hydrate])
  return (
    <button className="px-4 py-2 rounded bg-primary-600 text-white" onClick={() => add({ id, title, price, currency, image })}>
      {label}
    </button>
  )
}
