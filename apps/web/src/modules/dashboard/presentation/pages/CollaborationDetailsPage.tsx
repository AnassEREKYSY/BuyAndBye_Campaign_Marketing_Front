import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DashboardContainer } from '@core/modules/dashboard/infrastructure/container/DashboardContainer'
import type { Collaboration } from '@core/modules/dashboard'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  return iso.slice(0, 10)
}

function pill(status?: string) {
  if (status === 'active') return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
  if (status === 'closed') return 'border-slate-400/25 bg-slate-500/10 text-slate-200'
  if (status === 'cancelled') return 'border-rose-500/25 bg-rose-500/10 text-rose-200'
  return 'border-white/10 bg-white/5 text-white/70'
}

export default function CollaborationDetailsPage() {
  const { id } = useParams()

  const tokenStorage = useMemo(() => new CoreTokenStorage(), [])
  const httpClient = useMemo(() => new HttpClient(env.BACKEND_BASE_URL, tokenStorage), [tokenStorage])
  const container = useMemo(() => DashboardContainer.getInstance(httpClient), [httpClient])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<Collaboration | null>(null)

  useEffect(() => {
    let mounted = true

    async function run() {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const c = await container.getCollaborationUseCase.execute(id)
        if (!mounted) return
        setItem(c)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message ?? 'Failed to load collaboration.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    void run()
    return () => {
      mounted = false
    }
  }, [container, id])

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-extrabold text-white/75">
              Collaboration
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white">{loading ? 'Loading…' : item?.campaign?.title ?? '—'}</h1>
            <p className="mt-1 text-sm font-semibold text-white/60">Tracking link, promo code, and status</p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/collaborations" className="bb-btn-ghost h-11 px-5">
              Back
            </Link>
            <Link to="/dashboard" className="bb-btn-ghost h-11 px-5">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bb-pop mt-5 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {error}
        </div>
      ) : null}

      {item ? (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="bb-pop rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-extrabold">Overview</p>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${pill(item.status)}`}>{item.status}</span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-4">
                  <p className="text-xs font-extrabold text-white/55">Accepted at</p>
                  <p className="mt-2 text-sm font-extrabold">{fmtDate(item.acceptedAt as any)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-4">
                  <p className="text-xs font-extrabold text-white/55">Campaign</p>
                  <p className="mt-2 text-sm font-extrabold">{item.campaign?.title ?? '—'}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-4">
                  <p className="text-xs font-extrabold text-white/55">Promo code</p>
                  <p className="mt-2 text-sm font-extrabold">{item.promo?.code ?? '—'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-4">
                  <p className="text-xs font-extrabold text-white/55">Tracking code</p>
                  <p className="mt-2 text-sm font-extrabold">{item.tracking?.code ?? '—'}</p>
                </div>
              </div>

              {item.tracking?.url ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#0e0f12] p-4">
                  <p className="text-xs font-extrabold text-white/55">Tracking URL</p>
                  <a
                    href={item.tracking.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm font-extrabold text-sky-200 underline decoration-white/20 underline-offset-4 hover:text-white"
                  >
                    {item.tracking.url}
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bb-pop rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
              <p className="text-sm font-extrabold">Participants</p>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0e0f12] p-4">
                  <div className="h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{item.brand?.displayName ?? 'Brand'}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-white/45">{item.brand?.id ?? item.brandId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0e0f12] p-4">
                  <div className="h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{item.influencer?.displayName ?? 'Influencer'}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-white/45">{item.influencer?.id ?? item.influencerId}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0e0f12] p-4 text-xs font-semibold text-white/60">
                Next: stats + timeline + payouts can be added here later without changing this page.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}