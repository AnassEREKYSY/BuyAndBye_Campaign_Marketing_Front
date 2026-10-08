import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useCampaignsMarketplace } from '@/modules/dashboard/application/hooks/useCampaignsMarketplace'
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, MegaphoneIcon } from '@heroicons/react/24/outline'
import { EmptyState, PageHeader, Skeleton, StatusBadge, formatDate, formatMoney } from '@/shared/components/ui'

function commissionLabel(c: any) {
  if (!c?.commission_type) return '—'
  const v = Number(c.commission_value ?? 0)
  return c.commission_type === 'percent' ? `${v}% per sale` : `${formatMoney(v)} per sale`
}

function SkeletonCard() {
  return (
    <div className="bb-card">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/3" />
      <Skeleton className="mt-6 h-10" />
      <Skeleton className="mt-4 h-9 w-28" />
    </div>
  )
}

export default function CampaignsPage() {
  const { profile } = useProfile() as any
  const role = useMemo(() => {
    const raw: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
    if (raw === UserRole.INFLUENCER) return UserRole.INFLUENCER
    if (raw === UserRole.BRAND) return UserRole.BRAND
    if (raw === UserRole.ADMIN) return UserRole.ADMIN
    return null
  }, [profile]) as UserRole | null

  const { search, setSearch, setPage, size, setSize, filtered, meta, loading, error, appliedMap, canPrev, canNext } =
    useCampaignsMarketplace(role)

  const isInfluencer = role === UserRole.INFLUENCER

  return (
    <div className="bb-page">
      <PageHeader
        title={isInfluencer ? 'Find campaigns' : 'Campaigns'}
        description="Published campaigns open for applications."
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-bb-muted" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by title or product"
            className="bb-input pl-9"
          />
        </div>
        <p className="text-sm text-bb-muted">
          {meta.total} {meta.total === 1 ? 'campaign' : 'campaigns'}
        </p>
      </div>

      {error ? <div className="bb-soft-box mb-5 border-bb-accent/30 bg-bb-accent-soft p-4 text-sm text-bb-accent-strong">{error}</div> : null}

      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          icon={<MegaphoneIcon className="h-5 w-5" />}
          title="No campaigns found"
          text={search ? 'Nothing matches your search on this page.' : 'New campaigns will show up here when brands publish them.'}
          action={
            search ? (
              <button type="button" onClick={() => setSearch('')} className="bb-btn-ghost">
                Clear search
              </button>
            ) : undefined
          }
        />
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: Math.min(size, 6) }).map((_, idx) => <SkeletonCard key={`sk_${idx}`} />)
          : filtered.map((c: any) => {
              const appliedAt = isInfluencer ? appliedMap[c.id] : undefined
              const applied = appliedAt !== undefined
              return (
                <div key={c.id} className="bb-card flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/campaigns/${c.id}`} className="block truncate font-semibold hover:text-bb-primary-strong">
                        {c.title}
                      </Link>
                      <p className="mt-0.5 truncate text-sm text-bb-muted">{c.brand?.name ?? c.product?.name ?? '—'}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-bb-muted">Commission</dt>
                      <dd className="mt-0.5 font-medium">{commissionLabel(c)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-bb-muted">Dates</dt>
                      <dd className="mt-0.5 font-medium">
                        {formatDate(c.start_at, { day: 'numeric', month: 'short' })} – {formatDate(c.end_at, { day: 'numeric', month: 'short' })}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-bb-border/10 pt-4">
                    {applied ? (
                      <span className="text-xs text-bb-muted">Applied {formatDate(appliedAt)}</span>
                    ) : (
                      <span className="truncate text-xs text-bb-muted">{c.budget ? `Budget ${formatMoney(c.budget)}` : ''}</span>
                    )}
                    <Link to={`/campaigns/${c.id}`} className={`${applied ? 'bb-btn-ghost' : 'bb-btn-primary'} h-9 shrink-0`}>
                      {applied ? 'View' : isInfluencer ? 'View and apply' : 'View details'}
                    </Link>
                  </div>
                </div>
              )
            })}
      </div>

      {!loading && meta.last > 1 ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value))
              setPage(1)
            }}
            className="bb-select h-9"
            aria-label="Campaigns per page"
          >
            <option value={8}>8 per page</option>
            <option value={12}>12 per page</option>
            <option value={20}>20 per page</option>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-sm text-bb-muted">
              Page {meta.current} of {meta.last}
            </span>
            <button type="button" disabled={!canPrev} onClick={() => setPage((p) => Math.max(1, p - 1))} className="bb-btn-ghost h-9 w-9 px-0" aria-label="Previous page">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button type="button" disabled={!canNext} onClick={() => setPage((p) => p + 1)} className="bb-btn-ghost h-9 w-9 px-0" aria-label="Next page">
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
