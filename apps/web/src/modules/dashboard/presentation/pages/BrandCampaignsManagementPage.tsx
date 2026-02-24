import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useBrandManagement } from '../../application/hooks/useBrandManagement'
import { BrandCampaignModal } from '../components/BrandCampaignModal'
import type { Campaign } from '@core/modules/dashboard'

function StatusPill({ status }: { status: Campaign['status'] }) {
  const cfg = useMemo(() => {
    if (status === 'published') return { label: 'published', cls: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200' }
    if (status === 'draft') return { label: 'draft', cls: 'border-amber-400/25 bg-amber-500/10 text-amber-200' }
    return { label: 'closed', cls: 'border-slate-400/25 bg-slate-500/10 text-slate-200' }
  }, [status])

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

function IconEdit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
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
      <path
        d="M14 9 15 3l6 6-6 1-2 2-3 8-3-3 8-3 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M7 17 4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 12 3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export default function BrandCampaignsManagementPage() {
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
    campaigns,
    refreshCampaigns,
    onCreateCampaign,
    onUpdateCampaign,
    onPublishCampaign,
    onDeleteCampaign,
    products,
    refreshProducts,
  } = useBrandManagement()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)

  if (role !== UserRole.BRAND) {
    return (
      <div className="bb-page px-4 py-6 md:px-6">
        <div className="bb-pop rounded-3xl border border-white/10 bg-white/5 p-5 text-sm font-semibold text-white/70">
          Forbidden
        </div>
      </div>
    )
  }

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-pop">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-white/45">Brand</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Campaigns</h1>
            <p className="mt-1 text-sm font-semibold text-white/60">Create, publish, and manage campaigns.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                void refreshProducts()
                void refreshCampaigns()
              }}
              className="bb-btn-ghost h-11 px-5"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                setEditing(null)
                setOpen(true)
              }}
              className="bb-btn-ghost h-11 px-5"
            >
              New campaign
            </button>
          </div>
        </div>
      </div>

      {campaignsError ? (
        <div className="bb-pop mt-5 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {campaignsError}
        </div>
      ) : null}

      <div className="bb-pop mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm text-white">
            <thead className="border-b border-white/10 text-xs font-extrabold uppercase tracking-wider text-white/55">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {campaignsLoading && campaigns.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-white/60" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : null}

              {!campaignsLoading && campaigns.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-white/60" colSpan={6}>
                    No campaigns yet.
                  </td>
                </tr>
              ) : null}

              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-4 font-semibold">{c.title}</td>
                  <td className="px-4 py-4 text-white/75">{c.product?.name ?? c.productId}</td>
                  <td className="px-4 py-4 text-white/75">
                    {c.commissionType} • {Number(c.commissionValue).toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-4 py-4 text-white/60">{c.updatedAt ? new Date(c.updatedAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Details"
                        onClick={() => nav(`/campaigns/${c.id}`)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                      >
                        <IconEye />
                      </button>

                      <button
                        title="Edit"
                        onClick={() => {
                          setEditing(c)
                          setOpen(true)
                        }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                      >
                        <IconEdit />
                      </button>

                      {c.status === 'draft' ? (
                        <button
                          title="Publish"
                          onClick={() => void onPublishCampaign(c.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                        >
                          <IconRocket />
                        </button>
                      ) : null}

                      <button
                        title="Delete"
                        onClick={() => void onDeleteCampaign(c.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                      >
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
        onCreate={onCreateCampaign}
        onUpdate={onUpdateCampaign}
      />
    </div>
  )
}