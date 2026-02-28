import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  BrandCampaignSummary,
  Campaign,
  Collaboration,
  DashboardTimelinePoint,
  InfluencerDashboard,
  Payout,
} from '@core/modules/dashboard'
import { UserRole } from '@core/modules/auth/domain/entities'
import { httpClient } from '@/shared/api/http'
import { dashboardContainer } from '@/shared/api/dashboardContainer'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}
function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
function lastNDaysRange(days: number) {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - days + 1)
  return { from: toISODate(from), to: toISODate(to) }
}

type DashboardSnapshot = {
  at: number
  error: string | null
  campaignStatus: 'all' | 'draft' | 'published' | 'closed'
  campaigns: Campaign[]
  collaborations: Collaboration[]
  influencerDashboard: InfluencerDashboard | null
  payouts: Payout[]
  appliesCount: number
  selectedCampaignId: string | null
  brandSummary: BrandCampaignSummary | null
  timeline: DashboardTimelinePoint[]
}

const CACHE_TTL_MS = 15_000
const cache = new Map<string, DashboardSnapshot>()
const inflight = new Map<string, Promise<DashboardSnapshot>>()

function cacheKey(role: UserRole, campaignStatus: string) {
  return `${role}|${campaignStatus}`
}

async function getInfluencerAppliesCountFast(): Promise<number> {
  const res = await httpClient.get<any>(`/api/v1/applications?page=1&size=1`)
  const payload = (res as any).data ?? res
  const meta = payload?.meta ?? payload?.pagination ?? payload?.data?.meta ?? null
  const total = Number(meta?.total ?? payload?.total ?? payload?.data?.total ?? NaN)
  if (Number.isFinite(total)) return total
  const list = (payload?.data ?? payload?.items ?? []) as any[]
  return Array.isArray(list) ? list.length : 0
}

async function loadInfluencerExtras() {
  const [dash, pays, appliesCount] = await Promise.all([
    dashboardContainer.getInfluencerDashboardUseCase.execute(),
    dashboardContainer.listInfluencerPayoutsUseCase.execute(),
    getInfluencerAppliesCountFast(),
  ])
  return { dash, pays, appliesCount }
}

export function useDashboard(role: UserRole | null) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [campaignStatus, setCampaignStatus] = useState<'all' | 'draft' | 'published' | 'closed'>('all')

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])

  const [influencerDashboard, setInfluencerDashboard] = useState<InfluencerDashboard | null>(null)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [appliesCount, setAppliesCount] = useState<number>(0)

  const [selectedCampaignId, _setSelectedCampaignId] = useState<string | null>(null)
  const selectedCampaignIdRef = useRef<string | null>(null)
  const setSelectedCampaignId = useCallback((id: string | null) => {
    selectedCampaignIdRef.current = id
    _setSelectedCampaignId(id)
  }, [])

  const [brandSummary, setBrandSummary] = useState<BrandCampaignSummary | null>(null)
  const [timeline, setTimeline] = useState<DashboardTimelinePoint[]>([])

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refreshBase = useCallback(
    async (opts?: { force?: boolean }) => {
      const r = role as UserRole | null
      if (!r) return

      const key = cacheKey(r, campaignStatus)
      const cached = cache.get(key)
      const fresh = cached && Date.now() - cached.at <= CACHE_TTL_MS

      if (!opts?.force && fresh) {
        if (!mountedRef.current) return
        setLoading(false)
        setError(cached!.error)
        setCampaigns(cached!.campaigns)
        setCollaborations(cached!.collaborations)
        setInfluencerDashboard(cached!.influencerDashboard)
        setPayouts(cached!.payouts)
        setAppliesCount(cached!.appliesCount)
        setBrandSummary(cached!.brandSummary)
        setTimeline(cached!.timeline)
        if (r === UserRole.BRAND) setSelectedCampaignId(cached!.selectedCampaignId)
        return
      }

      if (!opts?.force && inflight.has(key)) {
        const snap = await inflight.get(key)!
        if (!mountedRef.current) return
        setLoading(false)
        setError(snap.error)
        setCampaigns(snap.campaigns)
        setCollaborations(snap.collaborations)
        setInfluencerDashboard(snap.influencerDashboard)
        setPayouts(snap.payouts)
        setAppliesCount(snap.appliesCount)
        setBrandSummary(snap.brandSummary)
        setTimeline(snap.timeline)
        if (r === UserRole.BRAND) setSelectedCampaignId(snap.selectedCampaignId)
        return
      }

      setLoading(true)
      setError(null)

      const promise = (async (): Promise<DashboardSnapshot> => {
        try {
          const status = campaignStatus === 'all' ? undefined : campaignStatus

          const [camps, collabs] = await Promise.all([
            dashboardContainer.listCampaignsUseCase.execute({ page: 1, size: 50, status }),
            dashboardContainer.listCollaborationsUseCase.execute({ page: 1, size: 50 }),
          ])

          let snap: DashboardSnapshot = {
            at: Date.now(),
            error: null,
            campaignStatus,
            campaigns: camps ?? [],
            collaborations: collabs ?? [],
            influencerDashboard: null,
            payouts: [],
            appliesCount: 0,
            selectedCampaignId: selectedCampaignIdRef.current ?? null,
            brandSummary: null,
            timeline: [],
          }

          if (r === UserRole.INFLUENCER) {
            const { dash, pays, appliesCount } = await loadInfluencerExtras()
            snap.influencerDashboard = dash
            snap.payouts = pays
            snap.appliesCount = appliesCount

            const top = dash?.collaborations?.[0]?.collaborationId
            if (top) {
              const { from, to } = lastNDaysRange(14)
              snap.timeline = await dashboardContainer.getCollaborationTimelineUseCase.execute(top, { from, to, group: 'day' })
            }
          }

          if (r === UserRole.BRAND) {
            const pick =
              selectedCampaignIdRef.current ??
              (snap.campaigns.find((c) => c.status === 'published')?.id ?? snap.campaigns[0]?.id ?? null)

            snap.selectedCampaignId = pick

            if (pick) {
              const { from, to } = lastNDaysRange(14)
              const [summary, t] = await Promise.all([
                dashboardContainer.getBrandCampaignSummaryUseCase.execute(pick),
                dashboardContainer.getBrandCampaignTimelineUseCase.execute(pick, { from, to, group: 'day' }),
              ])
              snap.brandSummary = summary
              snap.timeline = t
            }
          }

          if (r === UserRole.ADMIN) {
            snap.influencerDashboard = null
            snap.brandSummary = null
            snap.payouts = []
            snap.appliesCount = 0
            snap.timeline = []
          }

          cache.set(key, snap)
          return snap
        } catch (e: any) {
          const snap: DashboardSnapshot = {
            at: Date.now(),
            error: e?.message ?? 'Something went wrong',
            campaignStatus,
            campaigns: [],
            collaborations: [],
            influencerDashboard: null,
            payouts: [],
            appliesCount: 0,
            selectedCampaignId: selectedCampaignIdRef.current ?? null,
            brandSummary: null,
            timeline: [],
          }
          cache.set(key, snap)
          return snap
        } finally {
          inflight.delete(key)
        }
      })()

      inflight.set(key, promise)
      const snap = await promise

      if (!mountedRef.current) return

      setLoading(false)
      setError(snap.error)
      setCampaigns(snap.campaigns)
      setCollaborations(snap.collaborations)
      setInfluencerDashboard(snap.influencerDashboard)
      setPayouts(snap.payouts)
      setAppliesCount(snap.appliesCount)
      setBrandSummary(snap.brandSummary)
      setTimeline(snap.timeline)

      if (role === UserRole.BRAND) {
        setSelectedCampaignId(snap.selectedCampaignId ?? null)
      }
    },
    [role, campaignStatus, setSelectedCampaignId],
  )

  useEffect(() => {
    void refreshBase()
  }, [refreshBase])

  const brandDetailsInflight = useRef<Map<string, Promise<{ summary: BrandCampaignSummary; t: DashboardTimelinePoint[] }>>>(
    new Map(),
  )

  const refreshBrandDetails = useCallback(
    async (campaignId: string) => {
      const r = role as UserRole | null
      if (r !== UserRole.BRAND || !campaignId) return

      const key = campaignId
      const infl = brandDetailsInflight.current
      if (infl.has(key)) {
        const res = await infl.get(key)!
        if (!mountedRef.current) return
        setBrandSummary(res.summary)
        setTimeline(res.t)
        return
      }

      const p = (async () => {
        const { from, to } = lastNDaysRange(14)
        const [summary, t] = await Promise.all([
          dashboardContainer.getBrandCampaignSummaryUseCase.execute(campaignId),
          dashboardContainer.getBrandCampaignTimelineUseCase.execute(campaignId, { from, to, group: 'day' }),
        ])
        return { summary, t }
      })()

      infl.set(key, p)

      try {
        const res = await p
        if (!mountedRef.current) return
        setBrandSummary(res.summary)
        setTimeline(res.t)
      } finally {
        infl.delete(key)
      }
    },
    [role],
  )

  useEffect(() => {
    if (role !== UserRole.BRAND) return
    if (!selectedCampaignId) return
    void refreshBrandDetails(selectedCampaignId)
  }, [role, selectedCampaignId, refreshBrandDetails])

  const filteredCampaigns = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return campaigns
    return campaigns.filter((c) => (c.title ?? '').toLowerCase().includes(q))
  }, [campaigns, search])

  const counts = useMemo(() => {
    return {
      draft: campaigns.filter((c) => c.status === 'draft').length,
      published: campaigns.filter((c) => c.status === 'published').length,
      closed: campaigns.filter((c) => c.status === 'closed').length,
      all: campaigns.length,
    }
  }, [campaigns])

  const refresh = useCallback(
    async (opts?: { force?: boolean }) => {
      await refreshBase(opts)
    },
    [refreshBase],
  )

  return {
    loading,
    error,
    search,
    setSearch,
    campaignStatus,
    setCampaignStatus,
    campaigns: filteredCampaigns,
    campaignsAll: campaigns,
    counts,
    collaborations,
    influencerDashboard,
    payouts,
    appliesCount,
    selectedCampaignId,
    setSelectedCampaignId,
    brandSummary,
    timeline,
    refresh,
  }
}