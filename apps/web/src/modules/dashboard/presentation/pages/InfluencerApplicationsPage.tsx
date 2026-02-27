import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'
import { DashboardHeader } from '@/modules/dashboard/presentation/components/DashboardHeader'

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
  return 'border-slate-400/25 bg-slate-500/10 text-slate-200'
}

export default function InfluencerApplicationsPage() {
  const tokenStorage = useMemo(() => new CoreTokenStorage(), [])
  const httpClient = useMemo(() => new HttpClient(env.BACKEND_BASE_URL, tokenStorage), [tokenStorage])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ApplicationItem[]>([])
  const [search, setSearch] = useState('')

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((a) => {
      const title = (a.campaign?.title ?? '').toLowerCase()
      const st = (a.status ?? '').toLowerCase()
      const msg = (a.message ?? '').toLowerCase()
      const id = (a.campaign_id ?? '').toLowerCase()
      return title.includes(q) || st.includes(q) || msg.includes(q) || id.includes(q)
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
          title="My applications"
          subtitle="Status, message and campaign access."
          search={search}
          onSearch={setSearch}
          rightSlot={rightSlot}
          searchPlaceholder="Search by campaign, status, message…"
        />
      </div>

      {error ? (
        <div
          className="bb-pop mt-5 rounded-3xl border p-4 text-sm font-semibold"
          style={{
            borderColor: 'rgb(244 63 94 / 0.25)',
            backgroundColor: 'rgb(244 63 94 / 0.10)',
            color: 'rgb(var(--bb-text) / 0.92)',
          }}
        >
          {error}
        </div>
      ) : null}

      <div className="bb-pop mt-6 bb-table-wrap">
        <div className="overflow-x-auto">
          <table className="bb-table min-w-[900px]">
            <thead className="bb-thead">
              <tr>
                <th className="bb-th">Campaign</th>
                <th className="bb-th">Status</th>
                <th className="bb-th">Message</th>
                <th className="bb-th">Applied</th>
                <th className="bb-th text-right">Open</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr className="bb-tr">
                  <td className="bb-td bb-muted" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : null}

              {!loading && filtered.length === 0 ? (
                <tr className="bb-tr">
                  <td className="bb-td bb-muted" colSpan={5}>
                    No applications found.
                  </td>
                </tr>
              ) : null}

              {filtered.map((a) => (
                <tr key={a.id} className="bb-tr bb-tr-hover">
                  <td className="bb-td">
                    <p className="text-sm font-extrabold">{a.campaign?.title ?? a.campaign_id}</p>
                    <p className="mt-1 text-xs font-semibold bb-muted-weak">{a.campaign_id}</p>
                  </td>

                  <td className="bb-td">
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${badge(a.status)}`}>{a.status}</span>
                  </td>

                  <td className="bb-td bb-muted">{(a.message ?? '').trim() ? a.message : '—'}</td>

                  <td className="bb-td bb-muted">{fmtDate(a.created_at)}</td>

                  <td className="bb-td text-right">
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