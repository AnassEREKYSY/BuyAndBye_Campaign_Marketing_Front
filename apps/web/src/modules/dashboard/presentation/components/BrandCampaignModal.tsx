import { useEffect, useMemo, useState } from 'react'
import type { Campaign } from '@core/modules/dashboard'
import type { CreateCampaignDTO, UpdateCampaignDTO } from '@core/modules/dashboard/domain/dtos'
import { Product } from '@core/modules/dashboard/domain/entities'

type Props = {
  open: boolean
  onClose: () => void
  products: Product[]
  initial?: Campaign | null
  onCreate: (dto: CreateCampaignDTO) => Promise<any>
  onUpdate: (id: string, dto: UpdateCampaignDTO) => Promise<any>
}

function toNumberOrNull(v: string) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function isoToDateInput(v?: string | null) {
  if (!v) return ''
  return v.slice(0, 10)
}

export function BrandCampaignModal({ open, onClose, products, initial, onCreate, onUpdate }: Props) {
  const isEdit = useMemo(() => Boolean(initial?.id), [initial])

  const [productId, setProductId] = useState('')
  const [title, setTitle] = useState('')
  const [objective, setObjective] = useState('')
  const [commissionType, setCommissionType] = useState<'percent' | 'fixed'>('percent')
  const [commissionValue, setCommissionValue] = useState('')
  const [budget, setBudget] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setSaving(false)

    setProductId(initial?.productId ?? (products[0]?.id ?? ''))
    setTitle(initial?.title ?? '')
    setObjective(initial?.objective ?? '')
    setCommissionType((initial?.commissionType as any) ?? 'percent')
    setCommissionValue(initial?.commissionValue !== undefined && initial?.commissionValue !== null ? String(initial?.commissionValue) : '')
    setBudget(initial?.budget !== undefined && initial?.budget !== null ? String(initial?.budget) : '')
    setStartAt(isoToDateInput(initial?.startAt ?? null))
    setEndAt(isoToDateInput(initial?.endAt ?? null))
  }, [open, initial, products])

  if (!open) return null

  async function submit() {
    try {
      setError(null)
      setSaving(true)

      if (!productId) {
        setError('Product is required')
        return
      }
      if (!title.trim()) {
        setError('Title is required')
        return
      }
      const cv = toNumberOrNull(commissionValue.trim())
      if (cv === null) {
        setError('Commission value is required')
        return
      }

      const payload = {
        title: title.trim(),
        objective: objective.trim() ? objective.trim() : null,
        commissionType,
        commissionValue: cv,
        budget: budget.trim() ? toNumberOrNull(budget.trim()) : null,
        startAt: startAt ? startAt : null,
        endAt: endAt ? endAt : null,
      }

      if (payload.startAt && payload.endAt && payload.endAt < payload.startAt) {
        setError('End date must be after start date')
        return
      }

      if (isEdit && initial) {
        await onUpdate(initial.id, payload)
      } else {
        await onCreate({
          productId,
          ...payload,
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
              <p className="text-sm font-extrabold tracking-tight">{isEdit ? 'Edit campaign' : 'Create campaign'}</p>
              <p className="mt-1 text-xs font-semibold text-white/55">Create a campaign and publish when ready.</p>
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
              <label className="text-xs font-extrabold text-white/70">Product</label>
              <select
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-extrabold text-white/70">Title</label>
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Campaign title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-extrabold text-white/70">Objective</label>
              <textarea
                className="mt-2 min-h-[90px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Objective (optional)"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-white/70">Commission type</label>
              <select
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={commissionType}
                onChange={(e) => setCommissionType(e.target.value as any)}
              >
                <option value="percent">Percent</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-white/70">Commission value</label>
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={commissionValue}
                onChange={(e) => setCommissionValue(e.target.value)}
                placeholder={commissionType === 'percent' ? '10' : '50'}
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-white/70">Budget</label>
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="2000"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-white/70">Start date</label>
              <input
                type="date"
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-white/70">End date</label>
              <input
                type="date"
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                min={startAt || undefined}
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