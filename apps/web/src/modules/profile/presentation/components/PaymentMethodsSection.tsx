import { useMemo, useState } from 'react'
import { GhostButton, PrimaryButton, SectionTitle, SubtleCard } from './ui'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function PayOption({
  checked,
  onChange,
  title,
  desc,
  tag,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  title: string
  desc: string
  tag?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx('w-full rounded-3xl border p-4 text-left transition will-change-transform hover:-translate-y-[1px]')}
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: checked ? 'rgb(var(--bb-border) / 0.06)' : 'rgb(var(--bb-border) / 0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-extrabold bb-title-text">{title}</p>
            {tag ? (
              <span
                className="rounded-full border px-2 py-1 text-[11px] font-extrabold"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: 'rgb(var(--bb-muted) / 0.90)',
                }}
              >
                {tag}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm bb-subtle-text">{desc}</p>
        </div>

        <span
          className="mt-1 grid h-6 w-6 place-items-center rounded-xl border transition"
          style={{
            borderColor: checked ? 'rgb(var(--bb-accent) / 0.35)' : 'rgb(var(--bb-border) / 0.12)',
            backgroundColor: checked ? 'rgb(var(--bb-accent) / 0.18)' : 'transparent',
            color: checked ? 'rgb(var(--bb-text) / 0.92)' : 'transparent',
          }}
          aria-hidden
        >
          ✓
        </span>
      </div>
    </button>
  )
}

export function PaymentMethodsSection() {
  const [cash, setCash] = useState(true)
  const [bank, setBank] = useState(false)
  const [paypal, setPaypal] = useState(false)

  const selected = useMemo(() => [cash, bank, paypal].filter(Boolean).length, [cash, bank, paypal])

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Payment methods"
        subtitle="Choose your payout preferences."
        right={
          <span
            className="rounded-full border px-3 py-2 text-xs font-extrabold"
            style={{
              borderColor: 'rgb(var(--bb-border) / 0.10)',
              backgroundColor: 'rgb(var(--bb-border) / 0.04)',
              color: 'rgb(var(--bb-muted) / 0.90)',
            }}
          >
            Selected: {selected}
          </span>
        }
      />

      <SubtleCard>
        <p className="text-sm bb-subtle-text">
          Tip: bank transfer is usually preferred for brands. PayPal is faster for international payouts.
        </p>
      </SubtleCard>

      <div className="grid grid-cols-1 gap-3">
        <PayOption checked={cash} onChange={setCash} title="Cash" tag="Local" desc="Get paid in cash (where supported)." />
        <PayOption checked={bank} onChange={setBank} title="Bank transfer" tag="Recommended" desc="IBAN / RIB payout for reliability." />
        <PayOption checked={paypal} onChange={setPaypal} title="PayPal" tag="Fast" desc="Quick payouts with your PayPal account." />
      </div>

      <div
        className="flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
      >
        <div className="text-sm bb-subtle-text">UI ready — connect later to your payments endpoint.</div>
        <div className="flex items-center gap-3">
          <GhostButton type="button" onClick={() => { setCash(true); setBank(false); setPaypal(false) }}>
            Reset
          </GhostButton>
          <PrimaryButton type="button">Save payment methods</PrimaryButton>
        </div>
      </div>
    </div>
  )
}