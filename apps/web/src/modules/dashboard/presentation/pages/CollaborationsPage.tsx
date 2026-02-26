import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardContainer } from '@core/modules/dashboard/infrastructure/container/DashboardContainer'
import type { Collaboration } from '@core/modules/dashboard'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'

export default function CollaborationsPage() {
  const tokenStorage = useMemo(() => new CoreTokenStorage(), [])
  const httpClient = useMemo(() => new HttpClient(env.BACKEND_BASE_URL, tokenStorage), [tokenStorage])
  const container = useMemo(() => DashboardContainer.getInstance(httpClient), [httpClient])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Collaboration[]>([])

  useEffect(() => {
    let mounted = true

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const list = await container.listCollaborationsUseCase.execute({ page: 1, size: 100 })
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

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Collaborations</h1>
            <p className="mt-1 text-sm font-semibold text-white/60">Tracking link, promo code, and status</p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="bb-btn-ghost h-11 px-5">
              Dashboard
            </Link>
            <Link to="/campaigns" className="bb-btn-primary h-11 px-5">
              Browse campaigns
            </Link>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bb-pop mt-5 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-white">
        {loading ? (
          <p className="text-sm font-semibold text-white/60">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm font-semibold text-white/60">No collaborations yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((c) => (
              <Link
                key={c.id}
                to={`/collaborations/${c.id}`}
                className="group rounded-3xl border border-white/10 bg-[#0e0f12] p-4 transition hover:-translate-y-0.5 hover:border-white/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-black">{c.campaign?.title ?? 'Collaboration'}</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/70">
                    {c.status}
                  </span>
                </div>

                <p className="mt-3 text-xs font-semibold text-white/55">
                  Promo: <span className="text-white/80">{c.promo?.code ?? '—'}</span>
                </p>

                <p className="mt-1 text-xs font-semibold text-white/55">
                  Tracking: <span className="text-white/80">{c.tracking?.code ?? '—'}</span>
                </p>

                <div className="mt-4 flex items-center justify-between text-xs font-extrabold text-white/55">
                  <span>Open details</span>
                  <span className="text-white/70 group-hover:text-white">View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}