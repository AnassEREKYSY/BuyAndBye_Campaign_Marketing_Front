import { useMemo, useState } from 'react'
import { GhostButton, PrimaryButton, SectionTitle, SubtleCard } from './ui'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function ToggleCard({
  value,
  onChange,
  label,
  desc,
  badge,
}: {
  value: boolean
  onChange: (v: boolean) => void
  label: string
  desc: string
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cx(
        'group w-full rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition will-change-transform',
        'hover:-translate-y-[1px] hover:bg-white/10',
        value && 'bg-white/10',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-extrabold text-white/95">{label}</p>
            {badge ? (
              <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] font-extrabold text-white/60">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-white/60">{desc}</p>
        </div>

        <span
          className={cx(
            'relative mt-0.5 inline-flex h-7 w-12 items-center rounded-full border border-white/10 bg-black/30 transition',
            value && 'bg-white/20',
          )}
          aria-hidden
        >
          <span
            className={cx(
              'absolute left-[3px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_10px_25px_rgba(0,0,0,0.35)] transition',
              value && 'left-[26px]',
            )}
          />
        </span>
      </div>
    </button>
  )
}

export function AccountSettingsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [productUpdates, setProductUpdates] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  const risk = useMemo(() => {
    if (twoFactor) return { label: 'Protected', cls: 'text-emerald-200' }
    return { label: 'Recommended: enable 2FA', cls: 'text-amber-200' }
  }, [twoFactor])

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Account settings"
        subtitle="Premium controls for notifications and security. Connect later to your settings endpoint."
        right={
          <span className={cx('rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold', risk.cls)}>
            {risk.label}
          </span>
        }
      />

      <SubtleCard>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold text-white/90">Quick overview</p>
            <p className="mt-1 text-sm text-white/55">
              Keep security on, and notifications only for what matters.
            </p>
          </div>
          <div className="hidden sm:block rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold text-white/60">
            Settings are stored locally (UI).
          </div>
        </div>
      </SubtleCard>

      <div className="grid grid-cols-1 gap-3">
        <ToggleCard
          value={emailNotifs}
          onChange={setEmailNotifs}
          label="Email notifications"
          badge="Important"
          desc="Receive updates about campaigns, account activity, and payout status."
        />
        <ToggleCard
          value={productUpdates}
          onChange={setProductUpdates}
          label="Product updates"
          badge="Nice to have"
          desc="Get notified when new features are shipped to improve your workflow."
        />
        <ToggleCard
          value={twoFactor}
          onChange={setTwoFactor}
          label="Two-factor authentication"
          badge="Security"
          desc="Extra protection for your account. Strongly recommended."
        />
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/60">
          Changes are ready to be saved once your backend settings endpoint is added.
        </p>
        <div className="flex items-center gap-3">
          <GhostButton type="button" onClick={() => { setEmailNotifs(true); setProductUpdates(false); setTwoFactor(false) }}>
            Reset
          </GhostButton>
          <PrimaryButton type="button">Save settings</PrimaryButton>
        </div>
      </div>
    </div>
  )
}