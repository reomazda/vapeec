import React, { useEffect } from 'react'
import { useCartStore } from '@/stores/cart'

export default function CartView() {
  const { items, hydrate, updateQty, remove, clear } = useCartStore()
  useEffect(() => { hydrate() }, [hydrate])
  const total = items.reduce((a, b) => a + b.price * b.quantity, 0)
  const currency = items[0]?.currency?.toUpperCase() || 'JPY'

  const checkout = async () => {
    try {
      const segs = window.location.pathname.split('/').filter(Boolean)
      const locale = segs[0] || 'ja'
      window.location.assign(`/${locale}/checkout`)
    } catch {
      window.location.assign('/ja/checkout')
    }
  }

  if (items.length === 0) return <p className="text-gray-600">カートは空です。</p>

  return (
    <div className="grid gap-4">
      {items.map((i) => (
        <div key={i.id} className="flex items-center gap-4 border p-3 rounded">
          <img src={i.image || '/placeholder.png'} alt={i.title} className="w-16 h-16 object-cover rounded" />
          <div className="flex-1">
            <div className="font-medium">{i.title}</div>
            <div className="text-sm text-gray-600">{(i.price/100).toFixed(2)} {currency}</div>
          </div>
          <input type="number" min={1} value={i.quantity} onChange={(e) => updateQty(i.id, Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
          <button onClick={() => remove(i.id)} className="text-sm text-red-600">削除</button>
        </div>
      ))}
      <div className="flex items-center justify-between py-4">
        <div className="font-semibold">合計: {(total/100).toFixed(2)} {currency}</div>
        <div className="flex gap-2">
          <button onClick={clear} className="px-4 py-2 rounded border">クリア</button>
          <button onClick={checkout} className="px-4 py-2 rounded bg-primary-600 text-white">チェックアウト</button>
        </div>
      </div>
    </div>
  )
}
