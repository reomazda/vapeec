import React from 'react'
import { useCartStore } from '@/stores/cart'

type Product = {
  id: string
  title: string
  thumbnail?: string
  description?: string
  handle?: string
  variants?: { id: string; title: string; prices?: { amount: number; currency_code: string }[] }[]
}

export default function ProductCard({ product, labelAdd = 'Add to Cart' }: { product: Product, labelAdd?: string }) {
  const add = useCartStore((s) => s.add)
  const price = product.variants?.[0]?.prices?.[0]
  const amount = price ? (price.amount / 100).toFixed(2) + ' ' + price.currency_code?.toUpperCase() : ''
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-sm transition">
      <a href={`/products/${product.id}`}>
        <img src={product.thumbnail || '/placeholder.png'} alt={product.title} className="w-full aspect-[4/3] object-cover" />
        <div className="p-4">
          <h3 className="font-medium line-clamp-1">{product.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
        </div>
      </a>
      <div className="p-4 flex items-center justify-between">
        <span className="font-semibold">{amount}</span>
        <button onClick={() => add({ id: product.id, title: product.title, price: price?.amount || 0, currency: price?.currency_code || 'jpy', image: product.thumbnail })} className="px-3 py-2 rounded bg-primary-600 text-white text-sm">{labelAdd}</button>
      </div>
    </div>
  )
}
