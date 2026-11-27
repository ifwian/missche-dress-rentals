import PageHeader from '@/components/shared/PageHeader'
import { BUSINESS, OWNER_EMAIL, TIKTOK_URL } from '@/config/business'
import { HAS_BACKEND } from '@/lib/backend'
import { useAuth } from '@/lib/auth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function AdminSettings() {
  useDocumentTitle('Settings')
  const { session } = useAuth()
  const rows = [
    ['Signed in as', session?.user.email ?? 'Local demo (no login)'],
    ['Database (Supabase)', HAS_BACKEND ? 'Connected' : 'Not connected (local demo)'],
    ['Business email', OWNER_EMAIL || 'Not set. Add VITE_OWNER_EMAIL in Vercel.'],
    ['Facebook', BUSINESS.facebookUrl],
    ['TikTok', TIKTOK_URL || 'Not set. Add VITE_TIKTOK_URL in Vercel.'],
  ]
  return (
    <>
      <PageHeader title="Settings" description="Business details come from environment variables set in Vercel. Changing them needs a redeploy." />
      <dl className="divide-y divide-charcoal/10 border border-charcoal/10 bg-white">
        {rows.map(([t, v]) => <div key={t} className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr]"><dt className="text-sm font-medium">{t}</dt><dd className="break-all text-sm text-muted">{v}</dd></div>)}
      </dl>
    </>
  )
}
