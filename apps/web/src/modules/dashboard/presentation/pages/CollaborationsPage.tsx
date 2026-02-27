import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardHeader } from '@/modules/dashboard/presentation/components/DashboardHeader'
import { DashboardContainer } from '@core/modules/dashboard/infrastructure/container/DashboardContainer'
import type { Collaboration } from '@core/modules/dashboard'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'

function badgeStyle(status?: string) {
  const s = (status ?? '').toLowerCase()
  if (s === 'accepted' || s === 'active') return { border: 'rgb(16 185 129 / 0.25)', bg: 'rgb(16 185 129 / 0.10)', text: 'rgb(110 231 183 / 0.95)' }
  if (s === 'pending' || s === 'shortlisted') return { border: 'rgb(245 158 11 / 0.25)', bg: 'rgb(245 158 11 / 0.10)', text: 'rgb(253 230 138 / 0.95)' }
  if (s === 'rejected' || s === 'closed') return { border: 'rgb(244 63 94 / 0.25)', bg: 'rgb(244 63 94 / 0.10)', text: 'rgb(253 164 175 / 0.95)' }
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

export default function CollaborationsPage() {
  const tokenStorage = useMemo(() => new CoreTokenStorage(), [])
  const httpClient = useMemo(() => new HttpClient(env.BACKEND_BASE_URL, tokenStorage), [tokenStorage])
  const container = useMemo(() => DashboardContainer.getInstance(httpClient), [httpClient])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Collaboration[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const list = await container.listCollaborationsUseCase.execute({ page: 1, size: 200 })
        if (!mounted) return
        setItems(list ?? [])
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message ?? 'Failed to load collaborations.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    void run()
    return () => {
      mounted = false
    }
  }, [container])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((c: any) => {
      const title = (c?.campaign?.title ?? '').toLowerCase()
      const promo = (c?.promo?.code ?? '').toLowerCase()
      const tracking = (c?.tracking?.code ?? '').toLowerCase()
      const st = (c?.status ?? '').toLowerCase()
      return title.includes(q) || promo.includes(q) || tracking.includes(q) || st.includes(q)
    })
  }, [items, search])

  const rightSlot = (
    <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
      <Link to="/campaigns" className="bb-btn-primary h-11 px-5">
        Browse campaigns
      </Link>
      <Link to="/dashboard" className="bb-btn-ghost h-11 px-5">
        Dashboard
      </Link>
    </div>
  )

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-pop">
        <DashboardHeader
          title="Collaborations"
          subtitle="Tracking link, promo code, and status."
          search={search}
          onSearch={setSearch}
          rightSlot={rightSlot}
          searchPlaceholder="Search by campaign, promo, tracking, status…"
        />
      </div>

      {error ? (
        <div
          className="bb-pop mt-5 rounded-3xl border p-4 text-sm font-semibold"
          style={{ borderColor: 'rgb(244 63 94 / 0.25)', backgroundColor: 'rgb(244 63 94 / 0.10)', color: 'rgb(var(--bb-text) / 0.92)' }}
        >
          {error}
        </div>
      ) : null}

      <div className="mt-5">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bb-pop">
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
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
              <button onClick={() => setSearch('')} className="bb-btn-ghost h-11 px-5">
                Clear search
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
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
                    {filtered.map((c: any) => {
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

            {/* Mobile cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filtered.map((c: any) => {
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