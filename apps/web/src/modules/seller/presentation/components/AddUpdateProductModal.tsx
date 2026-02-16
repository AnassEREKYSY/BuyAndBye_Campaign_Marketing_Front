import { useEffect, useMemo, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useSeller } from '@/modules/seller/application/context/useSeller'
import { CreateProductDTO, ProductCondition } from '@core/modules/products/domain/dtos/CreateProductDTO'
import { Product } from '@core/modules/products/domain/entities/Product'
import { useNotification } from '@/shared/context/notification'

type Props = {
  open: boolean
  product?: Product | null
  onClose: () => void
  onCreated: () => void
}

const CONDITIONS: ProductCondition[] = ['New', 'LikeNew', 'VeryGood', 'Good', 'Acceptable']

type FieldErrors = Record<string, string[]>

export function AddUpdateProductModal({ open, product = null, onClose, onCreated }: Props) {
  const { createProductUseCase, updateProductUseCase } = useSeller()
  const { success, error: showError } = useNotification()

  const isEditMode = !!product

  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    title: '',
    description: '',
    condition: 'New' as ProductCondition,
    price: '',
    stockQuantity: '0',
    tags: '',
    weightKg: '',
    sku: '',
    isDigital: false,
    allowReturns: true,
    returnDays: '14',
  })

  const clearErrors = () => setFieldErrors({})

  const setErrorFor = (key: string, messages: string | string[]) => {
    setFieldErrors((prev) => ({
      ...prev,
      [key]: Array.isArray(messages) ? messages : [messages],
    }))
  }

  const hasError = (key: string) => !!fieldErrors[key]?.length

  const inputClass = (key: string, base: string) =>
    `${base} ${hasError(key) ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/40' : ''}`

  const extract422Errors = (err: unknown): FieldErrors | null => {
    const anyErr = err as any
    const status = anyErr?.response?.status
    const data = anyErr?.response?.data

    if (status !== 422) return null
    const errors = data?.errors
    if (!errors || typeof errors !== 'object') return null

    const mapped: FieldErrors = {}
    Object.keys(errors).forEach((k) => {
      const v = errors[k]
      if (Array.isArray(v)) mapped[k] = v.map(String)
      else if (typeof v === 'string') mapped[k] = [v]
      else mapped[k] = [String(v)]
    })

    return mapped
  }

  const normalizeImageFiles = (files: File[]) => {
    const valid = files.filter((f) => f && typeof f.type === 'string' && f.type.startsWith('image/'))
    const invalid = files.filter((f) => !f || !f.type || !f.type.startsWith('image/'))
    return { valid, invalid }
  }

  useEffect(() => {
    if (!open) return

    setLoading(false)
    clearErrors()
    setImages([])

    if (product) {
      setForm({
        title: product.title ?? '',
        description: product.description ?? '',
        condition: (product.condition as ProductCondition) ?? 'New',
        price: String(product.price ?? ''),
        stockQuantity: String(product.stockQuantity ?? '0'),
        tags: product.tags?.join(', ') ?? '',
        weightKg: product.weightKg ? String(product.weightKg) : '',
        sku: product.sku ?? '',
        isDigital: product.isDigital ?? false,
        allowReturns: product.allowReturns ?? true,
        returnDays: String(product.returnDays ?? '14'),
      })
    } else {
      setForm({
        title: '',
        description: '',
        condition: 'New' as ProductCondition,
        price: '',
        stockQuantity: '0',
        tags: '',
        weightKg: '',
        sku: '',
        isDigital: false,
        allowReturns: true,
        returnDays: '14',
      })
    }
  }, [open, product])

  const canSubmit = useMemo(() => {
    const price = Number(form.price)
    const stock = Number(form.stockQuantity)
    const returnDays = Number(form.returnDays)
    return (
      form.title.trim().length > 0 &&
      CONDITIONS.includes(form.condition) &&
      Number.isFinite(price) &&
      price >= 0 &&
      Number.isFinite(stock) &&
      stock >= 0 &&
      Number.isFinite(returnDays) &&
      returnDays >= 0
    )
  }, [form])

  if (!open) return null

  const submit = async () => {
    if (!canSubmit || loading) return

    clearErrors()

    const { valid, invalid } = normalizeImageFiles(images)
    if (invalid.length > 0) {
      setErrorFor('images.0', 'Please select only image files (png, jpg, jpeg, webp).')
      showError('Please select only image files (png, jpg, jpeg, webp).')
      return
    }

    try {
      setLoading(true)

      if (isEditMode && product) {
        await updateProductUseCase.execute({
          id: product.id,
          title: form.title.trim(),
          description: form.description.trim() ? form.description.trim() : null,
          condition: form.condition,
          price: Number(form.price),
          stockQuantity: Number(form.stockQuantity),
          images: valid.length ? valid : undefined,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          weightKg: form.weightKg.trim() ? Number(form.weightKg) : null,
          sku: form.sku.trim() ? form.sku.trim() : null,
          isDigital: form.isDigital,
          allowReturns: form.allowReturns,
          returnDays: Number(form.returnDays),
        })
        success('Product updated!')
      } else {
        const payload: CreateProductDTO = {
          title: form.title.trim(),
          description: form.description.trim() ? form.description.trim() : null,
          condition: form.condition,
          price: Number(form.price),
          stockQuantity: Number(form.stockQuantity),
          images: valid.length ? valid : undefined,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          weightKg: form.weightKg.trim() ? Number(form.weightKg) : null,
          sku: form.sku.trim() ? form.sku.trim() : null,
          isDigital: form.isDigital,
          allowReturns: form.allowReturns,
          returnDays: Number(form.returnDays),
        }

        await createProductUseCase.execute(payload)
        success('Product created!')
      }

      onClose()
      onCreated()
    } catch (err: unknown) {
      const mapped = extract422Errors(err)
      if (mapped) {
        setFieldErrors(mapped)
        const firstKey = Object.keys(mapped)[0]
        const firstMsg = firstKey ? mapped[firstKey]?.[0] : null
        showError(firstMsg || 'Validation error. Please check the form.')
        return
      }

      const anyErr = err as any
      const msg =
        anyErr?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Something went wrong')
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0e0f12] text-white shadow-2xl max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div>
              <p className="text-sm text-white/50">Store</p>
              <h2 className="text-lg font-semibold">
                {isEditMode ? 'Edit product' : 'Add new product'}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 transition"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5 text-white/70" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Title" error={fieldErrors['title']?.[0]}>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className={inputClass(
                    'title',
                    'w-full rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 outline-none focus:border-white/20'
                  )}
                  placeholder="e.g. Hoodie"
                />
              </Field>

              <Field label="Condition" error={fieldErrors['condition']?.[0]}>
                <select
                  value={form.condition}
                  onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value as ProductCondition }))}
                  className={inputClass(
                    'condition',
                    'w-full rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 outline-none focus:border-white/20'
                  )}
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Price" error={fieldErrors['price']?.[0]}>
                <input
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  className={inputClass(
                    'price',
                    'w-full rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 outline-none focus:border-white/20'
                  )}
                  placeholder="e.g. 89"
                  inputMode="decimal"
                />
              </Field>

              <Field label="Stock quantity" error={fieldErrors['stock_quantity']?.[0] || fieldErrors['stockQuantity']?.[0]}>
                <input
                  value={form.stockQuantity}
                  onChange={(e) => setForm((p) => ({ ...p, stockQuantity: e.target.value }))}
                  className={inputClass(
                    'stock_quantity',
                    'w-full rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 outline-none focus:border-white/20'
                  )}
                  inputMode="numeric"
                />
              </Field>

              <Field label="SKU (optional)" error={fieldErrors['sku']?.[0]}>
                <input
                  value={form.sku}
                  onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                  className={inputClass(
                    'sku',
                    'w-full rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 outline-none focus:border-white/20'
                  )}
                  placeholder="e.g. HD-001"
                />
              </Field>

              <Field label="Weight (kg) (optional)" error={fieldErrors['weight_kg']?.[0] || fieldErrors['weightKg']?.[0]}>
                <input
                  value={form.weightKg}
                  onChange={(e) => setForm((p) => ({ ...p, weightKg: e.target.value }))}
                  className={inputClass(
                    'weight_kg',
                    'w-full rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 outline-none focus:border-white/20'
                  )}
                  placeholder="e.g. 0.75"
                  inputMode="decimal"
                />
              </Field>
            </div>

            <Field label="Description (optional)" error={fieldErrors['description']?.[0]}>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className={inputClass(
                  'description',
                  'w-full min-h-[100px] rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 outline-none focus:border-white/20 resize-none'
                )}
                placeholder="Write a short description..."
              />
            </Field>

            <Field label="Tags (comma separated)" error={fieldErrors['tags']?.[0]}>
              <input
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                className={inputClass(
                  'tags',
                  'w-full rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 outline-none focus:border-white/20'
                )}
                placeholder="e.g. streetwear, hoodie, winter"
              />
            </Field>

            <Field
              label="Images"
              error={
                fieldErrors['images']?.[0] ||
                fieldErrors['images.0']?.[0] ||
                fieldErrors['images.1']?.[0]
              }
            >
              <div className={inputClass('images.0', 'rounded-xl bg-[#1a1b1f] border border-white/10 p-4')}>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => {
                    clearErrors()
                    setImages(Array.from(e.target.files ?? []))
                  }}
                  className="block w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-white/15"
                />

                {images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {images.map((f) => (
                      <span
                        key={f.name}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70"
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Toggle
                label="Digital product"
                value={form.isDigital}
                onChange={(v) => setForm((p) => ({ ...p, isDigital: v }))}
              />

              <Toggle
                label="Allow returns"
                value={form.allowReturns}
                onChange={(v) => setForm((p) => ({ ...p, allowReturns: v }))}
              />

              <Field label="Return days" error={fieldErrors['return_days']?.[0] || fieldErrors['returnDays']?.[0]}>
                <input
                  value={form.returnDays}
                  onChange={(e) => setForm((p) => ({ ...p, returnDays: e.target.value }))}
                  className={inputClass(
                    'return_days',
                    'w-full rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 outline-none focus:border-white/20'
                  )}
                  inputMode="numeric"
                />
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 transition"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={!canSubmit || loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
  error,
}: {
  label: string
  children: React.ReactNode
  error?: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
      {children}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  )
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="w-full rounded-xl bg-[#1a1b1f] border border-white/10 px-4 py-3 flex items-center justify-between hover:border-white/20 transition"
      >
        <span className="text-sm text-white/80">{value ? 'Yes' : 'No'}</span>
        <span
          className={`w-10 h-6 rounded-full border border-white/10 p-1 transition ${
            value ? 'bg-emerald-500/20' : 'bg-white/5'
          }`}
        >
          <span
            className={`block w-4 h-4 rounded-full transition ${
              value ? 'translate-x-4 bg-emerald-400' : 'translate-x-0 bg-white/50'
            }`}
          />
        </span>
      </button>
    </div>
  )
}