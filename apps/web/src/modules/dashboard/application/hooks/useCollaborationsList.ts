import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { dashboardContainer } from '@/shared/api/dashboardContainer'
import type { Collaboration } from '@core/modules/dashboard'

export function useCollaborationsList() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Collaboration[]>([])
  const [search, setSearch] = useState('')

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const list = await dashboardContainer.listCollaborationsUseCase.execute({ page: 1, size: 200 })
      if (!mountedRef.current) return
      setItems(list ?? [])
    } catch (e: any) {
      if (!mountedRef.current) return
      setError(e?.message ?? 'Failed to load collaborations.')
      setItems([])
    } finally {
      if (!mountedRef.current) return
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((c: any) => {
      const title = (c?.campaign?.title ?? '').toLowerCase()
      const promo = (c?.promo?.code ?? '').toLowerCase()
      const tracking = (c?.tracking?.code ?? '').toLowerCase()
      const st = (c?.status ?? '').toLowerCase()
      return title.includes(q) || promo.includes(q) || tracking.includes(q) || st.includes(q)
    })
  }, [items, search])

  return { loading, error, search, setSearch, items: filtered, rawItems: items, refresh }
}