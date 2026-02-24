import { useMemo, useState } from 'react'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useBrandManagement } from '../../application/hooks/useBrandManagement'
import { BrandProductModal } from '../components/BrandProductModal'
import { Product } from '@core/modules/dashboard/domain/entities'

function StatusPill({ status }: { status: Product['status'] }) {
  const cfg = useMemo(() => {
    if (status === 'active') return { label: 'active', cls: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200' }
    if (status === 'draft') return { label: 'draft', cls: 'border-amber-400/25 bg-amber-500/10 text-amber-200' }
    return { label: 'archived', cls: 'border-slate-400/25 bg-slate-500/10 text-slate-200' }
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
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

function IconLink() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0 0-7.07 5 5 0 0 0-7.07 0L10.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.07 0L5.5 12.41a5 5 0 0 0 0 7.07 5 5 0 0 0 7.07 0L13.5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function BrandProductsPage() {
  const { profile } = useProfile() as any

  const role = useMemo(() => {
    const raw: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
    if (raw === UserRole.BRAND) return UserRole.BRAND
    return null
  }, [profile]) as UserRole | null

  const {
    productsLoading,
    productsError,
    products,
    refreshProducts,
    onCreateProduct,
    onUpdateProduct,
    onDeleteProduct,
  } = useBrandManagement()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

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
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Products</h1>
            <p className="mt-1 text-sm font-semibold text-white/60">Create and manage your products.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => void refreshProducts()} className="bb-btn-ghost h-11 px-5">
              Refresh
            </button>
            <button
              onClick={() => {
                setEditing(null)
                setOpen(true)
              }}
              className="bb-btn-ghost h-11 px-5"
            >
              New product
            </button>
          </div>
        </div>
      </div>

      {productsError ? (
        <div className="bb-pop mt-5 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {productsError}
        </div>
      ) : null}

      <div className="bb-pop mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm text-white">
            <thead className="border-b border-white/10 text-xs font-extrabold uppercase tracking-wider text-white/55">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Landing</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {productsLoading && products.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-white/60" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : null}

              {!productsLoading && products.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-white/60" colSpan={6}>
                    No products yet.
                  </td>
                </tr>
              ) : null}

              {products.map((p) => (
                <tr key={p.id} className="bg-transparent">
                  <td className="px-4 py-4 font-semibold">{p.name}</td>
                  <td className="px-4 py-4">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-4 text-white/75">
                    {p.price !== null ? `${p.price.toFixed(2)} ${p.currency ?? ''}` : '—'}
                  </td>
                  <td className="px-4 py-4 text-white/75">
                    {p.landingUrl ? (
                      <a className="inline-flex items-center gap-2 text-white/85 underline" href={p.landingUrl} target="_blank" rel="noreferrer">
                        <IconLink />
                        open
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-4 text-white/60">{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditing(p)
                          setOpen(true)
                        }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                      >
                        <IconEdit />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => void onDeleteProduct(p.id)}
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

      <BrandProductModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onCreate={onCreateProduct}
        onUpdate={onUpdateProduct}
      />
    </div>
  )
}