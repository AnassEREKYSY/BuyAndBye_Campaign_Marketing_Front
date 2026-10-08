import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, CheckIcon, ClipboardDocumentIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useCollaborationDetails } from '@/modules/dashboard/application/hooks/useCollaborationDetails'
import { PageHeader, Section, StatusBadge, EmptyState, Skeleton, formatDate } from '@/shared/components/ui'

function CopyButton({ value, label }: { value?: string | null; label: string }) {
  const [copied, setCopied] = useState(false)
  if (!value) return null
  return (
    <button
      type="button"
      className="bb-icon-btn h-8 w-8"
      aria-label={`Copy ${label}`}
      title={copied ? 'Copied' : `Copy ${label}`}
      onClick={() => {
        void navigator.clipboard?.writeText(value).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        })
      }}
    >
      {copied ? <CheckIcon className="h-4 w-4 text-bb-success" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
    </button>
  )
}

function Row({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <dt className="shrink-0 text-sm text-bb-muted">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2 text-right text-sm">
        <span className="min-w-0 truncate">{children}</span>
        {action}
      </dd>
    </div>
  )
}

function Person({ role, name, photoUrl }: { role: string; name: string; photoUrl?: string | null }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      {photoUrl ? (
        <img src={photoUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
      ) : (
        <span className="bb-avatar h-9 w-9 text-sm">{name.charAt(0).toUpperCase()}</span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-bb-muted">{role}</p>
      </div>
    </div>
  )
}

const backLink = (
  <Link to="/collaborations" className="bb-btn-ghost">
    <ArrowLeftIcon className="h-[18px] w-[18px]" />
    All collaborations
  </Link>
)

export default function CollaborationDetailsPage() {
  const { id } = useParams()
  const { loading, error, item } = useCollaborationDetails(id ?? null)

  if (loading && !item) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="bb-card lg:col-span-8">
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="bb-card lg:col-span-4">
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div>
        <PageHeader title="Collaboration" actions={backLink} />
        {error ? (
          <div className="mb-6 rounded-[10px] border border-bb-accent/20 bg-bb-accent-soft px-4 py-3 text-sm text-bb-accent-strong" role="alert">
            {error}
          </div>
        ) : null}
        <EmptyState icon={<UserGroupIcon className="h-5 w-5" />} title="Collaboration not found" text="It may have been removed or you may not have access to it." />
      </div>
    )
  }

  const campaign = item.campaign
  const brandName = item.brand?.displayName ?? 'Brand'
  const influencerName = item.influencer?.displayName ?? 'Creator'

  return (
    <div>
      <PageHeader
        title={campaign?.title ?? 'Collaboration'}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            <span>
              {brandName} with {influencerName}
              {item.acceptedAt ? ` · since ${formatDate(item.acceptedAt)}` : ''}
            </span>
          </span>
        }
        actions={backLink}
      />

      {error ? (
        <div className="mb-6 rounded-[10px] border border-bb-accent/20 bg-bb-accent-soft px-4 py-3 text-sm text-bb-accent-strong" role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Section title="Tracking" description="Share the link or the promo code. Every click is counted." bodyClassName="pb-1">
            <dl className="divide-y divide-bb-border/10 border-t border-bb-border/10">
              <Row label="Promo code" action={<CopyButton value={item.promo?.code} label="promo code" />}>
                <span className="font-mono">{item.promo?.code ?? '—'}</span>
              </Row>
              <Row label="Tracking code" action={<CopyButton value={item.tracking?.code} label="tracking code" />}>
                <span className="font-mono">{item.tracking?.code ?? '—'}</span>
              </Row>
              <Row
                label="Tracking link"
                action={
                  item.tracking?.url ? (
                    <>
                      <CopyButton value={item.tracking.url} label="tracking link" />
                      <a href={item.tracking.url} target="_blank" rel="noreferrer" className="bb-icon-btn h-8 w-8" aria-label="Open tracking link">
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </a>
                    </>
                  ) : null
                }
              >
                {item.tracking?.url ? <span className="text-bb-primary-strong">{item.tracking.url}</span> : '—'}
              </Row>
              {item.tracking?.destinationUrl ? (
                <Row label="Destination">
                  <span className="text-bb-muted">{item.tracking.destinationUrl}</span>
                </Row>
              ) : null}
            </dl>
          </Section>

          <Section title="Campaign" bodyClassName="pb-1">
            <dl className="divide-y divide-bb-border/10 border-t border-bb-border/10">
              <Row label="Title">{campaign?.title ?? '—'}</Row>
              <Row label="Status">
                <StatusBadge status={campaign?.status} />
              </Row>
              {campaign?.product?.name ? <Row label="Product">{campaign.product.name}</Row> : null}
              {campaign?.commissionType ? (
                <Row label="Commission">
                  <span className="capitalize">
                    {campaign.commissionType.replace(/_/g, ' ')} · {campaign.commissionValue ?? 0}
                  </span>
                </Row>
              ) : null}
              {campaign?.startAt || campaign?.endAt ? (
                <Row label="Dates">
                  {formatDate(campaign?.startAt)} to {formatDate(campaign?.endAt)}
                </Row>
              ) : null}
              <Row label="Accepted on">{formatDate(item.acceptedAt)}</Row>
            </dl>
          </Section>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Section title="People" bodyClassName="pb-1">
            <div className="divide-y divide-bb-border/10 border-t border-bb-border/10">
              <Person role="Brand" name={brandName} photoUrl={item.brand?.photoUrl} />
              <Person role="Creator" name={influencerName} photoUrl={item.influencer?.photoUrl} />
            </div>
          </Section>

          {campaign?.id ? (
            <Link to={`/campaigns/${campaign.id}`} className="bb-btn-ghost w-full">
              View campaign
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}
