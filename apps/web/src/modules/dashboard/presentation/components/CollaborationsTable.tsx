import { Link, useNavigate } from 'react-router-dom'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import type { Collaboration } from '@core/modules/dashboard'
import { Section, StatusBadge, EmptyState } from '@/shared/components/ui'

type Props = {
  title: string
  collaborations: Collaboration[]
  role: 'influencer' | 'brand' | 'admin'
}

export function CollaborationsTable({ title, collaborations, role }: Props) {
  const nav = useNavigate()
  const count = collaborations.length
  const headOther = role === 'influencer' ? 'Brand' : 'Creator'
  const rows = collaborations.slice(0, 8)
  const other = (c: Collaboration) => (role === 'influencer' ? c.brand?.displayName : c.influencer?.displayName) ?? '—'

  return (
    <Section
      title={title}
      description={count ? `${count} in total` : undefined}
      actions={
        count > 0 ? (
          <Link to="/collaborations" className="bb-link text-sm">
            View all
          </Link>
        ) : null
      }
      className="overflow-hidden"
      bodyClassName={count === 0 ? 'px-5 pb-5' : 'pb-0'}
    >
      {count === 0 ? (
        <EmptyState
          icon={<UserGroupIcon className="h-5 w-5" />}
          title="No collaborations yet"
          text={role === 'influencer' ? 'Apply to a campaign to start your first collaboration.' : 'Accept a creator on a campaign to start a collaboration.'}
          action={
            <Link to={role === 'influencer' ? '/campaigns' : '/dashboard/brand/campaigns'} className="bb-btn-ghost h-9">
              {role === 'influencer' ? 'Find campaigns' : 'Open campaigns'}
            </Link>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto border-t border-bb-border/10 md:block">
            <table className="bb-table">
              <thead className="bb-thead">
                <tr>
                  <th className="bb-th">Campaign</th>
                  <th className="bb-th">{headOther}</th>
                  <th className="bb-th">Tracking</th>
                  <th className="bb-th">Promo code</th>
                  <th className="bb-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="bb-tr bb-tr-hover cursor-pointer" onClick={() => nav(`/collaborations/${c.id}`)}>
                    <td className="bb-td">
                      <Link to={`/collaborations/${c.id}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                        {c.campaign?.title ?? 'Collaboration'}
                      </Link>
                    </td>
                    <td className="bb-td">{other(c)}</td>
                    <td className="bb-td">
                      {c.tracking?.url ? (
                        <a
                          href={c.tracking.url}
                          target="_blank"
                          rel="noreferrer"
                          className="bb-link font-mono text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {c.tracking.code ?? 'Open link'}
                        </a>
                      ) : (
                        <span className="text-bb-muted">—</span>
                      )}
                    </td>
                    <td className="bb-td font-mono text-xs">{c.promo?.code ?? <span className="text-bb-muted">—</span>}</td>
                    <td className="bb-td">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <ul className="border-t border-bb-border/10 md:hidden">
            {rows.map((c) => (
              <li key={c.id} className="border-b border-bb-border/10 last:border-b-0">
                <Link to={`/collaborations/${c.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-bb-subtle">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.campaign?.title ?? 'Collaboration'}</p>
                    <p className="mt-0.5 truncate text-xs text-bb-muted">
                      {other(c)}
                      {c.promo?.code ? ` · ${c.promo.code}` : ''}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  )
}
