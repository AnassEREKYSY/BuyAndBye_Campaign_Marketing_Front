import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { useSeller } from '@/modules/seller/application/context/useSeller'
import { Product } from '@core/modules/products/domain/entities/Product'
import { ProductStatus } from '@core/modules/products/domain/entities/ProductStatus'
import { useNotification } from '@/shared/context/notification'
import { AddUpdateProductModal } from '@/modules/seller/presentation/components/AddUpdateProductModal'
import { DeleteProductModal } from '@/modules/seller/presentation/components/DeleteProductModal'

type StatValue = string | number

export function SellerDashboardPage() {
  const { getSellerProductsUseCase, updateProductStatusUseCase, deleteProductUseCase } = useSeller()
  const { error: showError, success } = useNotification()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const pageSize = 20
  const [total, setTotal] = useState(0)

  const [togglingId, setTogglingId] = useState<string | null>(null)

  const [openUpsert, setOpenUpsert] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const [openDelete, setOpenDelete] = useState(false)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [deletingLoading, setDeletingLoading] = useState(false)

  const loadProducts = useCallback(
    async (nextPage = 1) => {
      try {
        setLoading(true)
        setErrorMsg(null)
        const result = await getSellerProductsUseCase.execute(nextPage, pageSize)
        setProducts(result.items)
        setPage(result.page)
        setTotal(result.total)
      } catch (err: unknown) {
        const anyErr = err as any
        const msg =
          anyErr?.response?.data?.message ||
          (err instanceof Error ? err.message : 'Failed to load products')
        setErrorMsg(msg)
        showError(msg)
      } finally {
        setLoading(false)
      }
    },
    [getSellerProductsUseCase, showError]
  )

  useEffect(() => {
    void loadProducts(1)
  }, [loadProducts])

  const hasMore = page * pageSize < total

  const totals = useMemo(() => {
    const totalProducts = total
    const totalStock = products.reduce((acc, p) => acc + (p.stockQuantity ?? 0), 0)
    const totalValue = products.reduce((acc, p) => acc + (p.price ?? 0) * (p.stockQuantity ?? 0), 0)
    return { totalProducts, totalStock, totalValue }
  }, [products, total])

  const handleToggleArchive = useCallback(
    async (product: Product) => {
      if (togglingId) return
      const newStatus: ProductStatus = product.status === 'archived' ? 'active' : 'archived'

      try {
        setTogglingId(product.id)
        await updateProductStatusUseCase.execute(product.id, newStatus)
        await loadProducts(page)
      } catch (err: unknown) {
        const anyErr = err as any
        const msg =
          anyErr?.response?.data?.message ||
          (err instanceof Error ? err.message : 'Failed to update product status')
        setErrorMsg(msg)
        showError(msg)
      } finally {
        setTogglingId(null)
      }
    },
    [loadProducts, page, showError, togglingId, updateProductStatusUseCase]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!deleting || deletingLoading) return

    try {
      setDeletingLoading(true)
      await deleteProductUseCase.execute(deleting.id)
      success('Product deleted!')
      setOpenDelete(false)
      setDeleting(null)
      await loadProducts(page)
    } catch (err: unknown) {
      const anyErr = err as any
      const msg =
        anyErr?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Failed to delete product')
      setErrorMsg(msg)
      showError(msg)
    } finally {
      setDeletingLoading(false)
    }
  }, [deleting, deletingLoading, deleteProductUseCase, loadProducts, page, showError, success])

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/50 text-sm">Seller</p>
            <h1 className="text-2xl font-semibold">Store Dashboard</h1>
          </div>

          <button
            onClick={() => {
              setEditing(null)
              setOpenUpsert(true)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-semibold hover:opacity-95 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Products" value={totals.totalProducts} />
          <StatCard title="Total Inventory Value" value={`$${totals.totalValue.toFixed(2)}`} />
          <StatCard title="Total Stock Quantity" value={totals.totalStock} />
        </div>

        {errorMsg ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200">
            {errorMsg}
          </div>
        ) : null}

        <div className="rounded-2xl border border-white/10 bg-[#0e0f12] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/90">Products</h2>

            <button
              onClick={() => loadProducts(page)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Refresh"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-white/60">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-white/60">No products yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-white/40">
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left font-medium">Product</th>
                    <th className="px-6 py-4 text-center font-medium">Price</th>
                    <th className="px-6 py-4 text-center font-medium">Stock</th>
                    <th className="px-6 py-4 text-center font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => {
                    const isArchived = p.status?.toLowerCase() === 'archived'
                    const isToggling = togglingId === p.id

                    return (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                              {p.images?.[0] ? (
                                <img src={p.images[0]} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white/30 text-xs">IMG</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-white/90 truncate">{p.title}</p>
                              <p className="text-xs text-white/40">{p.sku ? `SKU: ${p.sku}` : '—'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center text-white/80">${p.price}</td>

                        <td className="px-6 py-4 text-center text-white/80">{p.stockQuantity}</td>

                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={(p.status ?? 'Draft').toString()} />
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditing(p)
                                setOpenUpsert(true)
                              }}
                              className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition"
                              aria-label="Edit"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setDeleting(p)
                                setOpenDelete(true)
                              }}
                              className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-red-400 transition"
                              aria-label="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleArchive(p)}
                              disabled={isToggling}
                              className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Archive"
                            >
                              {isArchived ? <ArrowPathIcon className="w-4 h-4" /> : <ArchiveBoxIcon className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {total > 0 ? (
            <div className="px-6 py-5 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-white/60">
                Showing {products.length} of {total}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadProducts(Math.max(1, page - 1))}
                  disabled={loading || page <= 1}
                  className="px-3 py-2 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => loadProducts(page + 1)}
                  disabled={loading || !hasMore}
                  className="px-3 py-2 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <AddUpdateProductModal
        open={openUpsert}
        product={editing}
        onClose={() => {
          setOpenUpsert(false)
          setEditing(null)
        }}
        onCreated={() => loadProducts(page)}
      />

      <DeleteProductModal
        open={openDelete}
        product={deleting}
        loading={deletingLoading}
        onClose={() => {
          setOpenDelete(false)
          setDeleting(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: StatValue }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] px-6 py-5">
      <p className="text-xs uppercase tracking-wider text-white/40">{title}</p>
      <p className="text-2xl font-semibold mt-2 text-white/90">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const base = 'px-3 py-1 rounded-full text-xs font-medium border'
  const normalized = status.toLowerCase()

  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    draft: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    out_of_stock: 'bg-red-500/10 text-red-300 border-red-500/20',
    archived: 'bg-white/5 text-white/60 border-white/10',
  }

  return <span className={`${base} ${styles[normalized] || styles.draft}`}>{status}</span>
}