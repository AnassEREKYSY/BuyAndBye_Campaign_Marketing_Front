import { Product } from '@core/modules/products/domain/entities/Product'

type Props = {
  open: boolean
  product: Product | null
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteProductModal({
  open,
  product,
  loading,
  onClose,
  onConfirm
}: Props) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0f12] text-white shadow-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Delete product</h2>
            <p className="text-sm text-white/50 mt-2">
              Are you sure you want to delete "{product.title}" ?
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 transition"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}