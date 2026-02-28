import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useCampaignsMarketplace } from '@/modules/dashboard/application/hooks/useCampaignsMarketplace'
import {
  Squares2X2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

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

function TopPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
        color: 'rgb(var(--bb-muted) / 0.90)',
      }}
    >
      {children}
    </span>
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

  const {
    search,
    setSearch,
    page,
    setPage,
    size,
    setSize,
    filtered,
    meta,
    loading,
    error,
    appliedMap,
    canPrev,
    canNext,
  } = useCampaignsMarketplace(role)

  const rightSlot = (
    <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:justify-end">
      <div className="flex items-center gap-2">
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

        <button disabled={!canPrev} onClick={() => setPage((p) => Math.max(1, p - 1))} className="bb-icon-btn h-11 w-11 disabled:opacity-50" aria-label="Previous">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <button disabled={!canNext} onClick={() => setPage((p) => p + 1)} className="bb-icon-btn h-11 w-11 disabled:opacity-50" aria-label="Next">
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        <Link to="/dashboard" className="bb-icon-btn h-11 w-11" aria-label="Dashboard">
          <Squares2X2Icon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <section
        className="bb-pop relative overflow-hidden rounded-3xl border p-5 sm:p-6"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-surface) / 0.82)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <TopPill>
                  <SparklesIcon className="h-4 w-4" />
                  Published
                </TopPill>
                <TopPill>
                  Page {meta.current}/{meta.last}
                </TopPill>
                <TopPill>{meta.total} total</TopPill>
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
                Campaign marketplace
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.92)' }}>
                Find offers, compare budgets, and open details in one click.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <div
                className="bb-pop rounded-3xl border p-2"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                }}
              >
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-end">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </span>
                    <input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                      }}
                      placeholder="Search by title or product…"
                      className="bb-input pl-11"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button type="button" className="bb-icon-btn h-11 w-11" aria-label="Filters">
                      <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    </button>
                    {rightSlot}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="bb-pop mt-4 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      {!loading && !error && filtered.length === 0 ? (
        <div className="bb-empty bb-pop mt-5">
          <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
            No campaigns found
          </p>
          <p className="mt-2 text-sm" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
            Try clearing your search.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setSearch('')} className="bb-btn-ghost h-11 px-5">
              Clear search
            </button>
          </div>
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