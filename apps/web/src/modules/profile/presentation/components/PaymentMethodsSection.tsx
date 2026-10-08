import { useMemo, useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { FormFooter, GhostButton, PrimaryButton, SectionTitle } from './ui'

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
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start justify-between gap-4 rounded-[10px] border p-4 text-left transition-colors ${
        checked ? 'border-bb-primary/60 bg-bb-primary-soft' : 'border-bb-border/15 hover:bg-bb-subtle'
      }`}
    >
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{title}</span>
          {tag ? <span className="bb-badge">{tag}</span> : null}
        </span>
        <span className="mt-1 block text-sm text-bb-muted">{desc}</span>
      </span>
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border ${
          checked ? 'border-bb-primary bg-bb-primary text-bb-card' : 'border-bb-border/25'
        }`}
        aria-hidden
      >
        {checked ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
      </span>
    </button>
  )
}

export function PaymentMethodsSection() {
  const [cash, setCash] = useState(true)
  const [bank, setBank] = useState(false)
  const [paypal, setPaypal] = useState(false)

  const selected = useMemo(() => [cash, bank, paypal].filter(Boolean).length, [cash, bank, paypal])

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Payment methods"
        subtitle="How you prefer to receive payouts. Pick one or more."
        right={<span className="bb-badge">{selected} selected</span>}
      />

      <div className="grid grid-cols-1 gap-3">
        <PayOption checked={cash} onChange={setCash} title="Cash" tag="Local" desc="Paid in cash, where the brand supports it." />
        <PayOption checked={bank} onChange={setBank} title="Bank transfer" tag="Recommended" desc="Paid to your IBAN / RIB. The usual choice for brands." />
        <PayOption checked={paypal} onChange={setPaypal} title="PayPal" desc="Paid to your PayPal account. Handy for international payouts." />
      </div>

      <FormFooter note="Payout preferences are not saved to your account yet.">
        <GhostButton
          type="button"
          onClick={() => {
            setCash(true)
            setBank(false)
            setPaypal(false)
          }}
        >
          Reset
        </GhostButton>
        <PrimaryButton type="button">Save</PrimaryButton>
      </FormFooter>
    </div>
  )
}
