import { Link } from 'react-router-dom'
import {
  AdjustmentsHorizontalIcon,
  BanknotesIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  LinkIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

const steps = [
  { n: '1', title: 'Create a campaign', text: 'Describe the product, set the commission and the payout tiers. Publish when it is ready.' },
  { n: '2', title: 'Choose your creators', text: 'Creators apply with their profile and audience numbers. Shortlist, accept or decline.' },
  { n: '3', title: 'Track and pay', text: 'Each accepted creator gets a tracked link and a promo code. Payouts follow the tiers you set.' },
]

const features = [
  { icon: AdjustmentsHorizontalIcon, title: 'Your rules', text: 'Commission, payout tiers, dates and guidelines are set once per campaign and apply to everyone.' },
  { icon: UserGroupIcon, title: 'You decide who joins', text: 'Every creator applies first. You see their niche, platforms and follower counts before you accept.' },
  { icon: LinkIcon, title: 'Links and codes', text: 'A short link, a promo code and a QR code are generated for each collaboration.' },
  { icon: ChartBarIcon, title: 'Clear numbers', text: 'Clicks and unique visitors per creator and per campaign, over the period you pick.' },
  { icon: BanknotesIcon, title: 'Payouts you can check', text: 'Each payout period shows the clicks counted and the tier reached. Pending, approved, paid.' },
  { icon: ChatBubbleLeftRightIcon, title: 'Messages in one place', text: 'One conversation per collaboration, next to the numbers it is about.' },
]

export function BrandPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:pt-20">
        <div className="bb-pop max-w-2xl">
          <p className="bb-eyebrow">For brands</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">Know which creators actually send you traffic.</h1>
          <p className="mt-5 text-[17px] leading-7 text-bb-muted">
            Kickback gives each creator you work with a tracked link and a promo code. You see the clicks they bring, and you pay them on the tiers you agreed on.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register?role=brand" className="bb-btn-primary h-11 px-5">
              Create a brand account
            </Link>
            <Link to="/contact" className="bb-btn-ghost h-11 px-5">
              Ask a question
            </Link>
          </div>
          <ul className="mt-8 grid gap-2 text-sm text-bb-muted">
            {['No setup fees', 'You approve every creator', 'Payouts based on counted clicks'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-bb-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-bb-border/10 bg-bb-subtle">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="bb-h2">How a campaign runs</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-bb-primary text-sm font-semibold text-white dark:text-bb-bg">{s.n}</span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-bb-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="bb-h2">What you get</h2>
        <p className="bb-p mt-2 max-w-xl">Everything you need to run creator campaigns without a spreadsheet on the side.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="bb-card">
                <span className="bb-stat-icon">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-bb-muted">{f.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[14px] bg-bb-primary-soft px-8 py-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Start your first campaign</h2>
            <p className="mt-2 text-bb-muted">Create an account and publish a campaign in a few minutes.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/register?role=brand" className="bb-btn-primary h-11 px-5">
              Get started
            </Link>
            <Link to="/influencer" className="bb-btn-ghost h-11 px-5">
              I'm a creator
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
