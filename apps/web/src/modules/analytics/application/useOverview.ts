import { useCallback, useEffect, useRef, useState } from 'react'
import { httpClient } from '@/shared/api/http'

export type RangeDays = 7 | 30 | 90

export type SeriesPoint = { date: string; clicks: number; unique_clicks: number }
export type Breakdown = { source?: string; device?: string; clicks: number }

type Totals = {
  clicks: number
  unique_clicks: number
  previous_clicks: number
  change_pct: number | null
  all_time_clicks: number
}

export type BrandOverview = {
  range: { days: number; from: string; to: string }
  totals: Totals & {
    campaigns_published: number
    campaigns_draft: number
    campaigns_closed: number
    active_collaborations: number
    pending_applications: number
  }
  series: SeriesPoint[]
  campaigns: Array<{ id: string; title: string; status: string; budget: number | null; clicks: number; unique_clicks: number; collaborators: number }>
  top_creators: Array<{ id: string; display_name: string; photo_url: string | null; clicks: number; campaigns: number }>
  sources: Breakdown[]
  devices: Breakdown[]
  payouts: { currency: string; pending: number; approved: number; paid: number }
}

export type CreatorLink = {
  collaboration_id: string
  status: string
  accepted_at: string | null
  campaign: { id: string; title: string }
  brand_name: string | null
  commission: { type: 'percent' | 'fixed' | string; value: number }
  tracking: { code: string | null; url: string | null; destination_url: string | null }
  promo_code: string | null
  clicks: number
  clicks_in_range: number
}

export type CreatorOverview = {
  range: { days: number; from: string; to: string }
  totals: Totals & { active_collaborations: number }
  series: SeriesPoint[]
  sources: Breakdown[]
  devices: Breakdown[]
  links: CreatorLink[]
  earnings: {
    currency: string
    pending: number
    approved: number
    paid: number
    total: number
    monthly: Array<{ month: string; amount: number }>
    payouts: Array<{
      id: string
      campaign_title: string
      period_start: string
      period_end: string
      clicks_total: number
      clicks_unique: number
      amount: number
      currency: string
      status: string
    }>
  }
}

/** Loads /brand/analytics/overview or /influencer/analytics/overview for the chosen range. */
export function useOverview<T>(kind: 'brand' | 'influencer', days: RangeDays) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestId = useRef(0)

  const load = useCallback(async () => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      const body = (await httpClient.get<{ data: T }>(`/api/v1/${kind}/analytics/overview?days=${days}`)) as any
      if (id !== requestId.current) return
      setData((body?.data ?? body) as T)
    } catch (e: any) {
      if (id !== requestId.current) return
      setError(e?.response?.data?.message ?? 'Could not load analytics.')
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [kind, days])

  useEffect(() => {
    void load()
  }, [load])

  return { data, loading, error, reload: load }
}

export function changeLabel(pct: number | null | undefined, days: number) {
  if (pct === null || pct === undefined) return `No data for the previous ${days} days`
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct}% vs previous ${days} days`
}
