import { useEffect, useMemo, useState } from 'react'
import type { Campaign } from '@core/modules/dashboard'
import type { CreateCampaignDTO, UpdateCampaignDTO } from '@core/modules/dashboard/domain/dtos'
import { Product } from '@core/modules/dashboard/domain/entities'
import {
  XMarkIcon,
  Squares2X2Icon,
  TagIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

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

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
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

function FieldLabel({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-[11px] font-extrabold tracking-wide" style={{ color: 'rgb(var(--bb-muted) / 0.86)' }}>
      {icon ? (
        <span
          className="grid h-7 w-7 place-items-center rounded-xl border"
          style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
        >
          {icon}
        </span>
      ) : null}
      <span className="uppercase">{children}</span>
    </label>
  )
}

function SoftAlert({ kind, children }: { kind: 'error' | 'success'; children: React.ReactNode }) {
  const styles =
    kind === 'success'
      ? { borderColor: 'rgb(16 185 129 / 0.25)', backgroundColor: 'rgb(16 185 129 / 0.10)' }
      : { borderColor: 'rgb(244 63 94 / 0.25)', backgroundColor: 'rgb(244 63 94 / 0.10)' }

  return (
    <div className="rounded-2xl border p-3 text-sm font-semibold" style={styles}>
      <div className="flex items-start gap-2" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
        {kind === 'error' ? <ExclamationTriangleIcon className="mt-0.5 h-5 w-5" /> : <CheckIcon className="mt-0.5 h-5 w-5" />}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}

function IconChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border px-4 py-3"
      style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
    >
      <span
        className="grid h-10 w-10 place-items-center rounded-2xl border"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-surface) / 0.55)',
          color: 'rgb(var(--bb-text) / 0.90)',
        }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold tracking-wide" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
          {value}
        </p>
      </div>
    </div>
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

  const productName = products.find((p) => p.id === productId)?.name ?? '—'
  const commissionPreview = commissionValue.trim() ? `${commissionType} • ${commissionValue.trim()}` : '—'
  const datesPreview = `${startAt || '—'} → ${endAt || '—'}`

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 p-3 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] max-w-6xl flex-col sm:h-[calc(100vh-2rem)]">
        <div className="bb-surface bb-pop relative flex h-full flex-col overflow-hidden rounded-[28px]">
          <div className="pointer-events-none absolute inset-0 bb-spotlight" />
          <div className="pointer-events-none absolute inset-0 bb-grid" />
          <div className="pointer-events-none absolute inset-0 bb-noise" />

          {/* Header */}
          <div
            className="relative border-b px-4 py-4 sm:px-5"
            style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-surface) / 0.70)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold"
                    style={{
                      borderColor: 'rgb(var(--bb-border) / 0.10)',
                      backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                      color: 'rgb(var(--bb-muted) / 0.90)',
                    }}
                  >
                    <SparklesIcon className="h-4 w-4" />
                    {isEdit ? 'Edit campaign' : 'Create campaign'}
                  </span>

                  <span
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold"
                    style={{
                      borderColor: 'rgb(var(--bb-border) / 0.10)',
                      backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                      color: 'rgb(var(--bb-muted) / 0.90)',
                    }}
                  >
                    <Squares2X2Icon className="h-4 w-4" />
                    Tiers included
                  </span>
                </div>

                <h2 className="mt-3 truncate text-lg font-black" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                  {title.trim() ? title.trim() : 'Untitled campaign'}
                </h2>

                <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.86)' }}>
                  Keep the same fields — just a cleaner, more premium modal.
                </p>
              </div>

              <button onClick={onClose} className="bb-icon-btn h-11 w-11" aria-label="Close">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <IconChip icon={<TagIcon className="h-5 w-5" />} label="Product" value={productName} />
              <IconChip icon={<BanknotesIcon className="h-5 w-5" />} label="Commission" value={commissionPreview} />
              <IconChip icon={<CalendarDaysIcon className="h-5 w-5" />} label="Dates" value={datesPreview} />
            </div>
          </div>

          {/* Body */}
          <div className="relative flex-1 overflow-y-auto px-4 py-4 sm:px-5 bb-soft-scroll">
            {error ? (
              <div className="mb-4">
                <SoftAlert kind="error">{error}</SoftAlert>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Left: form */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bb-card p-4 sm:p-5">
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                    Campaign details
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                    Basic info used to publish to the marketplace.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel icon={<TagIcon className="h-4 w-4" />}>Product</FieldLabel>
                      <select className="bb-select mt-2 w-full" value={productId} onChange={(e) => setProductId(e.target.value)}>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <FieldLabel icon={<SparklesIcon className="h-4 w-4" />}>Title</FieldLabel>
                      <input className="bb-input mt-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Campaign title" />
                    </div>

                    <div className="md:col-span-2">
                      <FieldLabel>Objective</FieldLabel>
                      <textarea
                        className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition"
                        style={{
                          minHeight: 110,
                          borderColor: 'rgb(var(--bb-border) / 0.10)',
                          backgroundColor: 'rgb(var(--bb-card) / 0.80)',
                          color: 'rgb(var(--bb-text) / 0.95)',
                        }}
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        placeholder="Objective (optional)"
                      />
                    </div>

                    <div>
                      <FieldLabel icon={<BanknotesIcon className="h-4 w-4" />}>Commission type</FieldLabel>
                      <select className="bb-select mt-2 w-full" value={commissionType} onChange={(e) => setCommissionType(e.target.value as any)}>
                        <option value="percent">Percent</option>
                        <option value="fixed">Fixed</option>
                      </select>
                    </div>

                    <div>
                      <FieldLabel icon={<BanknotesIcon className="h-4 w-4" />}>Commission value</FieldLabel>
                      <input
                        className="bb-input mt-2"
                        value={commissionValue}
                        onChange={(e) => setCommissionValue(e.target.value)}
                        placeholder={commissionType === 'percent' ? '10' : '50'}
                      />
                    </div>

                    <div>
                      <FieldLabel icon={<BanknotesIcon className="h-4 w-4" />}>Budget</FieldLabel>
                      <input className="bb-input mt-2" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="2000" />
                    </div>

                    <div>
                      <FieldLabel icon={<CalendarDaysIcon className="h-4 w-4" />}>Start date</FieldLabel>
                      <input type="date" className="bb-input mt-2" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
                    </div>

                    <div>
                      <FieldLabel icon={<CalendarDaysIcon className="h-4 w-4" />}>End date</FieldLabel>
                      <input type="date" className="bb-input mt-2" value={endAt} onChange={(e) => setEndAt(e.target.value)} min={startAt || undefined} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: tiers */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bb-card p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                        Payout tiers
                      </p>
                      <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                        Ranges must not overlap.
                      </p>
                    </div>

                    <button onClick={addTier} className="bb-btn-ghost h-10 px-4">
                      <span className="inline-flex items-center gap-2">
                        <PlusIcon className="h-5 w-5" />
                        Add
                      </span>
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {tiers.map((t, idx) => (
                      <div
                        key={t.id ?? `new_${idx}`}
                        className="rounded-3xl border p-4"
                        style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                              Tier {idx + 1} · clicks
                            </p>
                            <p className="mt-1 truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                              From {t.fromValue} → {t.toValue ?? '∞'} · {Number(t.payoutAmount).toFixed(2)} {t.currency ?? 'MAD'}
                            </p>
                          </div>

                          <button onClick={() => removeTier(idx)} className="bb-icon-btn h-10 w-10" title="Remove">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <FieldLabel>From</FieldLabel>
                            <input
                              className="bb-input mt-2 h-10 px-3"
                              value={String(t.fromValue)}
                              onChange={(e) => {
                                const v = toIntOrNull(e.target.value)
                                updateTier(idx, { fromValue: v ?? 0 })
                              }}
                              inputMode="numeric"
                            />
                          </div>

                          <div>
                            <FieldLabel>To</FieldLabel>
                            <input
                              className="bb-input mt-2 h-10 px-3"
                              value={t.toValue === null ? '' : String(t.toValue)}
                              onChange={(e) => {
                                const raw = e.target.value.trim()
                                const v = raw ? toIntOrNull(raw) : null
                                updateTier(idx, { toValue: v })
                              }}
                              placeholder="∞"
                              inputMode="numeric"
                            />
                          </div>

                          <div>
                            <FieldLabel>Payout</FieldLabel>
                            <input
                              className="bb-input mt-2 h-10 px-3"
                              value={String(t.payoutAmount)}
                              onChange={(e) => {
                                const v = toNumberOrNull(e.target.value)
                                updateTier(idx, { payoutAmount: v ?? 0 })
                              }}
                              inputMode="decimal"
                            />
                          </div>

                          <div>
                            <FieldLabel>Currency</FieldLabel>
                            <input
                              className="bb-input mt-2 h-10 px-3"
                              value={t.currency ?? 'MAD'}
                              onChange={(e) => updateTier(idx, { currency: e.target.value })}
                              placeholder="MAD"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {tiers.length === 0 ? (
                      <div className="rounded-2xl border p-4 text-sm font-semibold" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', color: 'rgb(var(--bb-muted) / 0.88)' }}>
                        No tiers
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 rounded-2xl border p-3 text-xs font-semibold" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-surface) / 0.55)', color: 'rgb(var(--bb-muted) / 0.86)' }}>
                    Tip: Use <span className="font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.90)' }}>∞</span> by leaving “To” empty.
                  </div>
                </div>
              </div>
            </div>

            <div className="h-3" />
          </div>

          {/* Footer */}
          <div
            className="relative flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-surface) / 0.70)' }}
          >
            <p className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.86)' }}>
              Press <span className="font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>Esc</span> to close.
            </p>

            <div className="flex items-center justify-end gap-2">
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
    </div>
  )
}