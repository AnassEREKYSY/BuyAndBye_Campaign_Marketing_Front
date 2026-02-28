import { useEffect, useMemo, useState } from 'react'
import { XMarkIcon, PhotoIcon, LinkIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline'
import { Product } from '@core/modules/dashboard/domain/entities'
import { CreateProductDTO, UpdateProductDTO } from '@core/modules/dashboard/domain/dtos'

type Props = {
  open: boolean
  onClose: () => void
  initial?: Product | null
  onCreate: (dto: CreateProductDTO) => Promise<any>
  onUpdate: (id: string, dto: UpdateProductDTO) => Promise<any>
}

function toNumberOrNull(v: string) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function FieldLabel({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon ? (
        <span
          className="grid h-8 w-8 place-items-center rounded-full border"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.10)',
            backgroundColor: 'rgb(var(--bb-border) / 0.04)',
            color: 'rgb(var(--bb-text) / 0.85)',
          }}
        >
          {icon}
        </span>
      ) : null}
      <span className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
        {children}
      </span>
    </div>
  )
}

export function BrandProductModal({ open, onClose, initial, onCreate, onUpdate }: Props) {
  const isEdit = useMemo(() => Boolean(initial?.id), [initial])

  const [name, setName] = useState('')
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [currency, setCurrency] = useState<string>('MAD')
  const [landingUrl, setLandingUrl] = useState<string>('')
  const [imagesText, setImagesText] = useState<string>('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setSaving(false)

    setName(initial?.name ?? '')
    setDescription(initial?.description ?? '')
    setPrice(initial?.price !== null && initial?.price !== undefined ? String(initial?.price) : '')
    setCurrency(initial?.currency ?? 'MAD')
    setLandingUrl(initial?.landingUrl ?? '')
    setImagesText((initial?.images ?? []).join('\n'))
  }, [open, initial])

  if (!open) return null

  const images = imagesText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  async function submit() {
    try {
      setError(null)
      setSaving(true)

      if (!name.trim()) {
        setError('Name is required')
        return
      }

      const dto = {
        name: name.trim(),
        description: description.trim() ? description.trim() : null,
        price: price.trim() ? toNumberOrNull(price.trim()) : null,
        currency: currency.trim() ? currency.trim() : null,
        landingUrl: landingUrl.trim() ? landingUrl.trim() : null,
        images,
      }

      if (isEdit && initial) await onUpdate(initial.id, dto as UpdateProductDTO)
      else await onCreate(dto as CreateProductDTO)

      onClose()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* ✅ Reduced height: max-h + internal scroll */}
      <div className="bb-pop relative w-full max-w-2xl overflow-hidden rounded-[26px] border"
           style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-surface) / 0.88)' }}
      >
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div className="pointer-events-none absolute inset-0 bb-spotlight opacity-70" />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-3 border-b px-4 py-4 sm:px-5"
             style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
              {isEdit ? 'Edit product' : 'Create product'}
            </p>
            <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
              Keep it clean, add only what’s needed.
            </p>
          </div>

          <button type="button" onClick={onClose} className="bb-icon-btn h-11 w-11" aria-label="Close">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body (scrollable, shorter) */}
        <div className="relative max-h-[70vh] overflow-y-auto px-4 py-4 sm:px-5 bb-soft-scroll">
          {error ? (
            <div
              className="mb-4 rounded-2xl border p-3 text-sm font-semibold"
              style={{
                borderColor: 'rgb(244 63 94 / 0.25)',
                backgroundColor: 'rgb(244 63 94 / 0.10)',
                color: 'rgb(var(--bb-text) / 0.92)',
              }}
            >
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FieldLabel icon={<TagIcon className="h-4 w-4" />}>Name</FieldLabel>
              <input className="bb-input mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
            </div>

            <div className="md:col-span-2">
              <FieldLabel> Description</FieldLabel>
              <textarea
                className={cx('mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition')}
                style={{
                  minHeight: 80, // ✅ reduced
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-card) / 0.80)',
                  color: 'rgb(var(--bb-text) / 0.95)',
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
              />
            </div>

            <div>
              <FieldLabel icon={<CurrencyDollarIcon className="h-4 w-4" />}>Price</FieldLabel>
              <input className="bb-input mt-2" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="199.99" />
            </div>

            <div>
              <FieldLabel>Currency</FieldLabel>
              <input className="bb-input mt-2" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="MAD" />
            </div>

            <div className="md:col-span-2">
              <FieldLabel icon={<LinkIcon className="h-4 w-4" />}>Landing URL</FieldLabel>
              <input className="bb-input mt-2" value={landingUrl} onChange={(e) => setLandingUrl(e.target.value)} placeholder="https://brand.com/product" />
            </div>

            <div className="md:col-span-2">
              <FieldLabel icon={<PhotoIcon className="h-4 w-4" />}>Images (one URL per line)</FieldLabel>
              <textarea
                className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition"
                style={{
                  minHeight: 96, // ✅ reduced
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-card) / 0.80)',
                  color: 'rgb(var(--bb-text) / 0.95)',
                }}
                value={imagesText}
                onChange={(e) => setImagesText(e.target.value)}
                placeholder={'https://...\nhttps://...'}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative flex items-center justify-end gap-3 border-t px-4 py-4 sm:px-5"
          style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-surface) / 0.55)' }}
        >
          <button onClick={onClose} className="bb-btn-ghost h-11 px-5" type="button">
            Cancel
          </button>
          <button onClick={() => void submit()} disabled={saving} className="bb-btn-primary h-11 px-5 disabled:opacity-60" type="button">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}