import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Collaboration } from '@core/modules/dashboard'
import { dashboardContainer } from '@/shared/api/dashboardContainer'

export function useCollaborations() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Collaboration[]>([])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await dashboardContainer.listCollaborationsUseCase.execute({ page: 1, size: 200 })
      setItems(list ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load collaborations.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const api = useMemo(() => ({ loading, error, items, refresh }), [loading, error, items, refresh])
  return api
}