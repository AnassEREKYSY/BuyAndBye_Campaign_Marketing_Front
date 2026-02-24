import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'

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

export default function CampaignsPage() {
  const tokenStorage = useMemo(() => new CoreTokenStorage(), [])
  const httpClient = useMemo(() => new HttpClient(env.BACKEND_BASE_URL, tokenStorage), [tokenStorage])

  const [status, setStatus] = useState<'all' | CampaignStatus>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(12)

  const [items, setItems] = useState<CampaignListItem[]>([])
  const [meta, setMeta] = useState<{ current: number; last: number; total: number }>({ current: 1, last: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function run() {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.set('scope', 'all')
        params.set('page', String(page))
        params.set('size', String(size))
        if (status !== 'all') params.set('status', status)

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
  }, [httpClient, page, size, status])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (c) => (c.title ?? '').toLowerCase().includes(q) || (c.product?.name ?? '').toLowerCase().includes(q),
    )
  }, [items, query])

  const canPrev = meta.current > 1
  const canNext = meta.current < meta.last

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-extrabold text-white/75">
              <span className="inline-block h-2 w-2 rounded-full bg-sky-300/80 shadow-[0_0_18px_rgba(56,189,248,0.35)]" />
              Campaigns
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white">Browse campaigns</h1>
            <p className="mt-1 text-sm font-semibold text-white/60">All campaigns, paginated, with quick filters.</p>
          </div>

          <Link to="/dashboard" className="bb-btn-ghost h-11 px-5">
            Back to dashboard
          </Link>
        </div>

        <div className="relative mt-5 grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title or product…"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-extrabold text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:bg-white/10 focus:shadow-[0_0_0_6px_rgba(56,189,248,0.12)]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any)
                setPage(1)
              }}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-extrabold text-white outline-none transition hover:bg-white/10 focus:border-white/20 focus:shadow-[0_0_0_6px_rgba(56,189,248,0.12)]"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value))
                setPage(1)
              }}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-extrabold text-white outline-none transition hover:bg-white/10 focus:border-white/20 focus:shadow-[0_0_0_6px_rgba(56,189,248,0.12)]"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button
              disabled={!canPrev}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="bb-btn-ghost h-12 px-4 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={!canNext}
              onClick={() => setPage((p) => p + 1)}
              className="bb-btn-primary h-12 px-4 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="relative mt-3 flex items-center justify-between text-xs font-semibold text-white/45">
          <span>
            Page {meta.current} / {meta.last}
          </span>
          <span>{meta.total} total</span>
        </div>
      </div>

      {error ? (
        <div className="bb-pop mt-5 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(loading ? Array.from({ length: size }) : filtered).map((c: any, idx: number) =>
          loading ? (
            <div key={`sk_${idx}`} className="bb-card bb-pop relative overflow-hidden rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="h-4 w-2/3 rounded bg-white/10" />
              <div className="mt-3 h-3 w-1/3 rounded bg-white/10" />
              <div className="mt-6 h-10 rounded-2xl bg-white/10" />
            </div>
          ) : (
            <Link
              key={c.id}
              to={`/campaigns/${c.id}`}
              className="bb-gradient-border bb-glass bb-ring bb-pop group relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white transition will-change-transform hover:-translate-y-0.5"
            >
              <div className="bb-shimmer pointer-events-none absolute inset-0 opacity-70" />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot(c.status)}`} />
                      <p className="truncate text-sm font-extrabold">{c.title}</p>
                    </div>
                    <p className="mt-1 truncate text-xs font-semibold text-white/55">
                      Product: <span className="text-white/80">{c.product?.name ?? '—'}</span>
                    </p>
                  </div>

                  <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-extrabold ${statusBadge(c.status)}`}>
                    {c.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 transition group-hover:bg-white/8">
                    <p className="text-[11px] font-extrabold text-white/55">Start</p>
                    <p className="mt-2 text-xs font-extrabold text-white/85">{fmtDate(c.start_at)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 transition group-hover:bg-white/8">
                    <p className="text-[11px] font-extrabold text-white/55">End</p>
                    <p className="mt-2 text-xs font-extrabold text-white/85">{fmtDate(c.end_at)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-white/55">
                  <span className="truncate">
                    {c.commission_type ? `${c.commission_type} • ${Number(c.commission_value ?? 0)}` : '—'}
                  </span>
                  <span className="shrink-0">{money(c.budget, 'MAD')}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-white/45">Open details</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/75 transition group-hover:bg-white/10">
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