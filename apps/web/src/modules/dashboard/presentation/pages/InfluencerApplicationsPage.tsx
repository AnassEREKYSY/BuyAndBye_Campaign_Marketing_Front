import { Link } from 'react-router-dom'
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useInfluencerApplications } from '@/modules/dashboard/application/hooks/useInfluencerApplications'
import { EmptyState, PageHeader, Skeleton, StatusBadge, formatDate } from '@/shared/components/ui'

export default function InfluencerApplicationsPage() {
  const { loading, error, items, search, setSearch } = useInfluencerApplications()

  const browse = (
    <Link to="/campaigns" className="bb-btn-primary">
      Find campaigns
    </Link>
  )

  return (
    <div className="bb-page">
      <PageHeader title="Applications" description="Campaigns you applied to and where each one stands." actions={browse} />

      <div className="mb-4">
        <div className="relative w-full sm:max-w-xs">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-bb-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applications" className="bb-input pl-9" />
        </div>
      </div>

      {error ? <div className="bb-soft-box mb-4 border-bb-accent/30 bg-bb-accent-soft p-4 text-sm text-bb-accent-strong">{error}</div> : null}

      {!loading && items.length === 0 ? (
        search ? (
          <EmptyState title="No applications match" text="Try another search." />
        ) : (
          <EmptyState
            icon={<DocumentTextIcon className="h-5 w-5" />}
            title="No applications yet"
            text="Apply to a campaign and you will follow its status here."
            action={browse}
          />
        )
      ) : (
        <div className="bb-table-wrap">
          <table className="bb-table min-w-[680px]">
            <thead className="bb-thead">
              <tr>
                <th className="bb-th">Campaign</th>
                <th className="bb-th">Status</th>
                <th className="bb-th">Message</th>
                <th className="bb-th">Applied</th>
                <th className="bb-th">
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="bb-tr">
                      <td className="bb-td">
                        <Skeleton className="h-4 w-48" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="bb-td" />
                    </tr>
                  ))
                : items.map((a) => (
                    <tr key={a.id} className="bb-tr bb-tr-hover">
                      <td className="bb-td">
                        <Link to={`/campaigns/${a.campaign_id}`} className="font-medium hover:text-bb-primary-strong">
                          {a.campaign?.title ?? 'Untitled campaign'}
                        </Link>
                      </td>
                      <td className="bb-td">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="bb-td max-w-[280px] text-bb-muted">
                        {(a.message ?? '').trim() ? <span className="line-clamp-1">{a.message}</span> : '—'}
                      </td>
                      <td className="bb-td whitespace-nowrap text-bb-muted">{formatDate(a.created_at)}</td>
                      <td className="bb-td text-right">
                        <Link to={`/campaigns/${a.campaign_id}`} className="bb-btn-ghost h-8 px-3">
                          View campaign
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
