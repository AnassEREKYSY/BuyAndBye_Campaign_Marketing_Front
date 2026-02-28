import { useMemo, useState } from 'react'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useBrandManagement } from '../../application/hooks/useBrandManagement'
import { BrandProductModal } from '../components/BrandProductModal'
import { Product } from '@core/modules/dashboard/domain/entities'
import { Squares2X2Icon, MagnifyingGlassIcon, SparklesIcon, CubeIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

function pillForProductStatus(status: Product['status']) {
  if (status === 'active') {
    return { label: 'active', border: 'rgb(16 185 129 / 0.25)', bg: 'rgb(16 185 129 / 0.10)', text: 'rgb(110 231 183 / 0.95)' }
  }
  if (status === 'draft') {
    return { label: 'draft', border: 'rgb(245 158 11 / 0.25)', bg: 'rgb(245 158 11 / 0.10)', text: 'rgb(253 230 138 / 0.95)' }
  }
  return { label: 'archived', border: 'rgb(var(--bb-border) / 0.10)', bg: 'rgb(var(--bb-border) / 0.04)', text: 'rgb(var(--bb-muted) / 0.90)' }
}

function StatusPill({ status }: { status: Product['status'] }) {
  const p = useMemo(() => pillForProductStatus(status), [status])
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold"
      style={{ borderColor: p.border, backgroundColor: p.bg, color: p.text }}
    >
      {p.label}
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

function TopPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
        color: 'rgb(var(--bb-muted) / 0.90)',
      }}
    >
      {children}
    </span>
  )
}

function skelBg() {
  return { backgroundColor: 'rgb(var(--bb-border) / 0.06)' }
}

function SkeletonRow() {
  return (
    <tr className="bb-tr">
      <td className="bb-td">
        <div className="h-4 w-2/3 rounded" style={skelBg()} />
      </td>
      <td className="bb-td">
        <div className="h-6 w-20 rounded-full" style={skelBg()} />
      </td>
      <td className="bb-td">
        <div className="h-4 w-24 rounded" style={skelBg()} />
      </td>
      <td className="bb-td">
        <div className="h-4 w-20 rounded" style={skelBg()} />
      </td>
      <td className="bb-td">
        <div className="h-4 w-28 rounded" style={skelBg()} />
      </td>
      <td className="bb-td text-right">
        <div className="ml-auto flex justify-end gap-2">
          <div className="h-10 w-10 rounded-full" style={skelBg()} />
          <div className="h-10 w-10 rounded-full" style={skelBg()} />
        </div>
      </td>
    </tr>
  )
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
      <div className="bb-page px-4 py-6 md:px-6">
        <div className="bb-empty bb-pop" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
          Forbidden
        </div>
      </div>
    )
  }

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      {/* TOP SECTION (REDESIGNED) */}
      <section
        className="bb-pop relative overflow-hidden rounded-3xl border p-5 sm:p-6"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-surface) / 0.82)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <TopPill>
                  <SparklesIcon className="h-4 w-4" />
                  Brand workspace
                </TopPill>
                <TopPill>
                  <CubeIcon className="h-4 w-4" />
                  {products.length} product(s)
                </TopPill>
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
                Products
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.92)' }}>
                Create, update, and keep your catalog ready for campaigns.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <div
                className="bb-pop rounded-3xl border p-2"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                }}
              >
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-end">
                  <div className="relative flex-1">
                    <span
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </span>

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name, status, currency…"
                      className="bb-input pl-11"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button onClick={() => void refreshProducts()} className="bb-btn-ghost h-11 px-4" type="button">
                      Refresh
                    </button>

                    <button
                      onClick={() => {
                        setEditing(null)
                        setOpen(true)
                      }}
                      className="bb-btn-primary h-11 px-4"
                      type="button"
                    >
                      <span className="inline-flex items-center gap-2">
                        <PlusIcon className="h-5 w-5" />
                        New product
                      </span>
                    </button>

                    <Link to="/dashboard" className="bb-icon-btn h-11 w-11" aria-label="Dashboard">
                      <Squares2X2Icon className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {productsError ? (
            <div
              className="bb-pop mt-4 rounded-3xl border p-4 text-sm font-semibold"
              style={{
                borderColor: 'rgb(244 63 94 / 0.25)',
                backgroundColor: 'rgb(244 63 94 / 0.10)',
                color: 'rgb(var(--bb-text) / 0.92)',
              }}
            >
              {productsError}
            </div>
          ) : null}
        </div>
      </section>

      {/* TABLE */}
      <div className="bb-pop mt-6 bb-table-wrap">
        <div className="overflow-x-auto">
          <table className="bb-table min-w-[900px]">
            <thead className="bb-thead">
              <tr>
                <th className="bb-th">Name</th>
                <th className="bb-th">Status</th>
                <th className="bb-th">Price</th>
                <th className="bb-th">Landing</th>
                <th className="bb-th">Updated</th>
                <th className="bb-th text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {productsLoading && products.length === 0 ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </>
              ) : null}

              {!productsLoading && filtered.length === 0 ? (
                <tr className="bb-tr">
                  <td className="bb-td bb-muted" colSpan={6}>
                    No products found.
                  </td>
                </tr>
              ) : null}

              {filtered.map((p: Product) => (
                <tr key={p.id} className="bb-tr bb-tr-hover">
                  <td className="bb-td font-semibold">{p.name}</td>

                  <td className="bb-td">
                    <StatusPill status={p.status} />
                  </td>

                  <td className="bb-td bb-muted">
                    {p.price !== null && p.price !== undefined ? `${p.price.toFixed(2)} ${p.currency ?? ''}` : '—'}
                  </td>

                  <td className="bb-td bb-muted">
                    {p.landingUrl ? (
                      <a
                        className="inline-flex items-center gap-2 underline underline-offset-4"
                        style={{
                          textDecorationColor: 'rgb(var(--bb-border) / 0.25)',
                          color: 'rgb(var(--bb-text) / 0.86)',
                        }}
                        href={p.landingUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <IconLink />
                        open
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td className="bb-td" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : '—'}
                  </td>

                  <td className="bb-td">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditing(p)
                          setOpen(true)
                        }}
                        className="bb-icon-btn"
                        type="button"
                      >
                        <IconEdit />
                      </button>

                      <button title="Delete" onClick={() => void onDeleteProduct(p.id)} className="bb-icon-btn" type="button">
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