import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { DashboardHeader } from '@/modules/dashboard/presentation/components/DashboardHeader'

type CampaignStatus = 'draft' | 'published' | 'closed'
type CampaignListItem = {
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
}

type ApplicationItem = {
  id: string
  campaign_id: string
  created_at?: string | null
}

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
  return 'border-slate-400/25 bg-slate-500/10 text-slate-200'
}

function statusDot(status?: string) {
  if (status === 'published') return 'bg-emerald-300/90 shadow-[0_0_18px_rgba(16,185,129,0.35)]'
  if (status === 'draft') return 'bg-amber-300/90 shadow-[0_0_18px_rgba(245,158,11,0.35)]'
  if (status === 'closed') return 'bg-rose-300/90 shadow-[0_0_18px_rgba(244,63,94,0.35)]'
  return 'bg-white/35'
}

function SkeletonCard() {
  return (
    <div className="bb-card relative overflow-hidden">
      <div className="h-4 w-2/3 rounded bg-black/10 dark:bg-white/10" />
      <div className="mt-3 h-3 w-1/3 rounded bg-black/10 dark:bg-white/10" />
      <div className="mt-6 h-10 rounded-2xl bg-black/10 dark:bg-white/10" />
    </div>
  )
}

export default function CampaignsPage() {
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

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(12)

  const [items, setItems] = useState<CampaignListItem[]>([])
  const [meta, setMeta] = useState<{ current: number; last: number; total: number }>({ current: 1, last: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [appliedMap, setAppliedMap] = useState<Record<string, string>>({})

  useEffect(() => {
    let mounted = true

    async function loadApplications() {
      if (role !== UserRole.INFLUENCER) {
        setAppliedMap({})
        return
      }

      try {
        const res = await httpClient.get<any>(`/api/v1/applications?page=1&size=200`)
        const payload = (res as any).data ?? res
        const list = (payload?.data ?? []) as ApplicationItem[]
        const map: Record<string, string> = {}
        for (const a of list) {
          if (a?.campaign_id) map[a.campaign_id] = (a.created_at ?? '') || ''
        }
        if (!mounted) return
        setAppliedMap(map)
      } catch {
        if (!mounted) return
        setAppliedMap({})
      }
    }

    void loadApplications()
    return () => {
      mounted = false
    }
  }, [httpClient, role])

  useEffect(() => {
    let mounted = true

    async function run() {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.set('scope', 'all')
        params.set('status', 'published')
        params.set('page', String(page))
        params.set('size', String(size))

        const res = await httpClient.get<ApiPaginated<CampaignListItem>>(`/api/v1/campaigns?${params.toString()}`)
        const payload = (res as any).data ?? res
        const data = (payload?.data ?? []) as CampaignListItem[]
        const m = payload?.meta ?? {}

        if (!mounted) return
        setItems(data)
        setMeta({
          current: Number(m.current_page ?? page) || page,
          last: Number(m.last_page ?? 1) || 1,
          total: Number(m.total ?? data.length) || data.length,
        })
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message ?? 'Failed to load campaigns')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    void run()
    return () => {
      mounted = false
    }
  }, [httpClient, page, size])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((c) => (c.title ?? '').toLowerCase().includes(q) || (c.product?.name ?? '').toLowerCase().includes(q))
  }, [items, search])

  const canPrev = meta.current > 1
  const canNext = meta.current < meta.last

  const rightSlot = (
    <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
      <select
        value={size}
        onChange={(e) => {
          setSize(Number(e.target.value))
          setPage(1)
        }}
        className="bb-select"
      >
        <option value={8}>8 / page</option>
        <option value={12}>12 / page</option>
        <option value={20}>20 / page</option>
      </select>

      <div className="flex items-center gap-2">
        <button disabled={!canPrev} onClick={() => setPage((p) => Math.max(1, p - 1))} className="bb-btn-ghost h-11 px-4 disabled:opacity-50">
          Prev
        </button>
        <button disabled={!canNext} onClick={() => setPage((p) => p + 1)} className="bb-btn-primary h-11 px-4 disabled:opacity-50">
          Next
        </button>
      </div>

      <Link to="/dashboard" className="bb-btn-ghost h-11 px-4">
        Dashboard
      </Link>
    </div>
  )

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-pop">
        <DashboardHeader
          title="Browse campaigns"
          subtitle="Only published campaigns are shown."
          search={search}
          onSearch={(v) => {
            setSearch(v)
            setPage(1)
          }}
          rightSlot={rightSlot}
          searchPlaceholder="Filter by title or product…"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-semibold bb-muted-weak">
        <span>
          Page {meta.current} / {meta.last}
        </span>
        <span>{meta.total} total</span>
      </div>

      {error ? (
        <div className="bb-pop mt-5 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(loading ? Array.from({ length: size }) : filtered).map((c: any, idx: number) =>
          loading ? (
            <div key={`sk_${idx}`} className="bb-pop">
              <SkeletonCard />
            </div>
          ) : (
            <Link
              key={c.id}
              to={`/campaigns/${c.id}`}
              className={`bb-pop bb-card group relative overflow-hidden rounded-[26px] border p-5 transition will-change-transform hover:-translate-y-0.5 ${
                appliedMap[c.id] ? 'opacity-70 grayscale-[0.25]' : ''
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bb-shimmer opacity-70" />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot(c.status)}`} />
                      <p className="truncate text-sm font-extrabold">{c.title}</p>
                    </div>
                    <p className="mt-1 truncate text-xs font-semibold bb-muted-weak">
                      Product: <span className="opacity-90">{c.product?.name ?? '—'}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-extrabold ${statusBadge(c.status)}`}>
                      {c.status}
                    </span>

                    {role === UserRole.INFLUENCER && appliedMap[c.id] ? (
                      <span className="rounded-full border border-slate-400/25 bg-slate-500/10 px-3 py-1 text-[11px] font-extrabold text-slate-200">
                        Applied {fmtDate(appliedMap[c.id])}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 transition group-hover:bg-white/10 dark:border-white/10 dark:bg-white/5">
                    <p className="text-[11px] font-extrabold bb-muted-weak">Start</p>
                    <p className="mt-2 text-xs font-extrabold opacity-90">{fmtDate(c.start_at)}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 transition group-hover:bg-white/10 dark:border-white/10 dark:bg-white/5">
                    <p className="text-[11px] font-extrabold bb-muted-weak">End</p>
                    <p className="mt-2 text-xs font-extrabold opacity-90">{fmtDate(c.end_at)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold bb-muted">
                  <span className="truncate">
                    {c.commission_type ? `${c.commission_type} • ${Number(c.commission_value ?? 0)}` : '—'}
                  </span>
                  <span className="shrink-0 opacity-90">{money(c.budget, 'MAD')}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold bb-muted-weak">Open details</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold opacity-90 transition group-hover:bg-white/10">
                    View
                  </span>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </div>
  )
}