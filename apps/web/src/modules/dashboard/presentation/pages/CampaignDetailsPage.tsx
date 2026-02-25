import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'

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

  const [item, setItem] = useState<CampaignDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [applyLoading, setApplyLoading] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [applySuccess, setApplySuccess] = useState<string | null>(null)

  const [appliedAt, setAppliedAt] = useState<string | null>(null)

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

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-pop flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-extrabold text-white/75">
            <span className={`h-2 w-2 rounded-full ${statusDot(item?.status)}`} />
            Campaign
          </div>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-white">{loading ? 'Loading…' : item?.title ?? '—'}</h1>
          <p className="mt-1 text-sm font-semibold text-white/60">Details & product information</p>
        </div>

        <div className="flex items-center gap-2">
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
        <div className="lg:col-span-7">
          <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white">
            <div className="pointer-events-none absolute inset-0 bb-spotlight" />
            <div className="pointer-events-none absolute inset-0 bb-noise" />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-extrabold">Campaign details</p>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${statusBadge(item?.status)}`}>
                  {item?.status ?? '—'}
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-extrabold text-white/55">Objective</p>
                <p className="mt-2 text-sm font-semibold text-white/80">{item?.objective ?? '—'}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold text-white/55">Start</p>
                  <p className="mt-2 text-sm font-extrabold text-white">{fmtDate(item?.start_at)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold text-white/55">End</p>
                  <p className="mt-2 text-sm font-extrabold text-white">{fmtDate(item?.end_at)}</p>
                </div>
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

              {role === UserRole.BRAND ? (
                <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm font-semibold text-amber-100">
                  Brands can browse campaigns but can’t apply.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
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

              {role === UserRole.INFLUENCER && appliedAt ? (
                <div className="mt-5 rounded-2xl border border-slate-400/20 bg-slate-500/10 p-4 text-sm font-semibold text-slate-100">
                  You already applied on {fmtDate(appliedAt)}.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}