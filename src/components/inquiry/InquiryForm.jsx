import { useEffect, useMemo, useState } from 'react'
import { HAS_BACKEND } from '@/lib/backend'
import { useAuth } from '@/lib/auth'
import { inquiryService } from '@/services/inquiryService'
import { Link, useSearchParams } from 'react-router-dom'
import { Copy, ExternalLink, Mail, Loader2 } from 'lucide-react'
import AsyncContent from '@/components/shared/AsyncContent'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { fieldClass } from '@/components/ui/input'
import { BUSINESS, OWNER_EMAIL } from '@/config/business'
import { availabilityService, getStatus } from '@/services/availabilityService'
import { dressService } from '@/services/dressService'
import { useAsync } from '@/hooks/useAsync'
import { formatDate, todayISO } from '@/lib/dates'
import { FITTING_OPTIONS, buildInquiry, inquiryText, mailtoHref, rentalSchedule, validateInquiry } from '@/lib/inquiry'
import { cn } from '@/lib/utils'

const load = () => Promise.all([dressService.list(), availabilityService.list()])

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  )
}

export function Form({ dresses, periods }) {
  const [params] = useSearchParams()
  const today = todayISO()
  const startDress = dresses.some((d) => d.id === params.get('dress')) ? params.get('dress') : ''
  const startPickup = /^\d{4}-\d{2}-\d{2}$/.test(params.get('date') ?? '') && params.get('date') >= today ? params.get('date') : ''
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dressId: startDress, pickup: startPickup,
    ...rentalSchedule(startPickup), fitting: '', message: '', agree: false,
  })
  const [manual, setManual] = useState({ event: false, ret: false })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState('edit') // 'edit' | 'review'
  const [opened, setOpened] = useState(false)
  const [copied, setCopied] = useState(null)
  const { status: authStatus } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }
  function setPickup(event) {
    const pickup = event.target.value
    setForm((f) => {
      const auto = rentalSchedule(pickup)
      return { ...f, pickup, event: manual.event ? f.event : auto.event, ret: manual.ret ? f.ret : auto.ret }
    })
  }
  const setDate = (key) => (event) => {
    setManual((m) => ({ ...m, [key]: true }))
    setForm((f) => ({ ...f, [key]: event.target.value }))
  }

  const dress = dresses.find((d) => d.id === form.dressId)
  const inquiry = useMemo(() => (dress && step === 'review' ? buildInquiry(form, dress) : null), [dress, form, step])
  const text = inquiry ? inquiryText(inquiry) : ''
  const busy = useMemo(() => {
    if (!dress || !form.pickup || !form.ret || form.ret < form.pickup) return []
    const days = [form.pickup, form.event, form.ret].filter(Boolean)
    return days.filter((day, i) => days.indexOf(day) === i && getStatus(periods, dress.id, day) !== 'available')
  }, [dress, form.pickup, form.event, form.ret, periods])

  useEffect(() => { setOpened(false); setCopied(null) }, [step])

  function review(event) {
    event.preventDefault()
    const found = validateInquiry(form, today)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }
    setStep('review')
    window.scrollTo({ top: 0 })
  }

  async function submitOnline() {
    if (saving || saved) return
    setSaving(true); setSaveError('')
    try {
      await inquiryService.submit({
        dress_id: dress.id, dress_code: dress.code, dress_name: dress.name,
        customer_name: form.name.trim(), customer_email: form.email.trim(), customer_phone: form.phone.trim() || null,
        pickup_date: form.pickup, event_date: form.event, return_date: form.ret,
        fitting: form.fitting, message: form.message.trim() || null, terms_accepted: true,
      })
      setSaved(true)
    } catch (error) {
      setSaveError(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied('ok')
    } catch {
      setCopied('blocked')
    }
  }

  const invalid = (key) => (errors[key] ? { 'aria-invalid': true, 'aria-describedby': `${key}-error` } : {})

  if (step === 'review') {
    return (
      <div className="max-w-2xl">
        <h2 className="text-4xl">Review your inquiry</h2>
        <dl className="mt-6 divide-y divide-rose-dusty border-y border-rose-dusty">
          {[
            ['Name', form.name], ['Email', form.email], form.phone.trim() && ['Contact number', form.phone],
            ['Dress', `${dress.name} (${dress.code})`], ['Pickup, Day 1', formatDate(form.pickup)],
            ['Event, Day 2', formatDate(form.event)], ['Return, Day 3', formatDate(form.ret)],
            ['Fitting', FITTING_OPTIONS.find((o) => o.value === form.fitting).label], form.message.trim() && ['Message', form.message],
          ].filter(Boolean).map(([term, value]) => (
            <div key={term} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
              <dt className="text-sm font-medium">{term}</dt><dd className="break-words whitespace-pre-line">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 border-l-2 border-rose pl-4 text-sm">This is an inquiry, not a booking. We will check availability and send payment instructions. Your reservation is confirmed only after full payment.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {HAS_BACKEND && authStatus === 'signed-in' && (
            <Button size="lg" onClick={submitOnline} disabled={saving || saved}>
              {saving && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}{saved ? 'Inquiry sent' : saving ? 'Sending…' : 'Send inquiry to Missche'}
            </Button>
          )}
          {OWNER_EMAIL && <Button asChild size="lg"><a href={mailtoHref(OWNER_EMAIL, inquiry)} onClick={() => setOpened(true)}><Mail aria-hidden="true" />Send by email</a></Button>}
          <Button size="lg" variant={OWNER_EMAIL ? 'outline' : 'default'} onClick={copy}><Copy aria-hidden="true" />Copy inquiry</Button>
          <Button size="lg" variant="outline" onClick={() => setStep('edit')}>Edit details</Button>
        </div>
        {HAS_BACKEND && authStatus !== 'signed-in' && <p className="mt-4 text-sm"><Link to="/signin" className="font-medium text-rose-deep underline">Sign in with your email</Link> to send this inquiry online and track its status. You can still send it by email.</p>}
        <div aria-live="polite" className="mt-4 text-sm">
          {saved && <p className="text-emerald-800">Inquiry received with status Pending Review. Track it in <Link to="/account" className="font-medium underline">My account</Link>. This is not a booking until full payment is confirmed.</p>}
          {saveError && <p role="alert" className="text-red-700">{saveError}</p>}
          {opened && <p>Your email app should have opened. <strong>Your inquiry has not reached us until you press Send there.</strong> If nothing opened, use Copy inquiry and send it to <span className="break-all font-medium">{OWNER_EMAIL}</span>.</p>}
          {copied === 'ok' && <p className="text-emerald-800">Inquiry copied. {OWNER_EMAIL ? `Paste it into an email to ${OWNER_EMAIL}.` : 'Paste it into a message on our Facebook page.'}</p>}
          {copied === 'blocked' && (
            <>
              <p>Copying was blocked. Select the text below and copy it.</p>
              <Textarea aria-label="Inquiry text" className="mt-2" rows={10} readOnly value={text} onFocus={(e) => e.target.select()} />
            </>
          )}
        </div>
        {!OWNER_EMAIL && (
          <p className="mt-4 text-sm text-muted">
            Email inquiries are not set up yet. Copy your inquiry and send it on our{' '}
            <a href={BUSINESS.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-rose-deep underline">Facebook page<ExternalLink className="size-3.5" aria-hidden="true" /></a>.
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={review} noValidate className="grid max-w-3xl gap-6">
      <p className="text-sm text-muted">We only ask what we need for a first inquiry. Please do not send photos of your ID or your full address here. We will ask for those securely before booking.</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Full name" error={errors.name}><input id="name" autoComplete="name" className={fieldClass} value={form.name} onChange={set('name')} {...invalid('name')} /></Field>
        <Field id="email" label="Email address" error={errors.email}><input id="email" type="email" autoComplete="email" className={fieldClass} value={form.email} onChange={set('email')} {...invalid('email')} /></Field>
        <Field id="phone" label="Contact number (optional)" error={errors.phone}><input id="phone" type="tel" autoComplete="tel" className={fieldClass} value={form.phone} onChange={set('phone')} {...invalid('phone')} /></Field>
        <Field id="dressId" label="Dress" error={errors.dressId} hint={dress ? `Dress code: ${dress.code}` : undefined}>
          <select id="dressId" className={cn(fieldClass)} value={form.dressId} onChange={set('dressId')} {...invalid('dressId')}>
            <option value="">Choose a dress</option>
            {dresses.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.code}){d.isSample ? ' (sample)' : ''}</option>)}
          </select>
        </Field>
      </div>

      <fieldset className="grid gap-6 border border-rose-dusty p-5 sm:grid-cols-3">
        <legend className="px-2 text-sm font-medium">Rental schedule (3 days)</legend>
        <Field id="pickup" label="Pickup (Day 1)" error={errors.pickup}><input id="pickup" type="date" min={today} className={fieldClass} value={form.pickup} onChange={setPickup} {...invalid('pickup')} /></Field>
        <Field id="event" label="Event (Day 2)" error={errors.event}><input id="event" type="date" min={form.pickup || today} className={fieldClass} value={form.event} onChange={setDate('event')} {...invalid('event')} /></Field>
        <Field id="ret" label="Return (Day 3)" error={errors.ret}><input id="ret" type="date" min={form.event || today} className={fieldClass} value={form.ret} onChange={setDate('ret')} {...invalid('ret')} /></Field>
        <p className="text-xs text-muted sm:col-span-3">Choose your pickup date and we fill in the event and return days for you. You can change them if your schedule is different.</p>
        {busy.length > 0 && (
          <p role="status" className="bg-blush p-3 text-sm sm:col-span-3">This dress may not be available on {busy.map(formatDate).join(', ')}. You can still send your inquiry and the owner will confirm.</p>
        )}
      </fieldset>

      <fieldset aria-describedby={errors.fitting ? 'fitting-error' : undefined}>
        <legend className="mb-2 text-sm font-medium">Fitting preference</legend>
        <div className="grid gap-2">
          {FITTING_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex min-h-11 items-start gap-3 border border-rose-dusty bg-white p-3 text-sm">
              <input type="radio" name="fitting" id={value === 'fitting' ? 'fitting' : undefined} value={value} checked={form.fitting === value} onChange={set('fitting')} className="mt-0.5 size-4 accent-rose" />
              {label}
            </label>
          ))}
        </div>
        {errors.fitting && <p id="fitting-error" role="alert" className="mt-1 text-sm text-red-700">{errors.fitting}</p>}
      </fieldset>

      <Field id="message" label="Additional message (optional)"><Textarea id="message" rows={4} maxLength={500} value={form.message} onChange={set('message')} /></Field>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input id="agree" type="checkbox" checked={form.agree} onChange={set('agree')} className="mt-0.5 size-5 accent-rose" {...invalid('agree')} />
          <span>I have read and agree to the <Link to="/terms" target="_blank" className="font-medium text-rose-deep underline">Terms &amp; Conditions</Link>.</span>
        </label>
        {errors.agree && <p id="agree-error" role="alert" className="mt-1 text-sm text-red-700">{errors.agree}</p>}
      </div>

      <div><Button type="submit" size="lg">Review inquiry</Button></div>
    </form>
  )
}

export default function InquiryForm() {
  const state = useAsync(load)
  return <AsyncContent {...state}>{([dresses, periods]) => <Form dresses={dresses} periods={periods} />}</AsyncContent>
}
