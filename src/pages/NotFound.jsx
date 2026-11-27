import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <div className="container-page py-28 text-center">
      <h1 className="text-5xl">Page not found</h1>
      <p className="mt-4 text-muted">The page you're looking for doesn't exist.</p>
      <Button asChild className="mt-8"><Link to="/">Back to home</Link></Button>
    </div>
  )
}
