import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useBrandManagement } from '../../application/hooks/useBrandManagement'
import { BrandCampaignModal } from '../components/BrandCampaignModal'
import type { Campaign } from '@core/modules/dashboard'
import { DashboardHeader } from '@/modules/dashboard/presentation/components/DashboardHeader'

type TierDraft = {
  id?: string
  metric: 'clicks'
  fromValue: number
  toValue: number | null
  payoutAmount: number
  currency: string | null
}

function pillForCampaignStatus(status: Campaign['status']) {
  if (status === 'published') {
    return { label: 'published', border: 'rgb(16 185 129 / 0.25)', bg: 'rgb(16 185 129 / 0.10)', text: 'rgb(110 231 183 / 0.95)' }
  }
  if (status === 'draft') {
    return { label: 'draft', border: 'rgb(245 158 11 / 0.25)', bg: 'rgb(245 158 11 / 0.10)', text: 'rgb(253 230 138 / 0.95)' }
  }
  return { label: 'closed', border: 'rgb(var(--bb-border) / 0.10)', bg: 'rgb(var(--bb-border) / 0.04)', text: 'rgb(var(--bb-muted) / 0.90)' }
}

function StatusPill({ status }: { status: Campaign['status'] }) {
  const p = useMemo(() => pillForCampaignStatus(status), [status])
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold" style={{ borderColor: p.border, backgroundColor: p.bg, color: p.text }}>
      {p.label}
    </span>
  )
}

function IconEdit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 6l1 16h10l1-16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function IconRocket() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M14 9 15 3l6 6-6 1-2 2-3 8-3-3 8-3 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 17 4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 12 3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function skelBg() {
  return { backgroundColor: 'rgb(var(--bb-border) / 0.06)' }
}
function SkeletonRow() {
  return (
    <tr className="bb-tr">
      <td className="bb-td"><div className="h-4 w-2/3 rounded" style={skelBg()} /></td>
      <td className="bb-td"><div className="h-4 w-40 rounded" style={skelBg()} /></td>
      <td className="bb-td"><div className="h-4 w-28 rounded" style={skelBg()} /></td>
      <td className="bb-td"><div className="h-4 w-12 rounded" style={skelBg()} /></td>
      <td className="bb-td"><div className="h-6 w-24 rounded-full" style={skelBg()} /></td>
      <td className="bb-td"><div className="h-4 w-36 rounded" style={skelBg()} /></td>
      <td className="bb-td text-right">
        <div className="ml-auto flex justify-end gap-2">
          <div className="h-10 w-10 rounded-full" style={skelBg()} />
          <div className="h-10 w-10 rounded-full" style={skelBg()} />
          <div className="h-10 w-10 rounded-full" style={skelBg()} />
        </div>
      </td>
    </tr>
  )
}

export default function BrandCampaignsManagementPage() {
  // ✅ ALWAYS call hooks first (never after a conditional return)
  const nav = useNavigate()
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

  const items: Campaign[] = useMemo(() => (campaignsRes as any)?.items ?? (campaignsRes as any)?.data ?? [], [campaignsRes])
  const products = useMemo(() => (productsRes as any)?.items ?? (productsRes as any)?.data ?? [], [productsRes])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((c: any) => {
      const title = (c?.title ?? '').toLowerCase()
      const status = (c?.status ?? '').toLowerCase()
      const product = ((c as any)?.product?.name ?? c?.productId ?? '').toLowerCase()
      return title.includes(q) || status.includes(q) || product.includes(q)
    })
  }, [items, search])

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

  const rightSlot = (
    <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
      <button
        onClick={() => {
          void refreshProducts()
          void refreshCampaigns()
        }}
        className="bb-btn-ghost h-11 px-5"
      >
        Refresh
      </button>
      <button onClick={() => void openCreate()} className="bb-btn-primary h-11 px-5">
        New campaign
      </button>
    </div>
  )

  // ✅ NOW it’s safe to early return (hooks already executed)
  if (role !== UserRole.BRAND) {
    return (
      <div className="bb-page px-4 py-6 md:px-6">
        <div className="bb-empty bb-pop" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
          Forbidden
        </div>
      </div>
    )
  }

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-pop">
        <DashboardHeader
          title="Campaigns"
          subtitle="Create, publish, manage campaigns + tiers."
          search={search}
          onSearch={setSearch}
          rightSlot={rightSlot}
          searchPlaceholder="Search by title, product, status…"
        />
      </div>

      {campaignsError ? (
        <div
          className="bb-pop mt-5 rounded-3xl border p-4 text-sm font-semibold"
          style={{ borderColor: 'rgb(244 63 94 / 0.25)', backgroundColor: 'rgb(244 63 94 / 0.10)', color: 'rgb(var(--bb-text) / 0.92)' }}
        >
          {campaignsError}
        </div>
      ) : null}

      <div className="bb-pop mt-6 bb-table-wrap">
        <div className="overflow-x-auto">
          <table className="bb-table min-w-[1100px]">
            <thead className="bb-thead">
              <tr>
                <th className="bb-th">Title</th>
                <th className="bb-th">Product</th>
                <th className="bb-th">Commission</th>
                <th className="bb-th">Applications</th>
                <th className="bb-th">Status</th>
                <th className="bb-th">Updated</th>
                <th className="bb-th text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {campaignsLoading && items.length === 0 ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </>
              ) : null}

              {!campaignsLoading && filtered.length === 0 ? (
                <tr className="bb-tr">
                  <td className="bb-td bb-muted" colSpan={7}>
                    No campaigns found.
                  </td>
                </tr>
              ) : null}

              {filtered.map((c: Campaign) => (
                <tr key={c.id} className="bb-tr bb-tr-hover">
                  <td className="bb-td font-semibold">{c.title}</td>
                  <td className="bb-td bb-muted">{(c as any).product?.name ?? c.productId}</td>
                  <td className="bb-td bb-muted">
                    {c.commissionType} • {Number(c.commissionValue).toFixed(2)}
                  </td>
                  <td className="bb-td bb-muted">{(c as any).applicationsCount ?? 0}</td>
                  <td className="bb-td">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="bb-td" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    {c.updatedAt ? new Date(c.updatedAt).toLocaleString() : '—'}
                  </td>
                  <td className="bb-td">
                    <div className="flex justify-end gap-2">
                      <button title="Details" onClick={() => nav(`/campaigns/${c.id}`)} className="bb-icon-btn">
                        <IconEye />
                      </button>

                      <button title="Edit (includes tiers)" onClick={() => void openEdit(c)} className="bb-icon-btn">
                        <IconEdit />
                      </button>

                      {c.status === 'draft' ? (
                        <button title="Publish" onClick={() => void onPublishCampaign(c.id)} className="bb-icon-btn">
                          <IconRocket />
                        </button>
                      ) : null}

                      <button title="Delete" onClick={() => void onDeleteCampaign(c.id)} className="bb-icon-btn">
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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