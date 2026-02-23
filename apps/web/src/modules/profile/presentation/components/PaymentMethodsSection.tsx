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
      className={cx(
        'group w-full rounded-3xl border p-4 text-left transition will-change-transform',
        checked ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5 hover:-translate-y-[1px] hover:bg-white/10',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-extrabold text-white/90">{title}</p>
            {tag ? (
              <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] font-extrabold text-white/60">
                {tag}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-white/55">{desc}</p>
        </div>

        <span
          className={cx(
            'mt-1 grid h-6 w-6 place-items-center rounded-xl border transition',
            checked ? 'border-white/30 bg-white text-black' : 'border-white/15 bg-transparent text-transparent',
          )}
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
        subtitle="Choose your payout preferences. Connect later to your wallet/payout module."
        right={
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/70">
            Selected: {selected}
          </span>
        }
      />

      <SubtleCard>
        <p className="text-sm text-white/60">
          Tip: bank transfer is usually preferred for brands. PayPal is faster for international payouts.
        </p>
      </SubtleCard>

      <div className="grid grid-cols-1 gap-3">
        <PayOption
          checked={cash}
          onChange={setCash}
          title="Cash"
          tag="Local"
          desc="Get paid in cash (where supported by the platform)."
        />
        <PayOption
          checked={bank}
          onChange={setBank}
          title="Bank transfer"
          tag="Recommended"
          desc="IBAN / RIB payout for reliable transfers and accounting."
        />
        <PayOption
          checked={paypal}
          onChange={setPaypal}
          title="PayPal"
          tag="Fast"
          desc="Quick payouts with your PayPal account."
        />
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/60">
          UI ready — connect later to your payments endpoint.
        </div>
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