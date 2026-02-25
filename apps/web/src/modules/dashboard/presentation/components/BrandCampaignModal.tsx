// apps/web/src/modules/dashboard/presentation/components/BrandCampaignModal.tsx
import { useEffect, useMemo, useState } from 'react'
import type { Campaign } from '@core/modules/dashboard'
import type { CreateCampaignDTO, UpdateCampaignDTO } from '@core/modules/dashboard/domain/dtos'
import { Product } from '@core/modules/dashboard/domain/entities'

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

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 6l1 16h10l1-16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
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
        setError('End date must be after start date')
        return
      }

      const normalized = normalizeTiers(tiers)
      const tierErr = validateTiers(normalized)
      if (tierErr) {
        setError(tierErr)
        return
      }

      if (isEdit && initial) {
        await onUpdate(initial.id, payloadBase as UpdateCampaignDTO, normalized)
      } else {
        await onCreate(
          {
            productId,
            ...(payloadBase as any),
          } as CreateCampaignDTO,
          normalized,
        )
      }

      onClose()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-3 sm:p-4">
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] max-w-6xl flex-col sm:h-[calc(100vh-2rem)]">
        <div className="bb-gradient-border bb-glass bb-ring relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/10 text-white">
          <div className="pointer-events-none absolute inset-0 bb-spotlight" />
          <div className="pointer-events-none absolute inset-0 bb-noise" />

          <div className="relative flex items-start justify-between gap-3 border-b border-white/10 bg-black/20 px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight">{isEdit ? 'Edit campaign' : 'Create campaign'}</p>
              <p className="mt-1 text-xs font-semibold text-white/55">Campaign details + payout tiers.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="bb-btn-ghost h-10 px-4">
                Close
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-y-auto px-4 py-4 sm:px-5 bb-soft-scroll">
            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm font-semibold text-rose-100">
                {error}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold">Payout tiers</p>
                  <p className="mt-1 text-xs font-semibold text-white/55">Clicks ranges used to compute payouts.</p>
                </div>
                <button onClick={addTier} className="bb-btn-ghost h-10 px-4">
                  <span className="inline-flex items-center gap-2">
                    <IconPlus />
                    Add tier
                  </span>
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[860px] text-left text-sm text-white">
                    <thead className="border-b border-white/10 text-xs font-extrabold uppercase tracking-wider text-white/55">
                      <tr>
                        <th className="px-4 py-3">Metric</th>
                        <th className="px-4 py-3">From</th>
                        <th className="px-4 py-3">To</th>
                        <th className="px-4 py-3">Payout</th>
                        <th className="px-4 py-3">Currency</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {tiers.map((t, idx) => (
                        <tr key={t.id ?? `new_${idx}`}>
                          <td className="px-4 py-3 font-semibold">clicks</td>

                          <td className="px-4 py-3">
                            <input
                              className="h-10 w-28 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white outline-none"
                              value={String(t.fromValue)}
                              onChange={(e) => {
                                const v = toIntOrNull(e.target.value)
                                updateTier(idx, { fromValue: v ?? 0 })
                              }}
                              inputMode="numeric"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              className="h-10 w-28 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white outline-none"
                              value={t.toValue === null ? '' : String(t.toValue)}
                              onChange={(e) => {
                                const raw = e.target.value.trim()
                                const v = raw ? toIntOrNull(raw) : null
                                updateTier(idx, { toValue: v })
                              }}
                              placeholder="∞"
                              inputMode="numeric"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              className="h-10 w-36 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white outline-none"
                              value={String(t.payoutAmount)}
                              onChange={(e) => {
                                const v = toNumberOrNull(e.target.value)
                                updateTier(idx, { payoutAmount: v ?? 0 })
                              }}
                              inputMode="decimal"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <input
                              className="h-10 w-24 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white outline-none"
                              value={t.currency ?? 'MAD'}
                              onChange={(e) => updateTier(idx, { currency: e.target.value })}
                              placeholder="MAD"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex justify-end">
                              <button
                                onClick={() => removeTier(idx)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                                title="Remove"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {tiers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-white/60">
                            No tiers
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="h-4" />
          </div>

          <div className="relative flex items-center justify-end gap-3 border-t border-white/10 bg-black/20 px-4 py-4 sm:px-5">
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