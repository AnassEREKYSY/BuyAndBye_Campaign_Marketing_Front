import { Link } from 'react-router-dom'
import {
  LinkIcon,
  TicketIcon,
  ChartBarIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  QrCodeIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

const steps = [
  { n: '1', title: 'Publish a campaign', text: 'Pick a product, set the commission and the payout tiers. Creators can apply right away.' },
  { n: '2', title: 'Accept the right creators', text: 'Review profiles and audience numbers, shortlist, then accept. Each creator gets a link and a promo code.' },
  { n: '3', title: 'Track and pay', text: 'Every click is counted. Payout periods close with the right tier, so nobody argues about numbers.' },
]

const features = [
  { icon: LinkIcon, title: 'Tracked links', text: 'One short link per creator, with clicks and unique visitors counted on each visit.' },
  { icon: TicketIcon, title: 'Promo codes', text: 'A personal code for every collaboration, ready to share in a bio or a story.' },
  { icon: QrCodeIcon, title: 'QR codes', text: 'Turn any link into a QR code for packaging, flyers or events, in one click.' },
  { icon: ChartBarIcon, title: 'Analytics', text: 'Clicks over time, best creators, traffic sources and devices across all campaigns.' },
  { icon: BanknotesIcon, title: 'Tiered payouts', text: 'Payouts follow the tiers you define and move from pending to approved to paid.' },
  { icon: ChatBubbleLeftRightIcon, title: 'Built-in messages', text: 'Talk with each creator inside the collaboration, no email threads to dig through.' },
]

/** Static preview of the analytics screen used in the hero. */
function ProductPreview() {
  const bars = [32, 41, 38, 52, 47, 61, 58, 72, 66, 80, 74, 88, 83, 95]
  return (
    <div className="bb-card p-0" aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-bb-border/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-bb-border/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-bb-border/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-bb-border/15" />
        <span className="ml-3 text-xs text-bb-muted">Analytics · Last 14 days</span>
      </div>
      <div className="grid gap-4 p-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            ['Clicks', '4,812', '+18%'],
            ['Unique', '4,105', '+15%'],
            ['Creators', '12', '+3'],
          ].map(([label, value, delta]) => (
            <div key={label} className="bb-soft-box p-3">
              <p className="text-xs text-bb-muted">{label}</p>
              <p className="mt-1 text-lg font-semibold">{value}</p>
              <p className="text-xs text-bb-success">{delta}</p>
            </div>
          ))}
        </div>
        <div className="bb-soft-box flex h-36 items-end gap-1.5 p-3">
          {bars.map((h, i) => (
            <div key={i} className={`flex-1 rounded-t-[3px] ${i === bars.length - 1 ? 'bg-bb-accent' : 'bg-bb-primary/70'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="grid gap-2">
          {[
            ['Lina B.', 'Summer glow', '1,532'],
            ['Omar T.', 'Slow mornings', '1,204'],
            ['Sara L.', 'Sunday reset', '987'],
          ].map(([name, campaign, clicks]) => (
            <div key={name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="bb-avatar h-6 w-6 text-[10px]">{name[0]}</span>
                <span>{name}</span>
                <span className="text-bb-muted">· {campaign}</span>
              </span>
              <span className="font-medium tabular-nums">{clicks}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:pt-20">
        <div className="bb-pop">
          <p className="bb-eyebrow">Influencer campaigns, measured</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Work with creators. <span className="text-bb-primary-strong">Pay for real results.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[17px] leading-7 text-bb-muted">
            Kickback gives every creator a tracked link and a promo code, counts the clicks, and turns them into fair payouts. Brands see what works. Creators see what they earn.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register?role=brand" className="bb-btn-primary h-11 px-5">
              Start as a brand
            </Link>
            <Link to="/register?role=influencer" className="bb-btn-ghost h-11 px-5">
              Join as a creator
            </Link>
          </div>
          <ul className="mt-8 grid gap-2 text-sm text-bb-muted">
            {['No setup fees', 'Links, codes and QR codes generated for you', 'Light and dark mode'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-bb-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <ProductPreview />
      </section>

      {/* How it works */}
      <section className="border-y border-bb-border/10 bg-bb-subtle">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="bb-h2">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-bb-primary text-sm font-semibold text-white">{s.n}</span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-bb-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="bb-h2">Everything in one place</h2>
        <p className="bb-p mt-2 max-w-xl">From the first application to the last payout.</p>
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

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[14px] bg-bb-primary-soft px-8 py-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Ready for your next campaign?</h2>
            <p className="mt-2 text-bb-muted">Create an account, or sign in with a demo account to look around.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/register" className="bb-btn-primary h-11 px-5">
              Get started
            </Link>
            <Link to="/login" className="bb-btn-ghost h-11 px-5">
              Try the demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
