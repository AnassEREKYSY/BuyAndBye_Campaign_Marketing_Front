import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'

type ApplicationItem = {
  id: string
  campaign_id: string
  message: string | null
  status: string
  created_at: string | null
  campaign?: { id: string; title: string; status: string } | null
}

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  return iso.slice(0, 10)
}

function badge(status: string) {
  if (status === 'accepted') return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
  if (status === 'shortlisted') return 'border-amber-500/25 bg-amber-500/10 text-amber-200'
  if (status === 'rejected') return 'border-rose-500/25 bg-rose-500/10 text-rose-200'
  return 'border-white/10 bg-white/5 text-white/70'
}

export default function InfluencerApplicationsPage() {
  const tokenStorage = useMemo(() => new CoreTokenStorage(), [])
  const httpClient = useMemo(() => new HttpClient(env.BACKEND_BASE_URL, tokenStorage), [tokenStorage])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ApplicationItem[]>([])

  useEffect(() => {
    let mounted = true

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const res = await httpClient.get<any>(`/api/v1/applications?page=1&size=200`)
        const payload = (res as any).data ?? res
        const list = (payload?.data ?? []) as ApplicationItem[]
        if (!mounted) return
        setItems(list)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message ?? 'Failed to load applications.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    void run()
    return () => {
      mounted = false
    }
  }, [httpClient])

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-gradient-border bb-glass bb-ring bb-pop relative overflow-hidden rounded-[26px] border border-white/10 p-5 text-white">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">My applications</h1>
            <p className="mt-1 text-sm font-semibold text-white/60">Status, message and campaign access</p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/campaigns" className="bb-btn-primary h-11 px-5">
              Browse campaigns
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

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm text-white">
            <thead className="border-b border-white/10 text-xs font-extrabold uppercase tracking-wider text-white/55">
              <tr>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3 text-right">Open</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-white/60" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : null}

              {!loading && items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-white/60" colSpan={5}>
                    No applications yet.
                  </td>
                </tr>
              ) : null}

              {items.map((a) => (
                <tr key={a.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <p className="text-sm font-extrabold">{a.campaign?.title ?? a.campaign_id}</p>
                    <p className="mt-1 text-xs font-semibold text-white/45">{a.campaign_id}</p>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${badge(a.status)}`}>{a.status}</span>
                  </td>

                  <td className="px-4 py-3 text-white/70">{(a.message ?? '').trim() ? a.message : '—'}</td>

                  <td className="px-4 py-3 text-white/70">{fmtDate(a.created_at)}</td>

                  <td className="px-4 py-3 text-right">
                    <Link to={`/campaigns/${a.campaign_id}`} className="bb-btn-ghost h-10 px-4">
                      Campaign
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}