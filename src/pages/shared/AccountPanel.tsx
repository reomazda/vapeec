import React, { useEffect, useState } from 'react'
import { getMe, logoutCustomer } from '@/lib/medusa'

export default function AccountPanel() {
  const [me, setMe] = useState<any>(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    getMe().then((r) => setMe(r.customer || r)).catch(() => setErr('Not logged in'))
  }, [])
  const logout = async () => { await logoutCustomer(); window.location.reload() }
  if (err) return <p className="text-gray-600">{err}</p>
  if (!me) return <p className="text-gray-600">Loading...</p>
  return (
    <div className="border rounded p-4 max-w-md">
      <div className="font-medium">{me.first_name} {me.last_name}</div>
      <div className="text-sm text-gray-600">{me.email}</div>
      <button onClick={logout} className="mt-3 px-3 py-2 rounded border">Logout</button>
    </div>
  )
}

