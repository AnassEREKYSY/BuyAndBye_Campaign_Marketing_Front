import { useState } from 'react'
import { FormFooter, GhostButton, PrimaryButton, SectionTitle, SwitchRow } from './ui'

export function AccountSettingsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [productUpdates, setProductUpdates] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Account settings"
        subtitle="Notifications and security."
        right={twoFactor ? <span className="bb-badge bb-badge-green">Protected</span> : <span className="bb-badge bb-badge-amber">2FA recommended</span>}
      />

      <div className="divide-y divide-bb-border/10">
        <SwitchRow
          checked={emailNotifs}
          onChange={setEmailNotifs}
          label="Email notifications"
          description="Campaign updates, account activity and payout status."
        />
        <SwitchRow checked={productUpdates} onChange={setProductUpdates} label="Product updates" description="An occasional email when we ship something new." />
        <SwitchRow checked={twoFactor} onChange={setTwoFactor} label="Two-factor authentication" description="Ask for a code in addition to your password when you sign in." />
      </div>

      <FormFooter note="These settings are not saved to your account yet.">
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
        <PrimaryButton type="button">Save</PrimaryButton>
      </FormFooter>
    </div>
  )
}
