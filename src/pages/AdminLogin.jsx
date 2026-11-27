import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BUSINESS } from '@/config/business'
import { HAS_BACKEND } from '@/lib/backend'
import { useAuth } from '@/lib/auth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function AdminLogin() {
  useDocumentTitle('Owner sign in')
  const { status, isAdmin, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const from = location.state?.from?.startsWith('/admin') ? location.state.from : '/admin'

  if (!HAS_BACKEND) return <Navigate to="/admin" replace />
  if (status === 'signed-in' && isAdmin) return <Navigate to={from} replace />

  async function submit(event) {
    event.preventDefault()
    if (!form.email.trim() || !form.password) {
      setError('Enter your email and password.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await signIn(form.email.trim(), form.password)
      navigate(from, { replace: true })
    } catch (problem) {
      setError(problem.message)
      setBusy(false)
    }
  }

  return (
    <main className="container-page grid min-h-screen place-items-center py-16">
      <div className="w-full max-w-sm">
        <p className="font-display text-3xl italic">{BUSINESS.shortName}</p>
        <h1 className="mt-2 text-4xl">Owner sign in</h1>
        <form onSubmit={submit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
            <Input id="email" type="email" autoComplete="username" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} aria-describedby={error ? 'login-error' : undefined} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
            <Input id="password" type="password" autoComplete="current-password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p id="login-error" role="alert" className="text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? 'Signing in…' : 'Sign in'}</Button>
        </form>
        <Link to="/" className="mt-8 inline-block py-2 text-sm underline underline-offset-4">Back to the website</Link>
      </div>
    </main>
  )
}
