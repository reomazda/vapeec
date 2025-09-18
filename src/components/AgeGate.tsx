import React, { useEffect, useState } from 'react'

const KEY = 'ageVerified20'

export default function AgeGate() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const ok = localStorage.getItem(KEY)
      if (!ok) setOpen(true)
    } catch {}
  }, [])

  const accept = () => {
    try { localStorage.setItem(KEY, 'yes') } catch {}
    setOpen(false)
  }
  const deny = () => {
    window.location.href = 'https://www.google.com'
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center p-6">
      <div className="bg-white max-w-md w-full rounded-lg p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold">年齢確認</h2>
        <p>当サイトは20歳以上の方を対象としています。あなたは20歳以上ですか？</p>
        <div className="flex gap-3 justify-center pt-2">
          <button onClick={deny} className="px-4 py-2 rounded border">いいえ</button>
          <button onClick={accept} className="px-4 py-2 rounded bg-primary-600 text-white">はい</button>
        </div>
      </div>
    </div>
  )
}

