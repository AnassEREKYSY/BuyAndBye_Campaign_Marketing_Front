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

      if (isEdit && initial) {
        await onUpdate(initial.id, {
          name: name.trim(),
          description: description.trim() ? description.trim() : null,
          price: price.trim() ? toNumberOrNull(price.trim()) : null,
          currency: currency.trim() ? currency.trim() : null,
          landingUrl: landingUrl.trim() ? landingUrl.trim() : null,
          images,
        })
      } else {
        await onCreate({
          name: name.trim(),
          description: description.trim() ? description.trim() : null,
          price: price.trim() ? toNumberOrNull(price.trim()) : null,
          currency: currency.trim() ? currency.trim() : null,
          landingUrl: landingUrl.trim() ? landingUrl.trim() : null,
          images,
        })
      }

      onClose()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bb-gradient-border bb-glass bb-ring relative w-full max-w-2xl overflow-hidden rounded-[26px] border border-white/10 p-4 text-white">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold tracking-tight">{isEdit ? 'Edit product' : 'Create product'}</p>
              <p className="mt-1 text-xs font-semibold text-white/55">Fill the fields then save.</p>
            </div>
            <button onClick={onClose} className="bb-btn-ghost h-10 px-4">
              Close
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm font-semibold text-rose-100">
              {error}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-extrabold text-white/70">Name</label>
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-extrabold text-white/70">Description</label>
              <textarea
                className="mt-2 min-h-[90px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-white/70">Price</label>
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="199.99"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-white/70">Currency</label>
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="MAD"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-extrabold text-white/70">Landing URL</label>
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={landingUrl}
                onChange={(e) => setLandingUrl(e.target.value)}
                placeholder="https://brand.com/product"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-extrabold text-white/70">Images (one URL per line)</label>
              <textarea
                className="mt-2 min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none"
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
            <button onClick={() => void submit()} disabled={saving} className="bb-btn-ghost h-11 px-5">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}