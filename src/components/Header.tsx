import React from 'react'
import { ShoppingCart } from './icons'
import { useCartStore } from '@/stores/cart'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import LangSwitcher from './LangSwitcher'
import type { Locale } from '@/i18n/config'

export default function Header({ locale, labels }: { locale: Locale, labels: { siteName: string, nav: { products: string, blog: string, cart: string } } }) {
  const count = useCartStore((s) => s.items.reduce((a, b) => a + b.quantity, 0))
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={clsx('sticky top-0 z-40 bg-white/80 backdrop-blur border-b', scrolled && 'shadow-sm') }>
      <div className="container flex items-center justify-between h-14">
        <a href={`/${locale}`} className="font-semibold text-lg">{labels.siteName}</a>
        <nav className="flex gap-4 items-center">
          <a href={`/${locale}/products`} className="hover:underline">{labels.nav.products}</a>
          <a href={`/${locale}/blog`} className="hover:underline">{labels.nav.blog}</a>
          <a href={`/${locale}/account`} className="hover:underline">{labels.nav.account || 'Account'}</a>
          <a href={`/${locale}/cart`} className="relative inline-flex items-center gap-2">
            <ShoppingCart />
            <span>{labels.nav.cart}</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 text-xs bg-primary-600 text-white rounded-full h-5 w-5 grid place-items-center">{count}</span>
            )}
          </a>
          <LangSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  )
}
