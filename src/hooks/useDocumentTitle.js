import { useEffect } from 'react'
import { BUSINESS } from '@/config/business'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BUSINESS.name}` : BUSINESS.name
  }, [title])
}
