import type { Collaboration } from '@core/modules/dashboard'
import { Link } from 'react-router-dom'

type Props = {
  title: string
  collaborations: Collaboration[]
  role: 'influencer' | 'brand' | 'admin'
}

function pill(status?: string) {
  const s = (status ?? '').toLowerCase()
  if (s === 'accepted' || s === 'active') return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
  if (s === 'pending' || s === 'shortlisted') return 'border-amber-500/25 bg-amber-500/10 text-amber-200'
  if (s === 'rejected' || s === 'closed') return 'border-rose-500/25 bg-rose-500/10 text-rose-200'
  return 'border-slate-400/25 bg-slate-500/10 text-slate-200'
}

export function CollaborationsTable({ title, collaborations, role }: Props) {
  const count = collaborations.length
  const headOther = role === 'influencer' ? 'Brand' : 'Influencer'
  const rows = collaborations.slice(0, 8) as any[]

  return (
    <div className="bb-card bb-pop rounded-[26px] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
          {title}
        </p>
        <p className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.80)' }}>
          {count} items
        </p>
      </div>

      {count === 0 ? (
        <div
          className="mt-4 rounded-2xl border p-4 text-center text-sm font-semibold"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.10)',
            backgroundColor: 'rgb(var(--bb-border) / 0.04)',
            color: 'rgb(var(--bb-muted) / 0.90)',
          }}
        >
          No collaborations yet.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead
                className="text-xs font-extrabold uppercase tracking-wider"
                style={{ color: 'rgb(var(--bb-muted) / 0.78)' }}
              >
                <tr className="border-b" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}>
                  <th className="px-3 py-3">Campaign</th>
                  <th className="px-3 py-3">{headOther}</th>
                  <th className="px-3 py-3">Tracking</th>
                  <th className="px-3 py-3">Promo</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Open</th>
                </tr>
              </thead>

              <tbody style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                {rows.map((c) => (
                  <tr
                    key={c.id}
                    className="transition hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ borderBottom: '1px solid rgb(var(--bb-border) / 0.10)' }}
                  >
                    <td className="px-3 py-3">
                      <p className="text-sm font-extrabold">{c.campaign?.title ?? '—'}</p>
                      <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.80)' }}>
                        {c.campaign?.status ?? ''}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      <p className="text-sm font-extrabold">
                        {role === 'influencer' ? c.brand?.displayName ?? '—' : c.influencer?.displayName ?? '—'}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      {c.tracking?.url ? (
                        <a
                          href={c.tracking.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-extrabold underline underline-offset-4"
                          style={{ color: 'rgb(var(--bb-text) / 0.86)', textDecorationColor: 'rgb(var(--bb-border) / 0.25)' }}
                        >
                          {c.tracking.code ?? 'open'}
                        </a>
                      ) : (
                        <span className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.80)' }}>
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3 text-xs font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.86)' }}>
                      {c.promo?.code ?? '—'}
                    </td>

                    <td className="px-3 py-3">
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${pill(c.status)}`}>
                        {c.status ?? '—'}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-right">
                      <Link to={`/collaborations/${c.id}`} className="bb-btn-ghost h-10 px-4">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:hidden">
            {rows.map((c) => (
              <Link
                key={c.id}
                to={`/collaborations/${c.id}`}
                className="rounded-[26px] border p-4 transition hover:-translate-y-0.5"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-card) / 0.55)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
                      {c.campaign?.title ?? '—'}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                      {role === 'influencer' ? c.brand?.displayName ?? '—' : c.influencer?.displayName ?? '—'}
                    </p>
                  </div>

                  <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-extrabold ${pill(c.status)}`}>
                    {c.status ?? '—'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div
                    className="rounded-2xl border p-3"
                    style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                  >
                    <p className="text-[11px] font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                      Tracking
                    </p>
                    <p className="mt-2 text-xs font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.86)' }}>
                      {c.tracking?.code ?? '—'}
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border p-3"
                    style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                  >
                    <p className="text-[11px] font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                      Promo
                    </p>
                    <p className="mt-2 text-xs font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.86)' }}>
                      {c.promo?.code ?? '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  <span>Open details</span>
                  <span style={{ color: 'rgb(var(--bb-text) / 0.86)' }}>View →</span>
                </div>
              </Link>
            ))}
          </div>

          {count > 8 ? (
            <div className="mt-4 flex justify-end">
              <Link to="/collaborations" className="bb-btn-ghost h-10 px-4">
                See all
              </Link>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}