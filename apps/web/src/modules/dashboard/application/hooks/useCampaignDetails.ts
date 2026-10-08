import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CampaignPayoutTier } from '@core/modules/dashboard/domain/entities'
import { UserRole } from '@core/modules/auth/domain/entities'
import { dashboardContainer } from '@/shared/api/dashboardContainer'
import { httpClient } from '@/shared/api/http'

type CampaignStatus = 'draft' | 'published' | 'closed'
export type CampaignDetails = {
  id: string
  title: string
  objective?: string | null
  status: CampaignStatus
  commission_type?: string
  commission_value?: number
  budget?: number | null
  start_at?: string | null
  end_at?: string | null
  product?: { id: string; name?: string; landing_url?: string | null } | null
  brand?: { id: string; display_name?: string; photo_url?: string | null } | null
}

type ApiEnvelope<T> = { data: T }
type ApplicationItem = { id: string; campaign_id: string; created_at?: string | null }

async function fetchCampaign(id: string): Promise<CampaignDetails> {
  const res = await httpClient.get<ApiEnvelope<CampaignDetails>>(`/api/v1/campaigns/${id}?scope=all`)
  const payload = (res as any).data ?? res
  return (payload?.data ?? payload) as CampaignDetails
}

async function fetchAppliedAt(id: string): Promise<string | null> {
  const res = await httpClient.get<any>(`/api/v1/applications?page=1&size=200`)
  const body = res as any
  const payload = { data: Array.isArray(body?.data) ? body.data : Array.isArray(body?.data?.data) ? body.data.data : Array.isArray(body) ? body : [] }
  const list = (payload?.data ?? []) as ApplicationItem[]
  const found = list.find((a) => a.campaign_id === id)
  return found?.created_at ?? null
}

export function useCampaignDetails(id: string | null, role: UserRole | null) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<CampaignDetails | null>(null)

  const [applyLoading, setApplyLoading] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [applySuccess, setApplySuccess] = useState<string | null>(null)
  const [appliedAt, setAppliedAt] = useState<string | null>(null)

  const [tiers, setTiers] = useState<CampaignPayoutTier[]>([])
  const [tiersLoading, setTiersLoading] = useState(false)
  const [tiersError, setTiersError] = useState<string | null>(null)

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
      const p = await fetchCampaign(id)
      if (!mountedRef.current) return
      setItem(p)
    } catch (e: any) {
      if (!mountedRef.current) return
      setError(e?.message ?? 'Failed to load campaign')
      setItem(null)
    } finally {
      if (!mountedRef.current) return
      setLoading(false)
    }
  }, [id])

  const refreshTiers = useCallback(async () => {
    if (!id) return
    setTiersLoading(true)
    setTiersError(null)

    try {
      const list = await dashboardContainer.listCampaignTiersUseCase.execute(id)
      if (!mountedRef.current) return
      setTiers(list ?? [])
    } catch (e: any) {
      if (!mountedRef.current) return
      setTiersError(e?.message ?? 'Failed to load tiers')
      setTiers([])
    } finally {
      if (!mountedRef.current) return
      setTiersLoading(false)
    }
  }, [id])

  const refreshApplied = useCallback(async () => {
    if (!id) return
    if (role !== UserRole.INFLUENCER) {
      setAppliedAt(null)
      return
    }

    try {
      const at = await fetchAppliedAt(id)
      if (!mountedRef.current) return
      setAppliedAt(at)
    } catch {
      if (!mountedRef.current) return
      setAppliedAt(null)
    }
  }, [id, role])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    void refreshTiers()
  }, [refreshTiers])

  useEffect(() => {
    void refreshApplied()
  }, [refreshApplied])

  const canApply = useMemo(
    () => role === UserRole.INFLUENCER && item?.status === 'published' && !appliedAt,
    [role, item?.status, appliedAt],
  )

  const onApply = useCallback(async () => {
    if (!id) return
    setApplyLoading(true)
    setApplyError(null)
    setApplySuccess(null)

    try {
      await httpClient.post(`/api/v1/campaigns/${id}/apply`, { message: '' })
      const now = new Date().toISOString()
      setAppliedAt(now)
      setApplySuccess('Application sent.')
    } catch (e: any) {
      setApplyError(e?.message ?? 'Failed to apply.')
    } finally {
      setApplyLoading(false)
    }
  }, [id])

  const tiersSorted = useMemo(() => [...tiers].sort((a, b) => Number(a.fromValue) - Number(b.fromValue)), [tiers])

  return {
    item,
    loading,
    error,

    appliedAt,
    canApply,

    applyLoading,
    applyError,
    applySuccess,
    onApply,

    tiersSorted,
    tiersLoading,
    tiersError,

    refresh,
    refreshTiers,
  }
}