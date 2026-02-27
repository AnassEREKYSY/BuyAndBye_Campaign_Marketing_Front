import { useEffect, useMemo, useState } from 'react'
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bb-surface bb-pop relative w-full max-w-2xl overflow-hidden rounded-[26px] p-4">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
                {isEdit ? 'Edit product' : 'Create product'}
              </p>
              <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                Fill the fields then save.
              </p>
            </div>
            <button onClick={onClose} className="bb-btn-ghost h-10 px-4">
              Close
            </button>
          </div>

          {error ? (
            <div
              className="mt-4 rounded-2xl border p-3 text-sm font-semibold"
              style={{ borderColor: 'rgb(244 63 94 / 0.25)', backgroundColor: 'rgb(244 63 94 / 0.10)', color: 'rgb(var(--bb-text) / 0.92)' }}
            >
              {error}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                Name
              </label>
              <input className="bb-input mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                Description
              </label>
              <textarea
                className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition"
                style={{
                  minHeight: 90,
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
              <label className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                Price
              </label>
              <input className="bb-input mt-2" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="199.99" />
            </div>

            <div>
              <label className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                Currency
              </label>
              <input className="bb-input mt-2" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="MAD" />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                Landing URL
              </label>
              <input className="bb-input mt-2" value={landingUrl} onChange={(e) => setLandingUrl(e.target.value)} placeholder="https://brand.com/product" />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                Images (one URL per line)
              </label>
              <textarea
                className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition"
                style={{
                  minHeight: 110,
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

          <div className="mt-5 flex justify-end gap-3">
            <button onClick={onClose} className="bb-btn-ghost h-11 px-5">
              Cancel
            </button>
            <button onClick={() => void submit()} disabled={saving} className="bb-btn-primary h-11 px-5 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}