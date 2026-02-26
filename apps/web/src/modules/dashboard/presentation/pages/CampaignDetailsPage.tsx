import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { DashboardContainer } from '@core/modules/dashboard'
import { CampaignPayoutTier } from '@core/modules/dashboard/domain/entities'
import { useCampaignApplications } from '@/modules/dashboard/application/hooks/useCampaignApplications'
import { ApplicantProfileModal } from '@/modules/dashboard/presentation/components/ApplicantProfileModal'

type CampaignStatus = 'draft' | 'published' | 'closed'

type CampaignDetails = {
  id: string
  title: string
  objective?: string | null
  status: CampaignStatus
  commission_type?: string
  commission_value?: number
  budget?: number | null
  start_at?: string | null
  end_at?: string | null
  product?: {
    id: string
    name?: string
    landing_url?: string | null
  } | null
  brand?: {
    id: string
    display_name?: string
    photo_url?: string | null
  } | null
}

type ApiEnvelope<T> = { data: T }
type ApplicationItem = { id: string; campaign_id: string; created_at?: string | null }

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  return iso.slice(0, 10)
}

function money(v?: number | null, currency = 'MAD') {
  if (v === null || v === undefined || !Number.isFinite(Number(v))) return '—'
  return `${Number(v).toFixed(2)} ${currency}`
}

function statusBadge(status?: string) {
  if (status === 'published') return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
  if (status === 'draft') return 'border-amber-500/25 bg-amber-500/10 text-amber-200'
  if (status === 'closed') return 'border-rose-500/25 bg-rose-500/10 text-rose-200'
  return 'border-white/10 bg-white/5 text-white/70'
}

function statusDot(status?: string) {
  if (status === 'published') return 'bg-emerald-300/90 shadow-[0_0_18px_rgba(16,185,129,0.35)]'
  if (status === 'draft') return 'bg-amber-300/90 shadow-[0_0_18px_rgba(245,158,11,0.35)]'
  if (status === 'closed') return 'bg-rose-300/90 shadow-[0_0_18px_rgba(244,63,94,0.35)]'
  return 'bg-white/35'
}

function TierPill() {
  return 'border-slate-400/25 bg-slate-500/10 text-slate-200'
}

function appBadge(status: string) {
  if (status === 'shortlisted') return 'border-amber-500/25 bg-amber-500/10 text-amber-200'
  if (status === 'accepted') return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
  if (status === 'rejected') return 'border-rose-500/25 bg-rose-500/10 text-rose-200'
  return 'border-white/10 bg-white/5 text-white/70'
}

export default function CampaignDetailsPage() {
  const { id } = useParams()
  const { profile } = useProfile() as any
  const role = useMemo(() => {
    const raw: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
    if (raw === UserRole.INFLUENCER) return UserRole.INFLUENCER
    if (raw === UserRole.BRAND) return UserRole.BRAND
    if (raw === UserRole.ADMIN) return UserRole.ADMIN
    return null
  }, [profile]) as UserRole | null

  const tokenStorage = useMemo(() => new CoreTokenStorage(), [])
  const httpClient = useMemo(() => new HttpClient(env.BACKEND_BASE_URL, tokenStorage), [tokenStorage])
  const container = useMemo(() => DashboardContainer.getInstance(httpClient), [httpClient])

  const [item, setItem] = useState<CampaignDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [applyLoading, setApplyLoading] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [applySuccess, setApplySuccess] = useState<string | null>(null)
  const [appliedAt, setAppliedAt] = useState<string | null>(null)

  const [tiers, setTiers] = useState<CampaignPayoutTier[]>([])
  const [tiersLoading, setTiersLoading] = useState(false)
  const [tiersError, setTiersError] = useState<string | null>(null)

  const apps = useCampaignApplications(role === UserRole.BRAND ? (id ?? '') : '')

  const [profileOpen, setProfileOpen] = useState(false)
  const [profileInfluencerId, setProfileInfluencerId] = useState<string | null>(null)

  const canApply = role === UserRole.INFLUENCER && item?.status === 'published' && !appliedAt

  useEffect(() => {
    let mounted = true

    async function run() {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const res = await httpClient.get<ApiEnvelope<CampaignDetails>>(`/api/v1/campaigns/${id}?scope=all`)
        const payload = (res as any).data ?? res
        const data = payload?.data ?? payload
        if (!mounted) return
        setItem(data as CampaignDetails)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message ?? 'Failed to load campaign')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    void run()
    return () => {
      mounted = false
    }
  }, [httpClient, id])

  useEffect(() => {
    let mounted = true

    async function loadTiers() {
      if (!id) return
      setTiersError(null)
      setTiersLoading(true)
      try {
        const list = await container.listCampaignTiersUseCase.execute(id)
        if (!mounted) return
        setTiers(list ?? [])
      } catch (e: any) {
        if (!mounted) return
        setTiersError(e?.message ?? 'Failed to load tiers')
      } finally {
        if (!mounted) return
        setTiersLoading(false)
      }
    }

    void loadTiers()
    return () => {
      mounted = false
    }
  }, [container, id])

  useEffect(() => {
    let mounted = true

    async function loadApplied() {
      if (role !== UserRole.INFLUENCER) {
        setAppliedAt(null)
        return
      }

      try {
        const res = await httpClient.get<any>(`/api/v1/applications?page=1&size=200`)
        const payload = (res as any).data ?? res
        const list = (payload?.data ?? []) as ApplicationItem[]
        const found = list.find((a) => a.campaign_id === id)
        if (!mounted) return
        setAppliedAt(found?.created_at ?? null)
      } catch {
        if (!mounted) return
        setAppliedAt(null)
      }
    }

    void loadApplied()
    return () => {
      mounted = false
    }
  }, [httpClient, id, role])

  async function onApply() {
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
  }

  const tiersSorted = useMemo(() => [...tiers].sort((a, b) => Number(a.fromValue) - Number(b.fromValue)), [tiers])

  const openApplicantProfile = (influencerId: string) => {
    setProfileInfluencerId(influencerId)
    setProfileOpen(true)
  }

  const closeApplicantProfile = () => {
    setProfileOpen(false)
    setProfileInfluencerId(null)
  }

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[28px] border border-white/10 p-6 text-white">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-extrabold text-white/75">
              <span className={`h-2 w-2 rounded-full ${statusDot(item?.status)}`} />
              Campaign details
            </div>

            <h1 className="mt-3 truncate text-2xl font-black tracking-tight">{loading ? 'Loading…' : item?.title ?? '—'}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${statusBadge(item?.status)}`}>
                {item?.status ?? '—'}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/70">
                Budget: {money(item?.budget, 'MAD')}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/70">
                Dates: {fmtDate(item?.start_at)} → {fmtDate(item?.end_at)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/campaigns" className="bb-btn-ghost h-11 px-5">
              Back
            </Link>
            <Link to="/dashboard" className="bb-btn-ghost h-11 px-5">
              Dashboard
            </Link>

            {role === UserRole.INFLUENCER && appliedAt ? (
              <button disabled className="bb-btn-ghost h-11 px-5 opacity-70">
                Applied {fmtDate(appliedAt)}
              </button>
            ) : null}

            {canApply ? (
              <button disabled={applyLoading} onClick={onApply} className="bb-btn-primary h-11 px-5">
                {applyLoading ? 'Applying…' : 'Apply'}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {error ? (
        <div className="bb-pop mt-5 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {error}
        </div>
      ) : null}

      {applyError ? (
        <div className="bb-pop mt-4 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {applyError}
        </div>
      ) : null}

      {applySuccess ? (
        <div className="bb-pop mt-4 rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-100">
          {applySuccess}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white">
            <div className="pointer-events-none absolute inset-0 bb-spotlight" />
            <div className="pointer-events-none absolute inset-0 bb-noise" />

            <div className="relative">
              <p className="text-sm font-extrabold">Overview</p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-extrabold text-white/55">Objective</p>
                <p className="mt-2 text-sm font-semibold text-white/80">{item?.objective ?? '—'}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold text-white/55">Commission</p>
                  <p className="mt-2 text-sm font-extrabold text-white">
                    {item?.commission_type ? `${item.commission_type} • ${Number(item.commission_value ?? 0)}` : '—'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold text-white/55">Budget</p>
                  <p className="mt-2 text-sm font-extrabold text-white">{money(item?.budget, 'MAD')}</p>
                </div>
              </div>
            </div>
          </div>

          {role === UserRole.BRAND ? (
            <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white">
              <div className="pointer-events-none absolute inset-0 bb-spotlight" />
              <div className="pointer-events-none absolute inset-0 bb-noise" />

              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold">Applications</p>
                    <p className="mt-1 text-xs font-semibold text-white/55">Click an applicant to open the full profile</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button disabled={apps.loading} onClick={apps.refresh} className="bb-btn-ghost h-10 px-4">
                      Refresh
                    </button>
                    <button disabled={apps.loading || !apps.hasMore} onClick={apps.loadMore} className="bb-btn-ghost h-10 px-4">
                      Load more
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm text-white">
                      <thead className="border-b border-white/10 text-xs font-extrabold uppercase tracking-wider text-white/55">
                        <tr>
                          <th className="px-4 py-3">Applicant</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Message</th>
                          <th className="px-4 py-3">Applied</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-white/10">
                        {apps.loading && apps.items.length === 0 ? (
                          <tr>
                            <td className="px-4 py-6 text-white/60" colSpan={5}>
                              Loading…
                            </td>
                          </tr>
                        ) : null}

                        {!apps.loading && apps.items.length === 0 ? (
                          <tr>
                            <td className="px-4 py-6 text-white/60" colSpan={5}>
                              No applications yet.
                            </td>
                          </tr>
                        ) : null}

                        {apps.items.map((a) => {
                          const name = a.influencer?.displayName ?? 'Unknown'
                          const photo = a.influencer?.photoUrl ?? null
                          const isMutating = apps.mutatingId === a.id
                          const canShortlist = a.status === 'pending'
                          const canFinalize = a.status === 'pending' || a.status === 'shortlisted'
                          const canReject = a.status === 'pending' || a.status === 'shortlisted'

                          return (
                            <tr key={a.id} className="hover:bg-white/5">
                              <td className="px-4 py-3">
                                <button onClick={() => openApplicantProfile(a.influencerId)} className="flex items-center gap-3 text-left">
                                  <div className="h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                    {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : null}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-extrabold text-white">{name}</p>
                                    <p className="mt-1 truncate text-xs font-semibold text-white/45">{a.influencerId}</p>
                                  </div>
                                </button>
                              </td>

                              <td className="px-4 py-3">
                                <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${appBadge(a.status)}`}>
                                  {a.status}
                                </span>
                              </td>

                              <td className="px-4 py-3 text-white/70">
                                {(a.message ?? '').trim() ? <span className="line-clamp-1">{a.message}</span> : <span className="text-white/45">—</span>}
                              </td>

                              <td className="px-4 py-3 text-white/70">{fmtDate(a.createdAt)}</td>

                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                  <button disabled={!canShortlist || isMutating} onClick={() => apps.shortlist(a.id)} className="bb-btn-ghost h-10 px-4 disabled:opacity-60">
                                    Shortlist
                                  </button>

                                  <button disabled={!canFinalize || isMutating} onClick={() => apps.accept(a.id)} className="bb-btn-primary h-10 px-4 disabled:opacity-60">
                                    Finalize
                                  </button>

                                  <button disabled={!canReject || isMutating} onClick={() => apps.reject(a.id)} className="bb-btn-ghost h-10 px-4 disabled:opacity-60">
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white">
            <div className="pointer-events-none absolute inset-0 bb-spotlight" />
            <div className="pointer-events-none absolute inset-0 bb-noise" />

            <div className="relative">
              <p className="text-sm font-extrabold">Product</p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-extrabold text-white/55">Name</p>
                <p className="mt-2 text-sm font-extrabold text-white">{item?.product?.name ?? '—'}</p>
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-extrabold text-white/55">Landing URL</p>
                {item?.product?.landing_url ? (
                  <a
                    href={item.product.landing_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm font-extrabold text-sky-200 underline decoration-white/20 underline-offset-4 hover:text-white"
                  >
                    {item.product.landing_url}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-white/70">—</p>
                )}
              </div>

              <div className="mt-6">
                <p className="text-sm font-extrabold">Brand</p>
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {item?.brand?.photo_url ? <img src={item.brand.photo_url} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-white">{item?.brand?.display_name ?? '—'}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-white/45">{item?.brand?.id ?? ''}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white">
            <div className="pointer-events-none absolute inset-0 bb-spotlight" />
            <div className="pointer-events-none absolute inset-0 bb-noise" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold">Payout tiers</p>
                  <p className="mt-1 text-xs font-semibold text-white/55">Read-only here</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${TierPill()}`}>{tiersSorted.length} tiers</span>
              </div>

              {tiersError ? (
                <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm font-semibold text-rose-100">
                  {tiersError}
                </div>
              ) : null}

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm text-white">
                    <thead className="border-b border-white/10 text-xs font-extrabold uppercase tracking-wider text-white/55">
                      <tr>
                        <th className="px-4 py-3">From</th>
                        <th className="px-4 py-3">To</th>
                        <th className="px-4 py-3">Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {tiersLoading && tiersSorted.length === 0 ? (
                        <tr>
                          <td className="px-4 py-6 text-white/60" colSpan={3}>
                            Loading…
                          </td>
                        </tr>
                      ) : null}

                      {!tiersLoading && tiersSorted.length === 0 ? (
                        <tr>
                          <td className="px-4 py-6 text-white/60" colSpan={3}>
                            No tiers defined yet.
                          </td>
                        </tr>
                      ) : null}

                      {tiersSorted.map((t) => (
                        <tr key={t.id}>
                          <td className="px-4 py-3 font-semibold">{t.fromValue}</td>
                          <td className="px-4 py-3 text-white/75">{t.toValue ?? '∞'}</td>
                          <td className="px-4 py-3 text-white/75">
                            {Number(t.payoutAmount).toFixed(2)} {t.currency ?? 'MAD'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplicantProfileModal open={profileOpen} influencerId={profileInfluencerId} onClose={closeApplicantProfile} />
    </div>
  )
}