import React from 'react'
import type { Locale } from '@/i18n/config'

export default function Footer({ labels, locale }: { labels: { privacy: string, terms: string, sitemap: string }, locale: Locale }) {
  return (
    <footer className="border-t mt-16">
      <div className="container py-8 text-sm text-gray-600 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Vape Import EC</p>
        <nav className="flex gap-4">
          <a href={`/${locale}/privacy`} className="hover:underline">{labels.privacy}</a>
          <a href={`/${locale}/terms`} className="hover:underline">{labels.terms}</a>
          <a href="/sitemap.xml" className="hover:underline">{labels.sitemap}</a>
        </nav>
      </div>
    </footer>
  )
}
