import { useCallback, useEffect, useRef, useState } from 'react'
import { dashboardContainer } from '@/shared/api/dashboardContainer'
import type { Collaboration } from '@core/modules/dashboard'

export function useCollaborationDetails(id: string | null) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<Collaboration | null>(null)

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const c = await dashboardContainer.getCollaborationUseCase.execute(id)
      if (!mountedRef.current) return
      setItem(c)
    } catch (e: any) {
      if (!mountedRef.current) return
      setError(e?.message ?? 'Failed to load collaboration.')
      setItem(null)
    } finally {
      if (!mountedRef.current) return
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { loading, error, item, refresh }
}