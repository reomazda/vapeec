import React, { useState } from 'react'
import { loginCustomer, registerCustomer } from '@/lib/medusa'

export default function AuthForm({ mode = 'login', labels }: { mode: 'login' | 'register', labels: { email: string; password: string; firstName: string; lastName: string; submit: string; switchTo: string; success: string } }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirst] = useState('')
  const [lastName, setLast] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      if (mode === 'login') await loginCustomer({ email, password })
      else await registerCustomer({ email, password, first_name: firstName, last_name: lastName })
      setMsg(labels.success)
      setTimeout(() => (window.location.href = window.location.pathname.replace(/\/account\/.+$/, '/account')), 600)
    } catch (e) {
      setMsg('Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md grid gap-3">
      {mode === 'register' && (
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder={labels.firstName} value={firstName} onChange={(e) => setFirst(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder={labels.lastName} value={lastName} onChange={(e) => setLast(e.target.value)} />
        </div>
      )}
      <input type="email" className="border rounded px-3 py-2" placeholder={labels.email} value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" className="border rounded px-3 py-2" placeholder={labels.password} value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button disabled={loading} className="px-4 py-2 rounded bg-primary-600 text-white disabled:opacity-60">{labels.submit}</button>
      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </form>
  )
}

