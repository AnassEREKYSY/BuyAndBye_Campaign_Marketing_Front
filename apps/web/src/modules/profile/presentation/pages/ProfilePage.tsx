import { useState } from 'react'
import { ProfileProvider } from '../../application/context'
import {
  AccountSettingsSection,
  LogoutSection,
  PaymentMethodsSection,
  PersonalInfoSection,
  ProfileShell,
  SocialMediaSection,
} from '../components'
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ShareIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

type TabKey = 'personal' | 'settings' | 'socials' | 'payments' | 'logout'

const items = [
  { key: 'personal', label: 'Personal information', icon: <UserCircleIcon className="h-[18px] w-[18px]" /> },
  { key: 'settings', label: 'Account settings', icon: <Cog6ToothIcon className="h-[18px] w-[18px]" /> },
  { key: 'socials', label: 'Social media', icon: <ShareIcon className="h-[18px] w-[18px]" /> },
  { key: 'payments', label: 'Payment methods', icon: <CreditCardIcon className="h-[18px] w-[18px]" /> },
  { key: 'logout', label: 'Log out', icon: <ArrowRightOnRectangleIcon className="h-[18px] w-[18px]" /> },
]

function ProfilePageInner() {
  const [active, setActive] = useState<TabKey>('personal')

  return (
    <ProfileShell
      title="Profile"
      subtitle="Your details, social links and account preferences."
      items={items}
      activeKey={active}
      onSelect={(k) => setActive(k as TabKey)}
    >
      {active === 'personal' && <PersonalInfoSection />}
      {active === 'settings' && <AccountSettingsSection />}
      {active === 'socials' && <SocialMediaSection />}
      {active === 'payments' && <PaymentMethodsSection />}
      {active === 'logout' && <LogoutSection />}
    </ProfileShell>
  )
}

export function ProfilePage() {
  return (
    <ProfileProvider>
      <ProfilePageInner />
    </ProfileProvider>
  )
}
