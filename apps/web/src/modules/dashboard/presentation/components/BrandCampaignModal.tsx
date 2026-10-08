import { useEffect, useMemo, useState } from 'react'
import type { Campaign } from '@core/modules/dashboard'
import type { CreateCampaignDTO, UpdateCampaignDTO } from '@core/modules/dashboard/domain/dtos'
import type { Product } from '@core/modules/dashboard/domain/entities'
import { PlusIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Modal } from '@/shared/components/ui'

type TierDraft = {
  id?: string
  metric: 'clicks'
  fromValue: number
  toValue: number | null
  payoutAmount: number
  currency: string | null
}

type Props = {
  open: boolean
  onClose: () => void
  products: Product[]
  initial?: Campaign | null
  initialTiers?: TierDraft[]
  onCreate: (dto: CreateCampaignDTO, tiers: TierDraft[]) => Promise<any>
  onUpdate: (id: string, dto: UpdateCampaignDTO, tiers: TierDraft[]) => Promise<any>
}

function toNumberOrNull(v: string) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function toIntOrNull(v: string) {
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  return Math.max(0, Math.trunc(n))
}

function isoToDateInput(v?: string | null) {
  if (!v) return ''
  return v.slice(0, 10)
}

function normalizeTiers(tiers: TierDraft[]): TierDraft[] {
  return [...tiers]
    .map((t) => ({
      ...t,
      metric: 'clicks' as const,
      fromValue: Number(t.fromValue ?? 0),
      toValue: t.toValue === null || t.toValue === undefined ? null : Number(t.toValue),
      payoutAmount: Number(t.payoutAmount ?? 0),
      currency: (t.currency ?? 'MAD')?.trim() || 'MAD',
    }))
    .sort((a, b) => a.fromValue - b.fromValue)
}

function validateTiers(tiers: TierDraft[]): string | null {
  for (const t of tiers) {
    if (t.fromValue < 0) return 'Tier "from" must be >= 0'
    if (t.toValue !== null && t.toValue < t.fromValue) return 'Tier "to" must be >= "from"'
    if (!Number.isFinite(t.payoutAmount) || t.payoutAmount < 0) return 'Tier payout must be >= 0'
  }

  const sorted = [...tiers].sort((a, b) => a.fromValue - b.fromValue)
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]
    const b = sorted[i + 1]
    const aEnd = a.toValue === null ? Infinity : a.toValue
    if (b.fromValue <= aEnd) return 'Tiers overlap. Please adjust ranges.'
  }

  return null
}

export function BrandCampaignModal({ open, onClose, products, initial, initialTiers, onCreate, onUpdate }: Props) {
  const isEdit = useMemo(() => Boolean(initial?.id), [initial])

  const [productId, setProductId] = useState('')
  const [title, setTitle] = useState('')
  const [objective, setObjective] = useState('')
  const [commissionType, setCommissionType] = useState<'percent' | 'fixed'>('percent')
  const [commissionValue, setCommissionValue] = useState('')
  const [budget, setBudget] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')

  const [tiers, setTiers] = useState<TierDraft[]>([])
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

    const seed =
      initialTiers && initialTiers.length > 0
        ? normalizeTiers(initialTiers)
        : normalizeTiers([{ metric: 'clicks', fromValue: 0, toValue: null, payoutAmount: 0, currency: 'MAD' }])

    setTiers(seed)
  }, [open, initial, products, initialTiers])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  function addTier() {
    setTiers((prev) =>
      normalizeTiers([
        ...prev,
        {
          metric: 'clicks',
          fromValue: prev.length ? (prev[prev.length - 1].toValue ?? prev[prev.length - 1].fromValue + 1) : 0,
          toValue: null,
          payoutAmount: 0,
          currency: 'MAD',
        },
      ]),
    )
  }

  function removeTier(idx: number) {
    setTiers((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateTier(idx: number, patch: Partial<TierDraft>) {
    setTiers((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], ...patch, metric: 'clicks' }
      return next
    })
  }

  async function submit() {
    try {
      setError(null)
      setSaving(true)

      if (!productId) return setError('Product is required')
      if (!title.trim()) return setError('Title is required')

      const cv = toNumberOrNull(commissionValue.trim())
      if (cv === null) return setError('Commission value is required')

      const payloadBase = {
        title: title.trim(),
        objective: objective.trim() ? objective.trim() : null,
        commissionType,
        commissionValue: cv,
        budget: budget.trim() ? toNumberOrNull(budget.trim()) : null,
        startAt: startAt ? startAt : null,
        endAt: endAt ? endAt : null,
      }

      if (payloadBase.startAt && payloadBase.endAt && payloadBase.endAt < payloadBase.startAt) {
        return setError('End date must be after start date')
      }

      const normalized = normalizeTiers(tiers)
      const tierErr = validateTiers(normalized)
      if (tierErr) return setError(tierErr)

      if (isEdit && initial) {
        await onUpdate(initial.id, payloadBase as UpdateCampaignDTO, normalized)
      } else {
        await onCreate({ productId, ...(payloadBase as any) } as CreateCampaignDTO, normalized)
      }

      onClose()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const footer = (
    <>
      <button type="button" onClick={onClose} className="bb-btn-ghost">
        Cancel
      </button>
      <button type="button" onClick={() => void submit()} disabled={saving} className="bb-btn-primary">
        {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create campaign'}
      </button>
    </>
  )

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit campaign' : 'New campaign'} footer={footer} width="max-w-2xl">
      {error ? (
        <div className="bb-soft-box mb-4 flex items-start gap-2 border-bb-accent/30 bg-bb-accent-soft p-3 text-sm text-bb-accent-strong">
          <ExclamationTriangleIcon className="mt-0.5 h-[18px] w-[18px] shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="bb-label" htmlFor="cm-product">
            Product
          </label>
          <select id="cm-product" className="bb-select w-full" value={productId} onChange={(e) => setProductId(e.target.value)}>
            {products.length === 0 ? <option value="">No products yet</option> : null}
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="bb-label" htmlFor="cm-title">
            Title
          </label>
          <input id="cm-title" className="bb-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summer glow with the Rose Serum" />
        </div>

        <div className="sm:col-span-2">
          <label className="bb-label" htmlFor="cm-objective">
            Objective <span className="font-normal text-bb-muted">(optional)</span>
          </label>
          <textarea
            id="cm-objective"
            rows={3}
            className="bb-input"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="What should creators show or say?"
          />
        </div>

        <div>
          <label className="bb-label" htmlFor="cm-ctype">
            Commission type
          </label>
          <select id="cm-ctype" className="bb-select w-full" value={commissionType} onChange={(e) => setCommissionType(e.target.value as any)}>
            <option value="percent">Percent of sale</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </div>

        <div>
          <label className="bb-label" htmlFor="cm-cvalue">
            Commission value {commissionType === 'percent' ? '(%)' : '(MAD)'}
          </label>
          <input
            id="cm-cvalue"
            className="bb-input"
            value={commissionValue}
            onChange={(e) => setCommissionValue(e.target.value)}
            placeholder={commissionType === 'percent' ? '10' : '50'}
            inputMode="decimal"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="bb-label" htmlFor="cm-budget">
            Budget (MAD) <span className="font-normal text-bb-muted">(optional)</span>
          </label>
          <input id="cm-budget" className="bb-input" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="2000" inputMode="decimal" />
        </div>

        <div>
          <label className="bb-label" htmlFor="cm-start">
            Start date
          </label>
          <input id="cm-start" type="date" className="bb-input" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
        </div>

        <div>
          <label className="bb-label" htmlFor="cm-end">
            End date
          </label>
          <input id="cm-end" type="date" className="bb-input" value={endAt} onChange={(e) => setEndAt(e.target.value)} min={startAt || undefined} />
        </div>
      </div>

      <div className="mt-6 border-t border-bb-border/10 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Payout tiers</h3>
            <p className="mt-0.5 text-xs text-bb-muted">Payout per creator by clicks. Leave “to” empty for no upper limit. Ranges must not overlap.</p>
          </div>
          <button type="button" onClick={addTier} className="bb-btn-ghost h-9 shrink-0 px-3">
            <PlusIcon className="h-4 w-4" />
            Add tier
          </button>
        </div>

        {tiers.length === 0 ? (
          <p className="bb-soft-box mt-3 p-3 text-sm text-bb-muted">No tiers. Add one to define payouts.</p>
        ) : (
          <div className="mt-3 grid gap-2">
            <div className="hidden grid-cols-[1fr_1fr_1fr_90px_32px] gap-2 px-1 text-xs text-bb-muted sm:grid">
              <span>From (clicks)</span>
              <span>To (clicks)</span>
              <span>Payout</span>
              <span>Currency</span>
              <span />
            </div>
            {tiers.map((t, idx) => (
              <div key={t.id ?? `new_${idx}`} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_90px_32px] sm:items-center">
                <input
                  className="bb-input h-9"
                  aria-label={`Tier ${idx + 1} from`}
                  value={String(t.fromValue)}
                  onChange={(e) => {
                    const v = toIntOrNull(e.target.value)
                    updateTier(idx, { fromValue: v ?? 0 })
                  }}
                  inputMode="numeric"
                />
                <input
                  className="bb-input h-9"
                  aria-label={`Tier ${idx + 1} to`}
                  value={t.toValue === null ? '' : String(t.toValue)}
                  onChange={(e) => {
                    const raw = e.target.value.trim()
                    const v = raw ? toIntOrNull(raw) : null
                    updateTier(idx, { toValue: v })
                  }}
                  placeholder="No limit"
                  inputMode="numeric"
                />
                <input
                  className="bb-input h-9"
                  aria-label={`Tier ${idx + 1} payout`}
                  value={String(t.payoutAmount)}
                  onChange={(e) => {
                    const v = toNumberOrNull(e.target.value)
                    updateTier(idx, { payoutAmount: v ?? 0 })
                  }}
                  inputMode="decimal"
                />
                <input
                  className="bb-input h-9"
                  aria-label={`Tier ${idx + 1} currency`}
                  value={t.currency ?? 'MAD'}
                  onChange={(e) => updateTier(idx, { currency: e.target.value })}
                  placeholder="MAD"
                />
                <button
                  type="button"
                  onClick={() => removeTier(idx)}
                  className="bb-icon-btn col-span-2 h-8 w-8 justify-self-end hover:text-bb-accent-strong sm:col-span-1"
                  title="Remove tier"
                  aria-label={`Remove tier ${idx + 1}`}
                >
                  <TrashIcon className="h-[18px] w-[18px]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
