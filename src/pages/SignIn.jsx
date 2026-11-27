import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HAS_BACKEND } from '@/lib/backend'
import { useAuth } from '@/lib/auth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function SignIn() {
  useDocumentTitle('Sign in')
  const { status, sendCode, verifyCode } = useAuth()
  const [step, setStep] = useState('email') // email | code
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  if (status === 'signed-in') return <Navigate to="/account" replace />

  async function send(event) {
    event?.preventDefault()
    if (busy) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setBusy(true); setError(''); setNotice('')
    try {
      await sendCode(email.trim())
      setStep('code')
      setNotice(`We sent a sign-in email to ${email.trim()}. Enter the code or open the link in it.`)
    } catch (problem) {
      setError(problem.message)
    } finally {
      setBusy(false)
    }
  }

  async function verify(event) {
    event.preventDefault()
    if (busy) return
    if (!code.trim()) { setError('Enter the code from your email.'); return }
    setBusy(true); setError('')
    try {
      await verifyCode(email.trim(), code.trim())
    } catch (problem) {
      setError(problem.message)
      setBusy(false)
    }
  }

  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-sm">
        <p className="font-display text-3xl italic">Missche</p>
        <h1 className="mt-2 text-4xl">Sign in</h1>
        {!HAS_BACKEND ? (
          <p role="status" className="mt-6 text-muted">Customer sign-in is not available yet. You can still browse the collection and send an inquiry by email.</p>
        ) : step === 'email' ? (
          <form onSubmit={send} noValidate className="mt-6 space-y-5">
            <p className="text-sm text-muted">No password needed. We email you a one-time code to follow your inquiries.</p>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email address</label>
              <Input id="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby={error ? 'signin-error' : undefined} />
            </div>
            {error && <p id="signin-error" role="alert" className="text-sm text-red-700">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full">{busy ? <><Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Sending…</> : 'Email me a code'}</Button>
          </form>
        ) : (
          <form onSubmit={verify} noValidate className="mt-6 space-y-5">
            {notice && <p role="status" className="text-sm text-muted">{notice}</p>}
            <div>
              <label htmlFor="code" className="mb-1.5 block text-sm font-medium">Verification code</label>
              <Input id="code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} aria-describedby={error ? 'signin-error' : undefined} />
            </div>
            {error && <p id="signin-error" role="alert" className="text-sm text-red-700">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full">{busy ? <><Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Verifying…</> : 'Verify and sign in'}</Button>
            <div className="flex flex-wrap gap-x-6">
              <button type="button" onClick={send} disabled={busy} className="min-h-11 text-sm underline underline-offset-4 disabled:opacity-50">Resend code</button>
              <button type="button" onClick={() => { setStep('email'); setCode(''); setError(''); setNotice('') }} className="min-h-11 text-sm underline underline-offset-4">Use a different email</button>
            </div>
          </form>
        )}
        <Link to="/" className="mt-8 inline-flex min-h-11 items-center text-sm underline underline-offset-4">Back to the website</Link>
      </div>
    </main>
  )
}
