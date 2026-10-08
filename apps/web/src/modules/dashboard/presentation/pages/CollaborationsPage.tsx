import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useCollaborationsList } from '@/modules/dashboard/application/hooks/useCollaborationsList'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { PageHeader, StatusBadge, EmptyState, Skeleton, formatDate } from '@/shared/components/ui'

export default function CollaborationsPage() {
  const { loading, error, items, search, setSearch } = useCollaborationsList()
  const { profile } = useProfile() as any
  const nav = useNavigate()

  const rawRole: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
  const isInfluencer = rawRole === UserRole.INFLUENCER
  const otherLabel = isInfluencer ? 'Brand' : 'Creator'
  const otherName = (c: any) => (isInfluencer ? c?.brand?.displayName : c?.influencer?.displayName) ?? '—'

  return (
    <div>
      <PageHeader
        title="Collaborations"
        description={
          loading ? 'Tracking links, promo codes and status for each creator.' : `${items.length} collaboration${items.length === 1 ? '' : 's'} · tracking links, promo codes and status.`
        }
        actions={
          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-bb-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaign, code or status"
              aria-label="Search collaborations"
              className="bb-input pl-9"
            />
          </div>
        }
      />

      {error ? (
        <div className="mb-6 rounded-[10px] border border-bb-accent/20 bg-bb-accent-soft px-4 py-3 text-sm text-bb-accent-strong" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="bb-table-wrap">
          <div className="divide-y divide-bb-border/10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<UserGroupIcon className="h-5 w-5" />}
          title={search ? 'No matching collaborations' : 'No collaborations yet'}
          text={search ? 'Try another search term.' : 'Collaborations start when a brand accepts a creator on a campaign.'}
          action={
            search ? (
              <button type="button" onClick={() => setSearch('')} className="bb-btn-ghost">
                Clear search
              </button>
            ) : (
              <Link to={isInfluencer ? '/campaigns' : '/dashboard/brand/campaigns'} className="bb-btn-primary">
                {isInfluencer ? 'Find campaigns' : 'Open campaigns'}
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="bb-table-wrap hidden md:block">
            <table className="bb-table">
              <thead className="bb-thead">
                <tr>
                  <th className="bb-th">Campaign</th>
                  <th className="bb-th">{otherLabel}</th>
                  <th className="bb-th">Promo code</th>
                  <th className="bb-th">Tracking</th>
                  <th className="bb-th">Started</th>
                  <th className="bb-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c: any) => (
                  <tr key={c.id} className="bb-tr bb-tr-hover cursor-pointer" onClick={() => nav(`/collaborations/${c.id}`)}>
                    <td className="bb-td">
                      <Link to={`/collaborations/${c.id}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                        {c?.campaign?.title ?? 'Collaboration'}
                      </Link>
                    </td>
                    <td className="bb-td">{otherName(c)}</td>
                    <td className="bb-td font-mono text-xs">{c?.promo?.code ?? <span className="text-bb-muted">—</span>}</td>
                    <td className="bb-td font-mono text-xs">{c?.tracking?.code ?? <span className="text-bb-muted">—</span>}</td>
                    <td className="bb-td text-bb-muted">{formatDate(c?.acceptedAt ?? c?.createdAt)}</td>
                    <td className="bb-td">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="bb-card divide-y divide-bb-border/10 p-0 md:hidden">
            {items.map((c: any) => (
              <li key={c.id}>
                <Link to={`/collaborations/${c.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-bb-subtle">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c?.campaign?.title ?? 'Collaboration'}</p>
                    <p className="mt-0.5 truncate text-xs text-bb-muted">
                      {otherName(c)}
                      {c?.promo?.code ? ` · ${c.promo.code}` : ''}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
