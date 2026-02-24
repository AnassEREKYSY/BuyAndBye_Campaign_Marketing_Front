import { useCallback, useEffect, useMemo, useState } from 'react'
import { DashboardContainer } from '@core/modules/dashboard'
import type {
  BrandCampaignSummary,
  Campaign,
  Collaboration,
  DashboardTimelinePoint,
  InfluencerDashboard,
  Payout,
} from '@core/modules/dashboard'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { UserRole } from '@core/modules/auth/domain/entities'
import { env } from '@/shared'

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

export function useDashboard(role: UserRole | null) {
  const tokenStorage = useMemo(() => new CoreTokenStorage(), [])
  const httpClient = useMemo(() => new HttpClient(env.BACKEND_BASE_URL, tokenStorage), [tokenStorage])
  const container = useMemo(() => DashboardContainer.getInstance(httpClient), [httpClient])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [campaignStatus, setCampaignStatus] = useState<'all' | 'draft' | 'published' | 'closed'>('all')

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])

  const [influencerDashboard, setInfluencerDashboard] = useState<InfluencerDashboard | null>(null)
  const [payouts, setPayouts] = useState<Payout[]>([])

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [brandSummary, setBrandSummary] = useState<BrandCampaignSummary | null>(null)

  const [timeline, setTimeline] = useState<DashboardTimelinePoint[]>([])

  const refresh = useCallback(async () => {
    const r = role as UserRole | null
    if (r === null) return

    setLoading(true)
    setError(null)

    try {
      const status = campaignStatus === 'all' ? undefined : campaignStatus

      const [camps, collabs] = await Promise.all([
        container.listCampaignsUseCase.execute({ page: 1, size: 50, status }),
        container.listCollaborationsUseCase.execute({ page: 1, size: 50 }),
      ])

      setCampaigns(camps)
      setCollaborations(collabs)

      if (r === UserRole.INFLUENCER) {
        const [dash, pays] = await Promise.all([
          container.getInfluencerDashboardUseCase.execute(),
          container.listInfluencerPayoutsUseCase.execute(),
        ])

        setInfluencerDashboard(dash)
        setPayouts(pays)

        const top = dash.collaborations?.[0]?.collaborationId
        if (top) {
          const { from, to } = lastNDaysRange(14)
          const t = await container.getCollaborationTimelineUseCase.execute(top, { from, to, group: 'day' })
          setTimeline(t)
        } else {
          setTimeline([])
        }
      } else {
        setInfluencerDashboard(null)
        setPayouts([])
      }

      if (r === UserRole.BRAND) {
        const pick =
          selectedCampaignId ??
          camps.find((c) => c.status === 'published')?.id ??
          camps[0]?.id ??
          null

        setSelectedCampaignId(pick)

        if (pick) {
          const { from, to } = lastNDaysRange(14)
          const [summary, t] = await Promise.all([
            container.getBrandCampaignSummaryUseCase.execute(pick),
            container.getBrandCampaignTimelineUseCase.execute(pick, { from, to, group: 'day' }),
          ])
          setBrandSummary(summary)
          setTimeline(t)
        } else {
          setBrandSummary(null)
          setTimeline([])
        }
      } else {
        setBrandSummary(null)
      }

      if (r === UserRole.ADMIN) {
        setInfluencerDashboard(null)
        setBrandSummary(null)
        setPayouts([])
        setTimeline([])
      }
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [role, campaignStatus, selectedCampaignId, container])

  useEffect(() => {
    void refresh()
  }, [refresh])

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
    selectedCampaignId,
    setSelectedCampaignId,
    brandSummary,
    timeline,
    refresh,
  }
}