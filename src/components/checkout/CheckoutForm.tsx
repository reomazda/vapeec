import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useCartStore } from '@/stores/cart'
import { retrieveProduct } from '@/lib/api'
import {
  storeCreateCart,
  storeAddLineItem,
  storeUpdateCart,
  storeListShippingOptions,
  storeAddShippingMethod,
  storeCreatePaymentSessions,
  storeSelectPaymentSession,
  storeCompleteCart,
} from '@/lib/medusa-store'

type Address = {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  postal_code: string
  city: string
  country_code: string
  phone?: string
}

export default function CheckoutForm({ locale = 'ja' }: { locale?: string }) {
  const { items, hydrate, clear } = useCartStore()
  useEffect(() => { hydrate() }, [hydrate])

  const [email, setEmail] = useState('')
  const [addr, setAddr] = useState<Address>({
    first_name: '',
    last_name: '',
    address_1: '',
    postal_code: '',
    city: '',
    country_code: 'jp',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = useMemo(() => items.reduce((a, b) => a + b.price * b.quantity, 0), [items])
  const currency = items[0]?.currency?.toUpperCase() || 'JPY'

  const placeOrder = useCallback(async () => {
    setSubmitting(true)
    setError(null)
    try {
      if (items.length === 0) throw new Error('カートが空です')

      // 1) Create Medusa cart
      const { cart } = await storeCreateCart()

      // 2) Add line items (resolve product -> default variant)
      for (const i of items) {
        const prod = await retrieveProduct(i.id)
        const variant = prod.variants?.[0]
        if (!variant?.id) throw new Error('商品バリエーションが見つかりません')
        await storeAddLineItem(cart.id, variant.id, i.quantity)
      }

      // 3) Set email + addresses
      await storeUpdateCart(cart.id, {
        email,
        shipping_address: addr,
        billing_address: addr,
      })

      // 4) Shipping option (pick first available)
      const { shipping_options } = await storeListShippingOptions(cart.id)
      if (shipping_options?.length) {
        await storeAddShippingMethod(cart.id, shipping_options[0].id)
      }

      // 5) Manual payment session
      const sessions = await storeCreatePaymentSessions(cart.id)
      // Prefer 'manual' if present; otherwise pick the first provider
      const providers: string[] = sessions?.cart?.payment_sessions?.map((s: any) => s.provider_id) || []
      const chosen = providers.includes('manual') ? 'manual' : (providers[0] || 'manual')
      await storeSelectPaymentSession(cart.id, chosen)

      // 6) Complete cart -> order
      const completed = await storeCompleteCart(cart.id)

      // 7) Clear local cart and go to success page with order info
      clear()
      const orderId = completed?.data?.id || completed?.order?.id || completed?.id
      const url = `/${locale}/checkout/success${orderId ? `?order=${encodeURIComponent(orderId)}` : ''}`
      window.location.assign(url)
    } catch (e: any) {
      setError(e?.message || '注文処理に失敗しました')
      setSubmitting(false)
    }
  }, [addr, clear, email, items, locale])

  if (items.length === 0) return <p className="text-gray-600">カートは空です。</p>

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">お客様情報</h2>
        <input className="w-full border rounded px-3 py-2" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="姓" value={addr.last_name} onChange={(e) => setAddr({ ...addr, last_name: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="名" value={addr.first_name} onChange={(e) => setAddr({ ...addr, first_name: e.target.value })} />
        </div>
        <input className="w-full border rounded px-3 py-2" placeholder="住所1" value={addr.address_1} onChange={(e) => setAddr({ ...addr, address_1: e.target.value })} />
        <input className="w-full border rounded px-3 py-2" placeholder="住所2 (任意)" value={addr.address_2 || ''} onChange={(e) => setAddr({ ...addr, address_2: e.target.value })} />
        <div className="grid grid-cols-3 gap-3">
          <input className="border rounded px-3 py-2" placeholder="郵便番号" value={addr.postal_code} onChange={(e) => setAddr({ ...addr, postal_code: e.target.value })} />
          <input className="border rounded px-3 py-2 col-span-2" placeholder="市区町村" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
        </div>
        <input className="w-full border rounded px-3 py-2" placeholder="電話番号 (任意)" value={addr.phone || ''} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">ご注文内容</h2>
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3 border p-3 rounded">
              <img src={i.image || '/placeholder.png'} alt={i.title} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">{i.title}</div>
                <div className="text-sm text-gray-600">{i.quantity} × {(i.price/100).toFixed(0)} {currency}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between font-semibold">
          <span>小計</span>
          <span>{(total/100).toLocaleString()} {currency}</span>
        </div>
        <button disabled={submitting} onClick={placeOrder} className="mt-6 w-full px-4 py-3 rounded bg-primary-600 text-white">
          {submitting ? '処理中...' : '注文を確定（銀行振込）'}
        </button>
        <p className="text-xs text-gray-500 mt-2">ご注文確定後、振込先のご案内を表示・メール送付します。お支払い確認後に発送いたします。</p>
      </div>
    </div>
  )
}
