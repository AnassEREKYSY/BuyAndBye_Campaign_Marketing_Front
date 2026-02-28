import { httpClient } from '@/shared/api/http'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type InfluencerApplicationItem = {
  id: string
  campaign_id: string
  message: string | null
  status: string
  created_at: string | null
  campaign?: { id: string; title: string; status: string } | null
}

export function useInfluencerApplications() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<InfluencerApplicationItem[]>([])
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
      const res = await httpClient.get<any>(`/api/v1/applications?page=1&size=200`)
      const payload = (res as any).data ?? res
      const list = (payload?.data ?? []) as InfluencerApplicationItem[]

      if (!mountedRef.current) return
      setItems(Array.isArray(list) ? list : [])
    } catch (e: any) {
      if (!mountedRef.current) return
      setError(e?.message ?? 'Failed to load applications.')
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
    return items.filter((a) => {
      const title = (a.campaign?.title ?? '').toLowerCase()
      const st = (a.status ?? '').toLowerCase()
      const msg = (a.message ?? '').toLowerCase()
      const id = (a.campaign_id ?? '').toLowerCase()
      return title.includes(q) || st.includes(q) || msg.includes(q) || id.includes(q)
    })
  }, [items, search])

  return { loading, error, search, setSearch, items: filtered, rawItems: items, refresh }
}