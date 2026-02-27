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
      className={cx('rounded-3xl border p-4 text-left transition will-change-transform hover:-translate-y-[1px]')}
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: value ? 'rgb(var(--bb-border) / 0.06)' : 'rgb(var(--bb-border) / 0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-extrabold bb-title-text">{label}</p>
            {badge ? (
              <span
                className="rounded-full border px-2 py-1 text-[11px] font-extrabold"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: 'rgb(var(--bb-muted) / 0.90)',
                }}
              >
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm bb-subtle-text">{desc}</p>
        </div>

        <span
          className="relative mt-0.5 inline-flex h-7 w-12 items-center rounded-full border transition"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.12)',
            backgroundColor: value ? 'rgb(var(--bb-accent) / 0.18)' : 'rgb(var(--bb-border) / 0.06)',
          }}
          aria-hidden
        >
          <span
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition"
            style={{
              left: value ? 26 : 3,
              backgroundColor: 'rgb(var(--bb-text) / 0.92)',
              boxShadow: '0 10px 25px rgb(0 0 0 / 0.20)',
            }}
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
        subtitle="Premium controls for notifications and security."
        right={
          <span
            className={cx('rounded-full border px-3 py-2 text-xs font-extrabold', risk.cls)}
            style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
          >
            {risk.label}
          </span>
        }
      />

      <SubtleCard>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold bb-title-text">Quick overview</p>
            <p className="mt-1 text-sm bb-subtle-text">Keep security on, notifications only for what matters.</p>
          </div>
          <div
            className="hidden sm:block rounded-2xl border px-3 py-2 text-xs font-bold bb-muted-text"
            style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
          >
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
          desc="Updates about campaigns, account activity, and payout status."
        />
        <ToggleCard
          value={productUpdates}
          onChange={setProductUpdates}
          label="Product updates"
          badge="Nice to have"
          desc="New features shipped to improve your workflow."
        />
        <ToggleCard
          value={twoFactor}
          onChange={setTwoFactor}
          label="Two-factor authentication"
          badge="Security"
          desc="Extra protection for your account."
        />
      </div>

      <div
        className="flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
      >
        <p className="text-sm bb-subtle-text">Ready to connect to your settings endpoint.</p>
        <div className="flex items-center gap-3">
          <GhostButton
            type="button"
            onClick={() => {
              setEmailNotifs(true)
              setProductUpdates(false)
              setTwoFactor(false)
            }}
          >
            Reset
          </GhostButton>
          <PrimaryButton type="button">Save settings</PrimaryButton>
        </div>
      </div>
    </div>
  )
}