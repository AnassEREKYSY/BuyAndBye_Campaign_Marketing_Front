import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useBrandManagement } from '../../application/hooks/useBrandManagement'
import { BrandCampaignModal } from '../components/BrandCampaignModal'
import type { Campaign } from '@core/modules/dashboard'
import { MagnifyingGlassIcon, MegaphoneIcon, PlusIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { EmptyState, PageHeader, Segmented, Skeleton, StatusBadge, formatDate, formatMoney } from '@/shared/components/ui'

type TierDraft = {
  id?: string
  metric: 'clicks'
  fromValue: number
  toValue: number | null
  payoutAmount: number
  currency: string | null
}

type StatusFilter = 'all' | 'published' | 'draft' | 'closed'

function commissionLabel(type?: string | null, value?: number | null) {
  if (!type) return '—'
  const v = Number(value ?? 0)
  return type === 'percent' ? `${v}%` : formatMoney(v)
}

export default function BrandCampaignsManagementPage() {
  const { profile } = useProfile() as any

  const role = useMemo(() => {
    const raw: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
    if (raw === UserRole.BRAND) return UserRole.BRAND
    return null
  }, [profile]) as UserRole | null

  const {
    campaignsLoading,
    campaignsError,
    campaignsRes,
    refreshCampaigns,
    onCreateCampaignWithTiers,
    onUpdateCampaignWithTiers,
    onPublishCampaign,
    onDeleteCampaign,
    productsRes,
    refreshProducts,
    getCampaignTiersDraft,
  } = useBrandManagement()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [editingTiers, setEditingTiers] = useState<TierDraft[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const items: Campaign[] = useMemo(() => (campaignsRes as any)?.items ?? (campaignsRes as any)?.data ?? [], [campaignsRes])
  const products = useMemo(() => (productsRes as any)?.items ?? (productsRes as any)?.data ?? [], [productsRes])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((c: any) => {
      if (statusFilter !== 'all' && c?.status !== statusFilter) return false
      if (!q) return true
      const title = (c?.title ?? '').toLowerCase()
      const status = (c?.status ?? '').toLowerCase()
      const product = ((c as any)?.product?.name ?? c?.productId ?? '').toLowerCase()
      return title.includes(q) || status.includes(q) || product.includes(q)
    })
  }, [items, search, statusFilter])

  const stats = useMemo(() => {
    const total = items.length
    const draft = items.filter((c) => c.status === 'draft').length
    const published = items.filter((c) => c.status === 'published').length
    const closed = items.filter((c) => c.status === 'closed').length
    return { total, draft, published, closed }
  }, [items])

  async function openCreate() {
    setEditing(null)
    setEditingTiers([{ metric: 'clicks', fromValue: 0, toValue: null, payoutAmount: 0, currency: 'MAD' }])
    setOpen(true)
  }

  async function openEdit(c: Campaign) {
    const tiers = await getCampaignTiersDraft(c.id)
    setEditing(c)
    setEditingTiers(tiers.length ? tiers : [{ metric: 'clicks', fromValue: 0, toValue: null, payoutAmount: 0, currency: 'MAD' }])
    setOpen(true)
  }

  if (role !== UserRole.BRAND) {
    return (
      <div className="bb-page">
        <EmptyState title="Not available" text="Only brand accounts can manage campaigns." />
      </div>
    )
  }

  const newButton = (
    <button onClick={() => void openCreate()} className="bb-btn-primary" type="button">
      <PlusIcon className="h-[18px] w-[18px]" />
      New campaign
    </button>
  )

  return (
    <div className="bb-page">
      <PageHeader
        title="Campaigns"
        description="Create campaigns, set payout tiers and publish them to creators."
        actions={
          <>
            <button
              onClick={() => {
                void refreshProducts()
                void refreshCampaigns()
              }}
              className="bb-btn-ghost w-10 px-0"
              type="button"
              title="Refresh"
              aria-label="Refresh"
            >
              <ArrowPathIcon className="h-[18px] w-[18px]" />
            </button>
            {newButton}
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented<StatusFilter>
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: `All ${stats.total}` },
            { value: 'published', label: `Published ${stats.published}` },
            { value: 'draft', label: `Draft ${stats.draft}` },
            { value: 'closed', label: `Closed ${stats.closed}` },
          ]}
        />
        <div className="relative w-full sm:max-w-xs">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-bb-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaigns" className="bb-input pl-9" />
        </div>
      </div>

      {campaignsError ? <div className="bb-soft-box mb-4 border-bb-accent/30 bg-bb-accent-soft p-4 text-sm text-bb-accent-strong">{campaignsError}</div> : null}

      {!campaignsLoading && filtered.length === 0 ? (
        items.length === 0 ? (
          <EmptyState
            icon={<MegaphoneIcon className="h-5 w-5" />}
            title="No campaigns yet"
            text="Create your first campaign to start working with creators."
            action={newButton}
          />
        ) : (
          <EmptyState title="No campaigns match" text="Try another search or status." />
        )
      ) : (
        <div className="bb-table-wrap">
          <table className="bb-table min-w-[860px]">
            <thead className="bb-thead">
              <tr>
                <th className="bb-th">Campaign</th>
                <th className="bb-th">Commission</th>
                <th className="bb-th text-right">Applications</th>
                <th className="bb-th">Status</th>
                <th className="bb-th">Updated</th>
                <th className="bb-th text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {campaignsLoading && items.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="bb-tr">
                      <td className="bb-td">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="mt-1.5 h-3 w-28" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="ml-auto h-4 w-8" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="bb-td" />
                    </tr>
                  ))
                : filtered.map((c: Campaign) => (
                    <tr key={c.id} className="bb-tr bb-tr-hover">
                      <td className="bb-td">
                        <Link to={`/campaigns/${c.id}`} className="font-medium hover:text-bb-primary-strong">
                          {c.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-bb-muted">{(c as any).product?.name ?? '—'}</p>
                      </td>
                      <td className="bb-td tabular-nums">{commissionLabel(c.commissionType, c.commissionValue)}</td>
                      <td className="bb-td text-right tabular-nums">{(c as any).applicationsCount ?? 0}</td>
                      <td className="bb-td">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="bb-td whitespace-nowrap text-bb-muted">{formatDate(c.updatedAt as any)}</td>
                      <td className="bb-td">
                        <div className="flex items-center justify-end gap-1">
                          {c.status === 'draft' ? (
                            <button onClick={() => void onPublishCampaign(c.id)} className="bb-btn-ghost mr-1 h-8 px-3" type="button">
                              Publish
                            </button>
                          ) : null}
                          <button title="Edit" aria-label="Edit" onClick={() => void openEdit(c)} className="bb-icon-btn h-8 w-8" type="button">
                            <PencilSquareIcon className="h-[18px] w-[18px]" />
                          </button>
                          <button
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => void onDeleteCampaign(c.id)}
                            className="bb-icon-btn h-8 w-8 hover:text-bb-accent-strong"
                            type="button"
                          >
                            <TrashIcon className="h-[18px] w-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      <BrandCampaignModal
        open={open}
        onClose={() => setOpen(false)}
        products={products}
        initial={editing}
        initialTiers={editingTiers}
        onCreate={onCreateCampaignWithTiers}
        onUpdate={onUpdateCampaignWithTiers}
      />
    </div>
  )
}
