import { useMemo, useState } from 'react'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useBrandManagement } from '../../application/hooks/useBrandManagement'
import { BrandProductModal } from '../components/BrandProductModal'
import type { Product } from '@core/modules/dashboard/domain/entities'
import { MagnifyingGlassIcon, CubeIcon, PlusIcon, PhotoIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { EmptyState, PageHeader, Skeleton, StatusBadge, formatDate, formatMoney } from '@/shared/components/ui'

/** Product thumbnail; falls back to a neutral tile when there is no image or it fails to load. */
function ProductThumb({ src }: { src?: string | null }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-bb-subtle text-bb-muted">
        <PhotoIcon className="h-5 w-5" />
      </span>
    )
  }
  return <img src={src} alt="" onError={() => setFailed(true)} className="h-10 w-10 shrink-0 rounded-[10px] border border-bb-border/10 object-cover" />
}

export default function BrandProductsPage() {
  const { profile } = useProfile() as any

  const role = useMemo(() => {
    const raw: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
    if (raw === UserRole.BRAND) return UserRole.BRAND
    return null
  }, [profile]) as UserRole | null

  const { productsLoading, productsError, productsRes, refreshProducts, onCreateProduct, onUpdateProduct, onDeleteProduct } =
    useBrandManagement()

  const products = useMemo(() => (productsRes as any)?.items ?? (productsRes as any)?.data ?? [], [productsRes])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p: Product) => {
      const name = (p.name ?? '').toLowerCase()
      const st = String(p.status ?? '').toLowerCase()
      const cur = String(p.currency ?? '').toLowerCase()
      return name.includes(q) || st.includes(q) || cur.includes(q)
    })
  }, [products, search])

  if (role !== UserRole.BRAND) {
    return (
      <div className="bb-page">
        <EmptyState title="Not available" text="Only brand accounts can manage products." />
      </div>
    )
  }

  const openCreate = () => {
    setEditing(null)
    setOpen(true)
  }

  const newButton = (
    <button onClick={openCreate} className="bb-btn-primary" type="button">
      <PlusIcon className="h-[18px] w-[18px]" />
      New product
    </button>
  )

  return (
    <div className="bb-page">
      <PageHeader
        title="Products"
        description="Your catalog. Every campaign promotes one of these products."
        actions={
          <>
            <button onClick={() => void refreshProducts()} className="bb-btn-ghost w-10 px-0" type="button" title="Refresh" aria-label="Refresh">
              <ArrowPathIcon className="h-[18px] w-[18px]" />
            </button>
            {newButton}
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-bb-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="bb-input pl-9" />
        </div>
        <p className="text-sm text-bb-muted">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {productsError ? <div className="bb-soft-box mb-4 border-bb-accent/30 bg-bb-accent-soft p-4 text-sm text-bb-accent-strong">{productsError}</div> : null}

      {!productsLoading && filtered.length === 0 ? (
        products.length === 0 ? (
          <EmptyState icon={<CubeIcon className="h-5 w-5" />} title="No products yet" text="Add a product before creating your first campaign." action={newButton} />
        ) : (
          <EmptyState title="No products match" text="Try another search." />
        )
      ) : (
        <div className="bb-table-wrap">
          <table className="bb-table min-w-[760px]">
            <thead className="bb-thead">
              <tr>
                <th className="bb-th">Product</th>
                <th className="bb-th">Status</th>
                <th className="bb-th text-right">Price</th>
                <th className="bb-th">Landing page</th>
                <th className="bb-th">Updated</th>
                <th className="bb-th">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {productsLoading && products.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="bb-tr">
                      <td className="bb-td">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </td>
                      <td className="bb-td">
                        <Skeleton className="h-5 w-16" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="ml-auto h-4 w-16" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="bb-td">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="bb-td" />
                    </tr>
                  ))
                : filtered.map((p: Product) => (
                    <tr key={p.id} className="bb-tr bb-tr-hover">
                      <td className="bb-td">
                        <div className="flex items-center gap-3">
                          <ProductThumb src={p.images?.[0]} />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{p.name}</p>
                            {p.description ? <p className="mt-0.5 max-w-xs truncate text-xs text-bb-muted">{p.description}</p> : null}
                          </div>
                        </div>
                      </td>
                      <td className="bb-td">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="bb-td whitespace-nowrap text-right tabular-nums">
                        {p.price !== null && p.price !== undefined ? formatMoney(p.price, p.currency ?? 'MAD') : '—'}
                      </td>
                      <td className="bb-td">
                        {p.landingUrl ? (
                          <a className="bb-link inline-flex max-w-[200px] items-center gap-1 text-sm" href={p.landingUrl} target="_blank" rel="noreferrer">
                            <span className="truncate">{p.landingUrl.replace(/^https?:\/\//, '')}</span>
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-bb-muted">—</span>
                        )}
                      </td>
                      <td className="bb-td whitespace-nowrap text-bb-muted">{formatDate(p.updatedAt as any)}</td>
                      <td className="bb-td">
                        <div className="flex justify-end gap-1">
                          <button
                            title="Edit"
                            aria-label="Edit"
                            onClick={() => {
                              setEditing(p)
                              setOpen(true)
                            }}
                            className="bb-icon-btn h-8 w-8"
                            type="button"
                          >
                            <PencilSquareIcon className="h-[18px] w-[18px]" />
                          </button>
                          <button
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => void onDeleteProduct(p.id)}
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

      <BrandProductModal open={open} onClose={() => setOpen(false)} initial={editing} onCreate={onCreateProduct} onUpdate={onUpdateProduct} />
    </div>
  )
}
