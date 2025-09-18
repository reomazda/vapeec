import React, { useState } from 'react'
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/i18n/config'
import { localizePath } from '@/i18n/utils'

export default function LangSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)

  const onSelect = (l: Locale) => {
    const next = localizePath(window.location.pathname, l)
    window.location.assign(next)
  }

  return (
    <div className="relative">
      <button className="px-2 py-1 rounded border text-sm" onClick={() => setOpen((v) => !v)}>
        {LOCALE_LABELS[locale]}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow text-sm min-w-[8rem]">
          {SUPPORTED_LOCALES.map((l) => (
            <button key={l} className="block w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => onSelect(l as Locale)}>
              {LOCALE_LABELS[l as Locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

