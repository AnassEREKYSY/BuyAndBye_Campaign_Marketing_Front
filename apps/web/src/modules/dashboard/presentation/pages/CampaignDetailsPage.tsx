import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useCampaignDetails } from '@/modules/dashboard/application/hooks/useCampaignDetails'
import { useCampaignApplications } from '@/modules/dashboard/application/hooks/useCampaignApplications'
import { ApplicantProfileModal } from '@/modules/dashboard/presentation/components/ApplicantProfileModal'
import type { CampaignPayoutTier } from '@core/modules/dashboard/domain/entities'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, CheckCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { EmptyState, PageHeader, Section, Skeleton, StatusBadge, formatDate, formatMoney } from '@/shared/components/ui'

function commissionLabel(type?: string | null, value?: number | null) {
  if (!type) return '—'
  const v = Number(value ?? 0)
  return type === 'percent' ? `${v}% per sale` : `${formatMoney(v)} per sale`
}

function Alert({ kind, children }: { kind: 'error' | 'success'; children: React.ReactNode }) {
  const cls = kind === 'success' ? 'border-bb-success/30 bg-bb-success/10 text-bb-success' : 'border-bb-accent/30 bg-bb-accent-soft text-bb-accent-strong'
  return <div className={`bb-soft-box p-4 text-sm ${cls}`}>{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-bb-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{children}</dd>
    </div>
  )
}

export default function CampaignDetailsPage() {
  const { id } = useParams()
  const { profile } = useProfile() as any

  const role = useMemo(() => {
    const raw: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
    if (raw === UserRole.INFLUENCER) return UserRole.INFLUENCER
    if (raw === UserRole.BRAND) return UserRole.BRAND
    if (raw === UserRole.ADMIN) return UserRole.ADMIN
    return null
  }, [profile]) as UserRole | null

  const vm = useCampaignDetails(id ?? null, role)
  const apps = useCampaignApplications(role === UserRole.BRAND ? (id ?? '') : '')

  const [profileOpen, setProfileOpen] = useState(false)
  const [profileInfluencerId, setProfileInfluencerId] = useState<string | null>(null)

  const openApplicantProfile = (influencerId: string) => {
    setProfileInfluencerId(influencerId)
    setProfileOpen(true)
  }

  const closeApplicantProfile = () => {
    setProfileOpen(false)
    setProfileInfluencerId(null)
  }

  const item = vm.item
  const landingUrl = item?.product?.landing_url ?? null
  const backTo = role === UserRole.BRAND ? '/dashboard/brand/campaigns' : '/campaigns'

  const actions = (
    <>
      <Link to={backTo} className="bb-btn-ghost">
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Link>
      {role === UserRole.INFLUENCER && vm.appliedAt ? (
        <span className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-bb-subtle px-3 text-sm">
          <CheckCircleIcon className="h-[18px] w-[18px] text-bb-success" />
          Applied {formatDate(vm.appliedAt)}
        </span>
      ) : null}
      {vm.canApply ? (
        <button disabled={vm.applyLoading} onClick={vm.onApply} className="bb-btn-primary" type="button">
          {vm.applyLoading ? 'Applying…' : 'Apply to campaign'}
        </button>
      ) : null}
    </>
  )

  return (
    <div className="bb-page">
      {vm.loading && !item ? (
        <div className="mb-6">
          <Skeleton className="h-7 w-72" />
          <Skeleton className="mt-2 h-4 w-96 max-w-full" />
        </div>
      ) : (
        <PageHeader
          title={item?.title ?? 'Campaign'}
          description={
            <span className="inline-flex flex-wrap items-center gap-2">
              <StatusBadge status={item?.status} />
              {item?.brand?.display_name ? <span>{item.brand.display_name}</span> : null}
              {item?.product?.name ? <span>· {item.product.name}</span> : null}
            </span>
          }
          actions={actions}
        />
      )}

      {vm.error || vm.applyError || vm.applySuccess ? (
        <div className="mb-6 grid gap-3">
          {vm.error ? <Alert kind="error">{vm.error}</Alert> : null}
          {vm.applyError ? <Alert kind="error">{vm.applyError}</Alert> : null}
          {vm.applySuccess ? <Alert kind="success">{vm.applySuccess}</Alert> : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Section title="Overview">
            {vm.loading && !item ? (
              <div className="grid gap-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <>
                <p className="text-sm leading-6 text-bb-text">{item?.objective || 'No objective written yet.'}</p>
                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-bb-border/10 pt-5 sm:grid-cols-4">
                  <Field label="Commission">{commissionLabel(item?.commission_type, item?.commission_value)}</Field>
                  <Field label="Budget">{item?.budget != null ? formatMoney(item.budget) : '—'}</Field>
                  <Field label="Starts">{formatDate(item?.start_at)}</Field>
                  <Field label="Ends">{formatDate(item?.end_at)}</Field>
                </dl>
              </>
            )}
          </Section>

        </div>

        <div className="space-y-6 lg:col-span-4">
          <Section title={item?.brand?.display_name ? 'Product and brand' : 'Product'}>
            <dl className="grid gap-4">
              <Field label="Product">{item?.product?.name ?? '—'}</Field>
              {item?.brand?.display_name ? (
                <Field label="Brand">
                  <span className="flex items-center gap-2">
                    <span className="bb-avatar h-7 w-7 text-[11px]">
                      {item.brand.photo_url ? <img src={item.brand.photo_url} alt="" className="h-full w-full object-cover" /> : item.brand.display_name.charAt(0).toUpperCase()}
                    </span>
                    {item.brand.display_name}
                  </span>
                </Field>
              ) : null}
              {landingUrl ? (
                <Field label="Landing page">
                  <a href={landingUrl} target="_blank" rel="noreferrer" className="bb-link inline-flex items-center gap-1 break-all">
                    {landingUrl.replace(/^https?:\/\//, '')}
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0" />
                  </a>
                </Field>
              ) : null}
            </dl>
          </Section>

          <TiersCard
            tiersSorted={vm.tiersSorted}
            tiersLoading={vm.tiersLoading}
            tiersError={vm.tiersError}
            role={role}
            canApply={vm.canApply}
            applyLoading={vm.applyLoading}
            onApply={vm.onApply}
          />
        </div>
      </div>

      {role === UserRole.BRAND ? (
        <Section
          className="mt-6"
          title="Applications"
          description="Open an applicant to see the full profile."
          actions={
            <button disabled={apps.loading} onClick={apps.refresh} className="bb-btn-ghost h-9" type="button">
              Refresh
            </button>
          }
          bodyClassName="px-0 pb-0"
        >
          {apps.loading && apps.items.length === 0 ? (
            <div className="grid gap-2 px-5 pb-5">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : !apps.loading && apps.items.length === 0 ? (
            <div className="px-5 pb-5">
              <EmptyState icon={<UserGroupIcon className="h-5 w-5" />} title="No applications yet" text="Creators who apply to this campaign will appear here." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="bb-table min-w-[720px]">
                <thead className="bb-thead">
                  <tr>
                    <th className="bb-th">Applicant</th>
                    <th className="bb-th">Status</th>
                    <th className="bb-th">Message</th>
                    <th className="bb-th">Applied</th>
                    <th className="bb-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.items.map((a) => {
                    const name = a.influencer?.displayName ?? 'Unknown'
                    const photo = a.influencer?.photoUrl ?? null
                    const isMutating = apps.mutatingId === a.id
                    const canShortlist = a.status === 'pending'
                    const canFinalize = a.status === 'pending' || a.status === 'shortlisted'
                    const canReject = a.status === 'pending' || a.status === 'shortlisted'

                    return (
                      <tr key={a.id} className="bb-tr bb-tr-hover">
                        <td className="bb-td">
                          <button onClick={() => openApplicantProfile(a.influencerId)} className="flex items-center gap-3 text-left hover:text-bb-primary-strong" type="button">
                            <span className="bb-avatar">{photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : name.charAt(0).toUpperCase()}</span>
                            <span className="truncate font-medium">{name}</span>
                          </button>
                        </td>
                        <td className="bb-td">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="bb-td max-w-[220px] text-bb-muted">
                          {(a.message ?? '').trim() ? <span className="line-clamp-1">{a.message}</span> : '—'}
                        </td>
                        <td className="bb-td whitespace-nowrap text-bb-muted">{formatDate(a.createdAt)}</td>
                        <td className="bb-td">
                          <div className="flex items-center justify-end gap-2">
                            {canShortlist ? (
                              <button disabled={isMutating} onClick={() => apps.shortlist(a.id)} className="bb-btn-ghost h-9 px-3" type="button">
                                Shortlist
                              </button>
                            ) : null}
                            {canFinalize ? (
                              <button disabled={isMutating} onClick={() => apps.accept(a.id)} className="bb-btn-primary h-9 px-3" type="button">
                                Accept
                              </button>
                            ) : null}
                            {canReject ? (
                              <button disabled={isMutating} onClick={() => apps.reject(a.id)} className="bb-btn-ghost h-9 px-3" type="button">
                                Reject
                              </button>
                            ) : null}
                            {!canShortlist && !canFinalize && !canReject ? <span className="text-xs text-bb-muted">No actions</span> : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          {apps.hasMore ? (
            <div className="border-t border-bb-border/10 px-5 py-3 text-center">
              <button disabled={apps.loading} onClick={apps.loadMore} className="bb-btn-ghost h-9" type="button">
                {apps.loading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          ) : null}
        </Section>
      ) : null}

      <ApplicantProfileModal open={profileOpen} influencerId={profileInfluencerId} onClose={closeApplicantProfile} />
    </div>
  )
}

function TiersCard({
  tiersSorted,
  tiersLoading,
  tiersError,
  role,
  canApply,
  applyLoading,
  onApply,
}: {
  tiersSorted: CampaignPayoutTier[]
  tiersLoading: boolean
  tiersError: string | null
  role: UserRole | null
  canApply: boolean
  applyLoading: boolean
  onApply: () => Promise<void> | void
}) {
  return (
    <Section title="Payout tiers" description="Payout per creator, based on clicks in a period." bodyClassName="px-0 pb-0">
      {tiersError ? (
        <div className="px-5 pb-4">
          <Alert kind="error">{tiersError}</Alert>
        </div>
      ) : null}

      {tiersLoading && tiersSorted.length === 0 ? (
        <div className="grid gap-2 px-5 pb-5">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
      ) : tiersSorted.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-bb-muted">No tiers defined yet.</p>
      ) : (
        <table className="bb-table">
          <thead className="bb-thead">
            <tr>
              <th className="bb-th">Clicks</th>
              <th className="bb-th text-right">Payout</th>
            </tr>
          </thead>
          <tbody>
            {tiersSorted.map((t) => (
              <tr key={t.id} className="bb-tr">
                <td className="bb-td tabular-nums">
                  {t.toValue != null ? `${t.fromValue} – ${t.toValue}` : `${t.fromValue}+`}
                </td>
                <td className="bb-td text-right font-medium tabular-nums">{formatMoney(Number(t.payoutAmount), t.currency ?? 'MAD')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {role === UserRole.INFLUENCER && canApply ? (
        <div className="border-t border-bb-border/10 px-5 py-4">
          <button disabled={applyLoading} onClick={() => void onApply()} className="bb-btn-primary w-full" type="button">
            {applyLoading ? 'Applying…' : 'Apply to campaign'}
          </button>
        </div>
      ) : null}
    </Section>
  )
}
