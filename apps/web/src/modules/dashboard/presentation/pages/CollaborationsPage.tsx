import { Link } from 'react-router-dom'
import { useCollaborationsList } from '@/modules/dashboard/application/hooks/useCollaborationsList'
import { Squares2X2Icon, RocketLaunchIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline'

function badgeStyle(status?: string) {
  const s = (status ?? '').toLowerCase()
  if (s === 'accepted' || s === 'active')
    return { border: 'rgb(16 185 129 / 0.25)', bg: 'rgb(16 185 129 / 0.10)', text: 'rgb(110 231 183 / 0.95)' }
  if (s === 'pending' || s === 'shortlisted')
    return { border: 'rgb(245 158 11 / 0.25)', bg: 'rgb(245 158 11 / 0.10)', text: 'rgb(253 230 138 / 0.95)' }
  if (s === 'rejected' || s === 'closed')
    return { border: 'rgb(244 63 94 / 0.25)', bg: 'rgb(244 63 94 / 0.10)', text: 'rgb(253 164 175 / 0.95)' }
  return { border: 'rgb(var(--bb-border) / 0.10)', bg: 'rgb(var(--bb-border) / 0.04)', text: 'rgb(var(--bb-muted) / 0.90)' }
}

function SkeletonCard() {
  return (
    <div className="bb-card">
      <div className="h-4 w-2/3 rounded" style={{ backgroundColor: 'rgb(var(--bb-border) / 0.06)' }} />
      <div className="mt-3 h-3 w-1/2 rounded" style={{ backgroundColor: 'rgb(var(--bb-border) / 0.06)' }} />
      <div className="mt-6 h-10 rounded-2xl" style={{ backgroundColor: 'rgb(var(--bb-border) / 0.06)' }} />
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

export default function CollaborationsPage() {
  const { loading, error, items, search, setSearch } = useCollaborationsList()

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      {/* TOP SECTION (REDESIGNED) */}
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
                  Workspace
                </TopPill>
                <TopPill>{items.length} collaboration(s)</TopPill>
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
                Collaborations
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.92)' }}>
                Tracking link, promo code, and status — all in one place.
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
                    <span
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </span>

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by campaign, promo, tracking, status…"
                      className="bb-input pl-11"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link to="/campaigns" className="bb-btn-primary h-11 px-4">
                      <span className="inline-flex items-center gap-2">
                        <RocketLaunchIcon className="h-5 w-5" />
                        <span>Browse campaigns</span>
                      </span>
                    </Link>

                    <Link to="/dashboard" className="bb-icon-btn h-11 w-11" aria-label="Dashboard">
                      <Squares2X2Icon className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div
              className="bb-pop mt-4 rounded-3xl border p-4 text-sm font-semibold"
              style={{
                borderColor: 'rgb(244 63 94 / 0.25)',
                backgroundColor: 'rgb(244 63 94 / 0.10)',
                color: 'rgb(var(--bb-text) / 0.92)',
              }}
            >
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-5">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bb-pop">
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bb-empty bb-pop">
            <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
              No collaborations found
            </p>
            <p className="mt-2 text-sm" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
              Try changing your search, or browse campaigns to start one.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/campaigns" className="bb-btn-primary h-11 px-5">
                Browse campaigns
              </Link>
              <button onClick={() => setSearch('')} className="bb-btn-ghost h-11 px-5" type="button">
                Clear search
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bb-pop hidden md:block bb-table-wrap">
              <div className="overflow-x-auto">
                <table className="bb-table min-w-[900px]">
                  <thead className="bb-thead">
                    <tr>
                      <th className="bb-th">Campaign</th>
                      <th className="bb-th">Status</th>
                      <th className="bb-th">Promo code</th>
                      <th className="bb-th">Tracking</th>
                      <th className="bb-th text-right">Open</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((c: any) => {
                      const b = badgeStyle(c.status)
                      return (
                        <tr key={c.id} className="bb-tr bb-tr-hover">
                          <td className="bb-td">
                            <p className="text-sm font-extrabold">{c?.campaign?.title ?? 'Collaboration'}</p>
                            <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                              {c.id}
                            </p>
                          </td>
                          <td className="bb-td">
                            <span
                              className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                              style={{ borderColor: b.border, backgroundColor: b.bg, color: b.text }}
                            >
                              {c.status ?? '—'}
                            </span>
                          </td>
                          <td className="bb-td bb-muted">{c?.promo?.code ?? '—'}</td>
                          <td className="bb-td bb-muted">{c?.tracking?.code ?? '—'}</td>
                          <td className="bb-td text-right">
                            <Link to={`/collaborations/${c.id}`} className="bb-btn-ghost h-10 px-4">
                              View
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:hidden">
              {items.map((c: any) => {
                const b = badgeStyle(c.status)
                return (
                  <Link key={c.id} to={`/collaborations/${c.id}`} className="bb-pop bb-card group rounded-[26px] p-5 transition hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">{c?.campaign?.title ?? 'Collaboration'}</p>
                        <p className="mt-1 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                          {c.id}
                        </p>
                      </div>

                      <span
                        className="shrink-0 rounded-full border px-3 py-1 text-[11px] font-extrabold"
                        style={{ borderColor: b.border, backgroundColor: b.bg, color: b.text }}
                      >
                        {c.status ?? '—'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div
                        className="rounded-2xl border p-3"
                        style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                      >
                        <p className="text-[11px] font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                          Promo
                        </p>
                        <p className="mt-2 text-xs font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.90)' }}>
                          {c?.promo?.code ?? '—'}
                        </p>
                      </div>

                      <div
                        className="rounded-2xl border p-3"
                        style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                      >
                        <p className="text-[11px] font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                          Tracking
                        </p>
                        <p className="mt-2 text-xs font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.90)' }}>
                          {c?.tracking?.code ?? '—'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                      <span>Open details</span>
                      <span style={{ color: 'rgb(var(--bb-text) / 0.90)' }} className="opacity-85 group-hover:opacity-100">
                        View →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}