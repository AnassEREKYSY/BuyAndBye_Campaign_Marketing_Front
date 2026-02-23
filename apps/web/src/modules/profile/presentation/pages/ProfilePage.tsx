import { useMemo, useState } from 'react'
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

function IconWrap({ children }: { children: React.ReactNode }) {
  return <span className="grid h-5 w-5 place-items-center text-white/85">{children}</span>
}

function ProfilePageInner() {
  const [active, setActive] = useState<TabKey>('personal')

  const items = useMemo(
    () => [
      {
        key: 'personal',
        label: 'Personal information',
        description: 'Identity, brand/influencer profile and details.',
        icon: (
          <IconWrap>
            <UserCircleIcon className="h-5 w-5" />
          </IconWrap>
        ),
      },
      {
        key: 'settings',
        label: 'Account settings',
        description: 'Security, preferences, and notifications.',
        icon: (
          <IconWrap>
            <Cog6ToothIcon className="h-5 w-5" />
          </IconWrap>
        ),
      },
      {
        key: 'socials',
        label: 'Social media',
        description: 'Connect TikTok, Instagram, YouTube and more.',
        icon: (
          <IconWrap>
            <ShareIcon className="h-5 w-5" />
          </IconWrap>
        ),
      },
      {
        key: 'payments',
        label: 'Payment methods',
        description: 'Cash, bank transfer, PayPal (payout preferences).',
        icon: (
          <IconWrap>
            <CreditCardIcon className="h-5 w-5" />
          </IconWrap>
        ),
      },
      {
        key: 'logout',
        label: 'Logout',
        description: 'End your session on this device.',
        icon: (
          <IconWrap>
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </IconWrap>
        ),
      },
    ],
    [],
  )

  return (
    <ProfileShell
      title="Your Profile"
      subtitle="A premium space to manage your identity, socials, and account preferences."
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