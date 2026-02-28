import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { UserRole } from '@core/modules/auth/domain/entities'
import { httpClient } from '@/shared/api/http'

type CampaignStatus = 'draft' | 'published' | 'closed'

export type CampaignListItem = {
  id: string
  title: string
  status: CampaignStatus
  commission_type?: string
  commission_value?: number
  budget?: number | null
  start_at?: string | null
  end_at?: string | null
  product?: { id: string; name?: string; landing_url?: string | null } | null
}

type ApiPaginated<T> = {
  data: T[]
  meta?: { current_page?: number; last_page?: number; per_page?: number; total?: number }
  links?: { first?: string | null; last?: string | null; prev?: string | null; next?: string | null }
}

type ApplicationItem = {
  id: string
  campaign_id: string
  created_at?: string | null
}

function isAxiosResponse(x: any): x is { data: any; status: number; headers: any; config: any } {
  return !!x && typeof x === 'object' && 'data' in x && 'status' in x && 'headers' in x && 'config' in x
}

function unwrap<T>(resOrPayload: any): T {
  return (isAxiosResponse(resOrPayload) ? resOrPayload.data : resOrPayload) as T
}

export function useCampaignsMarketplace(role: UserRole | null) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(12)

  const [items, setItems] = useState<CampaignListItem[]>([])
  const [meta, setMeta] = useState<{ current: number; last: number; total: number }>({ current: 1, last: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [appliedMap, setAppliedMap] = useState<Record<string, string>>({})

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refreshCampaigns = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set('scope', 'all')
      params.set('status', 'published')
      params.set('page', String(page))
      params.set('size', String(size))

      const res = await httpClient.get<ApiPaginated<CampaignListItem>>(`/api/v1/campaigns?${params.toString()}`)
      const payload = unwrap<ApiPaginated<CampaignListItem>>(res)

      const data = Array.isArray(payload?.data) ? payload.data : []
      const m = payload?.meta ?? {}

      if (!mountedRef.current) return
      setItems(data)
      setMeta({
        current: Number(m.current_page ?? page) || page,
        last: Number(m.last_page ?? 1) || 1,
        total: Number(m.total ?? data.length) || data.length,
      })
    } catch (e: any) {
      if (!mountedRef.current) return
      setItems([])
      setMeta({ current: 1, last: 1, total: 0 })
      setError(e?.message ?? 'Failed to load campaigns')
    } finally {
      if (!mountedRef.current) return
      setLoading(false)
    }
  }, [page, size])

  const refreshAppliedMap = useCallback(async () => {
    if (role !== UserRole.INFLUENCER) {
      setAppliedMap({})
      return
    }

    try {
      const res = await httpClient.get<ApiPaginated<ApplicationItem>>(`/api/v1/applications?page=1&size=200`)
      const payload = unwrap<ApiPaginated<ApplicationItem>>(res)
      const list = Array.isArray(payload?.data) ? payload.data : []

      const map: Record<string, string> = {}
      for (const a of list) {
        if (a?.campaign_id) map[a.campaign_id] = (a.created_at ?? '') || ''
      }

      if (!mountedRef.current) return
      setAppliedMap(map)
    } catch {
      if (!mountedRef.current) return
      setAppliedMap({})
    }
  }, [role])

  useEffect(() => {
    void refreshCampaigns()
  }, [refreshCampaigns])

  useEffect(() => {
    void refreshAppliedMap()
  }, [refreshAppliedMap])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((c) => (c.title ?? '').toLowerCase().includes(q) || (c.product?.name ?? '').toLowerCase().includes(q))
  }, [items, search])

  const canPrev = meta.current > 1
  const canNext = meta.current < meta.last

  return {
    search,
    setSearch,

    page,
    setPage,
    size,
    setSize,

    items,
    filtered,
    meta,
    loading,
    error,

    appliedMap,

    canPrev,
    canNext,

    refreshCampaigns,
    refreshAppliedMap,
  }
}