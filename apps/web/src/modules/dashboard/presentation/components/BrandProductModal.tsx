import { useEffect, useMemo, useState } from 'react'
import type { Product } from '@core/modules/dashboard/domain/entities'
import type { CreateProductDTO, UpdateProductDTO } from '@core/modules/dashboard/domain/dtos'
import { Modal } from '@/shared/components/ui'

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

  const footer = (
    <>
      <button onClick={onClose} className="bb-btn-ghost" type="button">
        Cancel
      </button>
      <button onClick={() => void submit()} disabled={saving} className="bb-btn-primary" type="button">
        {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
      </button>
    </>
  )

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit product' : 'New product'} footer={footer} width="max-w-xl">
      {error ? <div className="bb-soft-box mb-4 border-bb-accent/30 bg-bb-accent-soft p-3 text-sm text-bb-accent-strong">{error}</div> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="bb-label" htmlFor="pm-name">
            Name
          </label>
          <input id="pm-name" className="bb-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rose & Argan Face Serum" />
        </div>

        <div className="sm:col-span-2">
          <label className="bb-label" htmlFor="pm-desc">
            Description <span className="font-normal text-bb-muted">(optional)</span>
          </label>
          <textarea id="pm-desc" rows={3} className="bb-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description creators can reuse" />
        </div>

        <div>
          <label className="bb-label" htmlFor="pm-price">
            Price
          </label>
          <input id="pm-price" className="bb-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="199.99" inputMode="decimal" />
        </div>

        <div>
          <label className="bb-label" htmlFor="pm-currency">
            Currency
          </label>
          <input id="pm-currency" className="bb-input" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="MAD" />
        </div>

        <div className="sm:col-span-2">
          <label className="bb-label" htmlFor="pm-landing">
            Landing page URL
          </label>
          <input id="pm-landing" className="bb-input" value={landingUrl} onChange={(e) => setLandingUrl(e.target.value)} placeholder="https://yourbrand.com/product" />
          <p className="mt-1.5 text-xs text-bb-muted">Tracked links send visitors here.</p>
        </div>

        <div className="sm:col-span-2">
          <label className="bb-label" htmlFor="pm-images">
            Images <span className="font-normal text-bb-muted">(one URL per line)</span>
          </label>
          <textarea id="pm-images" rows={3} className="bb-input" value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder={'https://…\nhttps://…'} />
        </div>
      </div>
    </Modal>
  )
}
