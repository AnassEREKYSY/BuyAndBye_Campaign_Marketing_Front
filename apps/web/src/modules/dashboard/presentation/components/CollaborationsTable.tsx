import type { Collaboration } from '@core/modules/dashboard'

type Props = {
  title: string
  collaborations: Collaboration[]
  role: 'influencer' | 'brand' | 'admin'
}

export function CollaborationsTable({ title, collaborations, role }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0e0f12] p-4 text-white shadow-[0_16px_44px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold tracking-tight">{title}</p>
        <p className="text-xs font-semibold text-white/45">{collaborations.length} items</p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[840px] border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-xs font-extrabold uppercase tracking-wider text-white/40">
              <th className="px-3">Campaign</th>
              <th className="px-3">{role === 'influencer' ? 'Brand' : 'Influencer'}</th>
              <th className="px-3">Tracking</th>
              <th className="px-3">Promo</th>
              <th className="px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {collaborations.slice(0, 8).map((c) => (
              <tr key={c.id} className="rounded-2xl border border-white/10 bg-white/5">
                <td className="px-3 py-3">
                  <p className="text-sm font-extrabold">{c.campaign?.title ?? '—'}</p>
                  <p className="mt-1 text-xs font-semibold text-white/45">{c.campaign?.status ?? ''}</p>
                </td>

                <td className="px-3 py-3">
                  <p className="text-sm font-extrabold">
                    {role === 'influencer' ? c.brand?.displayName ?? '—' : c.influencer?.displayName ?? '—'}
                  </p>
                </td>

                <td className="px-3 py-3">
                  {c.tracking?.url ? (
                    <a
                      className="text-xs font-extrabold text-white/80 underline decoration-white/20 underline-offset-4 hover:text-white"
                      href={c.tracking.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {c.tracking.code ?? 'open'}
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-white/45">—</span>
                  )}
                </td>

                <td className="px-3 py-3">
                  <span className="text-xs font-extrabold text-white/80">{c.promo?.code ?? '—'}</span>
                </td>

                <td className="px-3 py-3">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/75">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {collaborations.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm font-semibold text-white/50">
            No collaborations yet.
          </div>
        ) : null}
      </div>
    </div>
  )
}