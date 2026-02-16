import { useEffect, useState } from 'react'
import { Product } from '@core/modules/products/domain/entities/Product'
import { useSeller } from '@/modules/seller/application/context/useSeller'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { AddUpdateProductModal } from '@/modules/seller/presentation/components/AddUpdateProductModal'
import { DeleteProductModal } from '@/modules/seller/presentation/components/DeleteProductModal'

export function SellerDashboardPage() {
  const {
    getSellerProductsUseCase,
    deleteProductUseCase,
    updateProductStatusUseCase,
  } = useSeller()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const result = await getSellerProductsUseCase.execute(1, 50)
      setProducts(result.items)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteProduct) return
    try {
      setDeleteLoading(true)
      await deleteProductUseCase.execute(deleteProduct.id)
      setDeleteProduct(null)
      await loadProducts()
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggleArchive = async (product: Product) => {
    const isArchived = product.status?.toLowerCase() === 'archived'
    const newStatus = isArchived ? 'active' : 'archived'

    await updateProductStatusUseCase.execute(product.id, newStatus)
    await loadProducts()
  }

  const totalProducts = products.length
  const totalStock = products.reduce((acc, p) => acc + (p.stockQuantity ?? 0), 0)
  const totalValue = products.reduce(
    (acc, p) => acc + (p.price ?? 0) * (p.stockQuantity ?? 0),
    0
  )

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
              setEditingProduct(null)
              setOpenAdd(true)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-semibold hover:opacity-95 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Products" value={totalProducts} />
          <StatCard
            title="Total Inventory Value"
            value={`$${totalValue.toFixed(2)}`}
          />
          <StatCard title="Total Stock Quantity" value={totalStock} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0e0f12] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white/90">Products</h2>
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
                    <th className="px-6 py-4 text-left font-medium">
                      Product
                    </th>
                    <th className="px-6 py-4 text-center font-medium">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center font-medium">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-center font-medium">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => {
                    const isArchived =
                      p.status?.toLowerCase() === 'archived'

                    return (
                      <tr
                        key={p.id}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                              {p.images?.[0] ? (
                                <img
                                  src={p.images[0]}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white/30 text-xs">
                                  IMG
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-white/90">
                                {p.title}
                              </p>
                              <p className="text-xs text-white/40">
                                {p.sku ? `SKU: ${p.sku}` : '—'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center text-white/80">
                          ${p.price}
                        </td>

                        <td className="px-6 py-4 text-center text-white/80">
                          {p.stockQuantity}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <StatusBadge
                            status={(p.status ?? 'Draft').toString()}
                          />
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p)
                                setOpenAdd(true)
                              }}
                              className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteProduct(p)}
                              className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-red-400 transition"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleToggleArchive(p)}
                              className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition"
                            >
                              {isArchived ? (
                                <ArrowPathIcon className="w-4 h-4" />
                              ) : (
                                <ArchiveBoxIcon className="w-4 h-4" />
                              )}
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
        </div>
      </div>

      <AddUpdateProductModal
        open={openAdd}
        product={editingProduct}
        onClose={() => {
          setOpenAdd(false)
          setEditingProduct(null)
        }}
        onCreated={loadProducts}
      />

      <DeleteProductModal
        open={!!deleteProduct}
        product={deleteProduct}
        loading={deleteLoading}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] px-6 py-5">
      <p className="text-xs uppercase tracking-wider text-white/40">
        {title}
      </p>
      <p className="text-2xl font-semibold mt-2 text-white/90">
        {value}
      </p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const base = 'px-3 py-1 rounded-full text-xs font-medium border'
  const normalized = status.toLowerCase()

  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    draft: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    out_of_stock:
      'bg-red-500/10 text-red-300 border-red-500/20',
    archived: 'bg-white/5 text-white/60 border-white/10',
  }

  return (
    <span className={`${base} ${styles[normalized] || styles.draft}`}>
      {status}
    </span>
  )
}