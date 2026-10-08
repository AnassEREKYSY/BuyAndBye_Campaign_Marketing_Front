import { Link } from 'react-router-dom'
import { BanknotesIcon, ChartBarIcon, ChatBubbleLeftRightIcon, CheckIcon, MagnifyingGlassIcon, QrCodeIcon, TicketIcon } from '@heroicons/react/24/outline'

const steps = [
  { n: '1', title: 'Set up your profile', text: 'Add your niche, your platforms and your follower counts. Brands see this when you apply.' },
  { n: '2', title: 'Apply to campaigns', text: 'Browse open campaigns, read the commission and the payout tiers, and apply to the ones that fit.' },
  { n: '3', title: 'Share and get paid', text: 'Once accepted, you get your own link and promo code. Your payout follows the clicks you bring.' },
]

const features = [
  { icon: MagnifyingGlassIcon, title: 'Open campaigns', text: 'See what each brand offers before you apply: product, commission, tiers and dates.' },
  { icon: TicketIcon, title: 'Your own link and code', text: 'A short link and a promo code for every collaboration, ready for a bio or a story.' },
  { icon: QrCodeIcon, title: 'QR codes', text: 'Download a QR code for any of your links, for packaging, events or print.' },
  { icon: ChartBarIcon, title: 'Your numbers', text: 'Clicks and unique visitors per link, so you know what worked and where.' },
  { icon: BanknotesIcon, title: 'Earnings you can follow', text: 'Each payout shows the tier reached and its status: pending, approved, paid.' },
  { icon: ChatBubbleLeftRightIcon, title: 'Direct messages', text: 'Talk to the brand inside the collaboration instead of chasing emails.' },
]

export function InfluencerPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:pt-20">
        <div className="bb-pop max-w-2xl">
          <p className="bb-eyebrow">For creators</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">See the clicks you bring. Get paid for them.</h1>
          <p className="mt-5 text-[17px] leading-7 text-bb-muted">
            Apply to brand campaigns on Kickback, share your own link or promo code, and follow your clicks and earnings in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register?role=influencer" className="bb-btn-primary h-11 px-5">
              Join as a creator
            </Link>
            <Link to="/brand" className="bb-btn-ghost h-11 px-5">
              I'm a brand
            </Link>
          </div>
          <ul className="mt-8 grid gap-2 text-sm text-bb-muted">
            {['Free for creators', 'The same numbers as the brand', 'Payout tiers known upfront'].map((t) => (
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
          <h2 className="bb-h2">How it works</h2>
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
        <p className="bb-p mt-2 max-w-xl">Tools to share, measure and get paid, without asking the brand for screenshots.</p>
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
            <h2 className="text-2xl font-semibold tracking-tight">Find your next collaboration</h2>
            <p className="mt-2 text-bb-muted">Create a free account and fill in your profile to start applying.</p>
          </div>
          <Link to="/register?role=influencer" className="bb-btn-primary h-11 px-5">
            Create a creator account
          </Link>
        </div>
      </section>
    </div>
  )
}
