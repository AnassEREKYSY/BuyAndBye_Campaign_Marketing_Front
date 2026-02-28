import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { DashboardContainer } from '@core/modules/dashboard'
import type { CampaignPayoutTier } from '@core/modules/dashboard/domain/entities'
import { useCampaignApplications } from '@/modules/dashboard/application/hooks/useCampaignApplications'
import { ApplicantProfileModal } from '@/modules/dashboard/presentation/components/ApplicantProfileModal'
import {
  ArrowLeftIcon,
  Squares2X2Icon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

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
  product?: { id: string; name?: string; landing_url?: string | null } | null
  brand?: { id: string; display_name?: string; photo_url?: string | null } | null
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

function statusPill(status?: string) {
  const s = (status ?? '').toLowerCase()
  if (s === 'published') return { border: 'rgb(16 185 129 / 0.25)', bg: 'rgb(16 185 129 / 0.10)', text: 'rgb(110 231 183 / 0.95)' }
  if (s === 'draft') return { border: 'rgb(245 158 11 / 0.25)', bg: 'rgb(245 158 11 / 0.10)', text: 'rgb(253 230 138 / 0.95)' }
  if (s === 'closed') return { border: 'rgb(244 63 94 / 0.25)', bg: 'rgb(244 63 94 / 0.10)', text: 'rgb(253 164 175 / 0.95)' }
  return { border: 'rgb(var(--bb-border) / 0.10)', bg: 'rgb(var(--bb-border) / 0.04)', text: 'rgb(var(--bb-muted) / 0.90)' }
}

function appPill(status?: string) {
  const s = (status ?? '').toLowerCase()
  if (s === 'shortlisted') return statusPill('draft')
  if (s === 'accepted') return statusPill('published')
  if (s === 'rejected') return statusPill('closed')
  return statusPill('unknown')
}

function SoftBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
      }}
    >
      {children}
    </div>
  )
}

function Alert({ kind, children }: { kind: 'error' | 'success'; children: React.ReactNode }) {
  const styles =
    kind === 'success'
      ? { borderColor: 'rgb(16 185 129 / 0.25)', backgroundColor: 'rgb(16 185 129 / 0.10)', color: 'rgb(var(--bb-text) / 0.92)' }
      : { borderColor: 'rgb(244 63 94 / 0.25)', backgroundColor: 'rgb(244 63 94 / 0.10)', color: 'rgb(var(--bb-text) / 0.92)' }

  return (
    <div className="bb-pop rounded-3xl border p-4 text-sm font-semibold" style={styles}>
      {children}
    </div>
  )
}

function TopActionLink({
  to,
  icon,
  label,
}: {
  to: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      to={to}
      className="bb-icon-btn h-11 w-11 sm:w-auto sm:px-4"
      aria-label={label}
    >
      <span className="inline-flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full border"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.10)',
            backgroundColor: 'rgb(var(--bb-border) / 0.04)',
          }}
        >
          {icon}
        </span>
        <span className="hidden sm:inline text-sm font-extrabold">{label}</span>
      </span>
    </Link>
  )
}

function TopChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border px-4 py-3"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
      }}
    >
      <span
        className="grid h-10 w-10 place-items-center rounded-2xl border"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
          color: 'rgb(var(--bb-text) / 0.90)',
        }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold tracking-wide" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
          {value}
        </p>
      </div>
    </div>
  )
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

  const st = statusPill(item?.status)

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      {/* TOP SECTION */}
      <section
        className="bb-pop relative overflow-hidden rounded-3xl border p-5 sm:p-6"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-surface) / 0.80)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                  style={{ borderColor: st.border, backgroundColor: st.bg, color: st.text }}
                >
                  {item?.status ?? '—'}
                </span>

                <span
                  className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    color: 'rgb(var(--bb-muted) / 0.90)',
                  }}
                >
                  Campaign
                </span>
              </div>

              <h1 className="mt-3 truncate text-2xl font-black tracking-tight sm:text-3xl" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
                {loading ? 'Loading…' : item?.title ?? 'Campaign'}
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                {loading ? '—' : (item?.objective ?? 'Campaign details, product info, tiers and applications.')}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
              <TopActionLink to="/campaigns" label="Back" icon={<ArrowLeftIcon className="h-5 w-5" />} />
              <TopActionLink to="/dashboard" label="Dashboard" icon={<Squares2X2Icon className="h-5 w-5" />} />

              {role === UserRole.INFLUENCER && appliedAt ? (
                <div
                  className="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-extrabold"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    color: 'rgb(var(--bb-text) / 0.92)',
                  }}
                >
                  <CheckCircleIcon className="h-5 w-5" style={{ color: 'rgb(16 185 129 / 0.9)' }} />
                  <span className="hidden sm:inline">Applied</span>
                  <span className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                    {fmtDate(appliedAt)}
                  </span>
                </div>
              ) : null}

              {canApply ? (
                <button disabled={applyLoading} onClick={onApply} className="bb-btn-primary h-11 px-4">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full border"
                      style={{
                        borderColor: 'rgb(255 255 255 / 0.18)',
                        backgroundColor: 'rgb(255 255 255 / 0.10)',
                      }}
                    >
                      {applyLoading ? <ClockIcon className="h-5 w-5" /> : <PaperAirplaneIcon className="h-5 w-5" />}
                    </span>
                    <span className="hidden sm:inline">{applyLoading ? 'Applying…' : 'Apply'}</span>
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <TopChip
              icon={<BanknotesIcon className="h-5 w-5" />}
              label="Budget"
              value={money(item?.budget, 'MAD')}
            />
            <TopChip
              icon={<CalendarDaysIcon className="h-5 w-5" />}
              label="Dates"
              value={`${fmtDate(item?.start_at)} → ${fmtDate(item?.end_at)}`}
            />
            <TopChip
              icon={<TagIcon className="h-5 w-5" />}
              label="Commission"
              value={item?.commission_type ? `${item.commission_type} • ${Number(item.commission_value ?? 0)}` : '—'}
            />
          </div>
        </div>
      </section>

      {error ? <div className="mt-5"><Alert kind="error">{error}</Alert></div> : null}
      {applyError ? <div className="mt-4"><Alert kind="error">{applyError}</Alert></div> : null}
      {applySuccess ? <div className="mt-4"><Alert kind="success">{applySuccess}</Alert></div> : null}

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bb-card bb-pop rounded-[26px] p-5">
            <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
              Overview
            </p>

            <div className="mt-4 grid gap-3">
              <SoftBox>
                <p className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  Objective
                </p>
                <p className="mt-2 text-sm font-semibold" style={{ color: 'rgb(var(--bb-text) / 0.90)' }}>
                  {loading ? '—' : item?.objective ?? '—'}
                </p>
              </SoftBox>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SoftBox>
                  <p className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Commission
                  </p>
                  <p className="mt-2 text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                    {item?.commission_type ? `${item.commission_type} • ${Number(item.commission_value ?? 0)}` : '—'}
                  </p>
                </SoftBox>

                <SoftBox>
                  <p className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Budget
                  </p>
                  <p className="mt-2 text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                    {money(item?.budget, 'MAD')}
                  </p>
                </SoftBox>
              </div>
            </div>
          </div>

          {/* Applications (brand) */}
          {role === UserRole.BRAND ? (
            <div className="bb-card bb-pop rounded-[26px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                    Applications
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Click an applicant to open the full profile.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button disabled={apps.loading} onClick={apps.refresh} className="bb-btn-ghost h-10 px-4">
                    Refresh
                  </button>
                  <button disabled={apps.loading || !apps.hasMore} onClick={apps.loadMore} className="bb-btn-ghost h-10 px-4">
                    Load more
                  </button>
                </div>
              </div>

              <div className="mt-4 bb-table-wrap">
                <div className="overflow-x-auto">
                  <table className="bb-table min-w-[760px]">
                    <thead className="bb-thead">
                      <tr>
                        <th className="bb-th">Applicant</th>
                        <th className="bb-th">Status</th>
                        <th className="bb-th">Message</th>
                        <th className="bb-th">Applied</th>
                        <th className="bb-th text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {apps.loading && apps.items.length === 0 ? (
                        <tr className="bb-tr">
                          <td className="bb-td bb-muted" colSpan={5}>
                            Loading…
                          </td>
                        </tr>
                      ) : null}

                      {!apps.loading && apps.items.length === 0 ? (
                        <tr className="bb-tr">
                          <td className="bb-td bb-muted" colSpan={5}>
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

                        const ap = appPill(a.status)

                        return (
                          <tr key={a.id} className="bb-tr bb-tr-hover">
                            <td className="bb-td">
                              <button onClick={() => openApplicantProfile(a.influencerId)} className="flex items-center gap-3 text-left">
                                <div
                                  className="h-10 w-10 overflow-hidden rounded-2xl border"
                                  style={{
                                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                                  }}
                                >
                                  {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : null}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-extrabold">{name}</p>
                                  <p className="mt-1 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                                    {a.influencerId}
                                  </p>
                                </div>
                              </button>
                            </td>

                            <td className="bb-td">
                              <span
                                className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                                style={{ borderColor: ap.border, backgroundColor: ap.bg, color: ap.text }}
                              >
                                {a.status}
                              </span>
                            </td>

                            <td className="bb-td bb-muted">
                              {(a.message ?? '').trim() ? <span className="line-clamp-1">{a.message}</span> : '—'}
                            </td>

                            <td className="bb-td bb-muted">{fmtDate(a.createdAt)}</td>

                            <td className="bb-td">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  disabled={!canShortlist || isMutating}
                                  onClick={() => apps.shortlist(a.id)}
                                  className="bb-btn-ghost h-10 px-4 disabled:opacity-60"
                                >
                                  Shortlist
                                </button>

                                <button
                                  disabled={!canFinalize || isMutating}
                                  onClick={() => apps.accept(a.id)}
                                  className="bb-btn-primary h-10 px-4 disabled:opacity-60"
                                >
                                  Finalize
                                </button>

                                <button
                                  disabled={!canReject || isMutating}
                                  onClick={() => apps.reject(a.id)}
                                  className="bb-btn-ghost h-10 px-4 disabled:opacity-60"
                                >
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
          ) : null}
        </div>

        {/* Right */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="bb-card bb-pop rounded-[26px] p-5">
            <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
              Product
            </p>

            <div className="mt-4 grid gap-3">
              <SoftBox>
                <p className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  Name
                </p>
                <p className="mt-2 text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                  {loading ? '—' : item?.product?.name ?? '—'}
                </p>
              </SoftBox>

              <SoftBox>
                <p className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  Landing URL
                </p>
                {item?.product?.landing_url ? (
                  <a
                    href={item.product.landing_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm font-extrabold underline underline-offset-4"
                    style={{ color: 'rgb(var(--bb-text) / 0.86)', textDecorationColor: 'rgb(var(--bb-border) / 0.25)' }}
                  >
                    {item.product.landing_url}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                    —
                  </p>
                )}
              </SoftBox>
            </div>

            <div className="mt-6">
              <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                Brand
              </p>

              <div
                className="mt-3 flex items-center gap-3 rounded-2xl border p-4"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                }}
              >
                <div
                  className="h-10 w-10 overflow-hidden rounded-2xl border"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  }}
                >
                  {item?.brand?.photo_url ? <img src={item.brand.photo_url} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                    {item?.brand?.display_name ?? '—'}
                  </p>
                  <p className="mt-1 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    {item?.brand?.id ?? ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bb-card bb-pop rounded-[26px] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                  Payout tiers
                </p>
                <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  Read-only here.
                </p>
              </div>

              <span
                className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: 'rgb(var(--bb-muted) / 0.90)',
                }}
              >
                {tiersSorted.length} tiers
              </span>
            </div>

            {tiersError ? <div className="mt-4"><Alert kind="error">{tiersError}</Alert></div> : null}

            <div className="mt-4 bb-table-wrap">
              <div className="overflow-x-auto">
                <table className="bb-table min-w-[520px]">
                  <thead className="bb-thead">
                    <tr>
                      <th className="bb-th">From</th>
                      <th className="bb-th">To</th>
                      <th className="bb-th">Payout</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tiersLoading && tiersSorted.length === 0 ? (
                      <tr className="bb-tr">
                        <td className="bb-td bb-muted" colSpan={3}>
                          Loading…
                        </td>
                      </tr>
                    ) : null}

                    {!tiersLoading && tiersSorted.length === 0 ? (
                      <tr className="bb-tr">
                        <td className="bb-td bb-muted" colSpan={3}>
                          No tiers defined yet.
                        </td>
                      </tr>
                    ) : null}

                    {tiersSorted.map((t) => (
                      <tr key={t.id} className="bb-tr">
                        <td className="bb-td font-semibold">{t.fromValue}</td>
                        <td className="bb-td bb-muted">{t.toValue ?? '∞'}</td>
                        <td className="bb-td bb-muted">
                          {Number(t.payoutAmount).toFixed(2)} {t.currency ?? 'MAD'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {role === UserRole.INFLUENCER ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {item?.product?.landing_url ? (
                  <a href={item.product.landing_url} target="_blank" rel="noreferrer" className="bb-btn-ghost h-11 px-5">
                    Open landing
                  </a>
                ) : null}

                {canApply ? (
                  <button disabled={applyLoading} onClick={onApply} className="bb-btn-primary h-11 px-5">
                    {applyLoading ? 'Applying…' : 'Apply now'}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <ApplicantProfileModal open={profileOpen} influencerId={profileInfluencerId} onClose={closeApplicantProfile} />
    </div>
  )
}