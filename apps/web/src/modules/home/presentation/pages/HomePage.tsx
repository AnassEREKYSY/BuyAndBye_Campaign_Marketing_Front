import { Link } from 'react-router-dom'
import { useInView } from '@/shared/hooks'
import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  LinkIcon,
  TicketIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

function Reveal({ children, delayMs = 0 }: { children: React.ReactNode; delayMs?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`bb-fade-up ${inView ? 'bb-fade-up-in' : ''}`} style={{ transitionDelay: `${delayMs}ms` }}>
      {children}
    </div>
  )
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return <span className="bb-stat-icon">{children}</span>
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bb-card">
      <div className="flex items-start gap-3">
        <IconBubble>{icon}</IconBubble>
        <div>
          <p className="text-base font-extrabold tracking-tight bb-title-text">{title}</p>
          <p className="mt-2 text-sm leading-6 bb-subtle-text">{desc}</p>
        </div>
      </div>
    </div>
  )
}

function StepCard({ index, icon, title, desc }: { index: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bb-card">
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.10)',
            backgroundColor: 'rgb(var(--bb-border) / 0.04)',
            color: 'rgb(var(--bb-muted) / 0.90)',
          }}
        >
          {index}
        </span>
        <IconBubble>{icon}</IconBubble>
      </div>
      <p className="mt-4 text-base font-extrabold bb-title-text">{title}</p>
      <p className="mt-2 text-sm leading-6 bb-subtle-text">{desc}</p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bb-soft-box p-4">
      <p className="text-xs font-semibold bb-muted-text">{label}</p>
      <p className="mt-2 text-sm font-extrabold bb-title-text">{value}</p>
    </div>
  )
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-card) / 0.72)',
        color: 'rgb(var(--bb-text) / 0.90)',
      }}
    >
      <span className="h-4 w-4">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function KpiBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bb-soft-box p-4">
      <p className="text-xs font-semibold bb-muted-text">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight bb-title-text">{value}</p>
    </div>
  )
}

export function HomePage() {
  return (
    <div className="bb-page flex flex-col gap-10 px-4 py-6 md:px-6">
      <section className="bb-surface bb-surface-pad">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div
          className="pointer-events-none absolute -inset-24 bb-float opacity-60 blur-3xl"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.16), rgba(56,189,248,0.12), rgba(255,255,255,0.05), rgba(99,102,241,0.16))',
          }}
        />

        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <span className="bb-chip">
              <SparklesIcon className="h-4 w-4" />
              Creator marketing, but measurable
            </span>

            <h1 className="bb-title mt-4">
              Turn creator collaborations into{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgb(var(--bb-primary) / 0.90), rgb(var(--bb-accent) / 0.85), rgb(var(--bb-cyan) / 0.85))',
                }}
              >
                tracked revenue
              </span>
              .
            </h1>

            <p className="bb-p mt-4 max-w-xl">
              Launch campaigns, track conversions with <span className="font-extrabold bb-title-text">links + codes</span>, and keep
              commissions transparent — in a clean workflow for brands and influencers.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="bb-btn-primary">
                Get started
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>

              <Link to="/brand" className="bb-btn-ghost">
                For Brands
              </Link>

              <Link to="/influencer" className="bb-btn-soft">
                For Influencers
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Reporting" value="Realtime" />
              <MiniStat label="Attribution" value="Links + codes" />
              <MiniStat label="Ops work" value="Less manual" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <TrustItem icon={<ShieldCheckIcon className="h-4 w-4" />} text="Clean rules, clear payouts" />
              <TrustItem icon={<BoltIcon className="h-4 w-4" />} text="Fast setup, structured flow" />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bb-glass bb-ring relative overflow-hidden rounded-3xl border p-6" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}>
              <div className="pointer-events-none absolute inset-0 bb-shimmer" />

              <div className="relative flex items-center justify-between">
                <span className="bb-chip">
                  <ChartBarIcon className="h-4 w-4" />
                  Campaign dashboard
                </span>
                <span className="bb-chip">Realtime</span>
              </div>

              <p className="relative mt-4 text-xl font-black tracking-tight bb-title-text">All the signals in one place</p>

              <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
                <KpiBox label="Clicks" value="12,480" />
                <KpiBox label="Conversions" value="1,042" />

                <div className="bb-soft-box p-4 sm:col-span-2">
                  <p className="text-xs font-semibold bb-muted-text">Tracking</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bb-chip">
                      <LinkIcon className="h-4 w-4" /> Links
                    </span>
                    <span className="bb-chip">
                      <TicketIcon className="h-4 w-4" /> Codes
                    </span>
                    <span className="bb-chip">
                      <CurrencyDollarIcon className="h-4 w-4" /> Commissions
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full blur-3xl"
                style={{ background: 'linear-gradient(135deg, rgb(var(--bb-primary) / 0.16), rgb(var(--bb-cyan) / 0.10))' }}
              />
              <div
                className="pointer-events-none absolute -left-10 -bottom-12 h-64 w-64 rounded-full blur-3xl"
                style={{ background: 'linear-gradient(135deg, rgb(var(--bb-accent) / 0.12), rgb(var(--bb-border) / 0.05))' }}
              />
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 lg:grid-cols-3">
          <FeatureCard
            icon={<LinkIcon className="h-5 w-5" />}
            title="Attribution that makes sense"
            desc="Consistent signals across channels using unique links and promo codes."
          />
          <FeatureCard
            icon={<UserGroupIcon className="h-5 w-5" />}
            title="Collaboration workflow"
            desc="Invite, approve, and manage creators without operational chaos."
          />
          <FeatureCard
            icon={<CurrencyDollarIcon className="h-5 w-5" />}
            title="Payout-ready reporting"
            desc="Transparent commissions with clear rules — easier payout preparation."
          />
        </section>
      </Reveal>

      <Reveal delayMs={60}>
        <section className="bb-surface bb-surface-pad">
          <div className="pointer-events-none absolute inset-0 bb-spotlight opacity-70" />
          <div className="pointer-events-none absolute inset-0 bb-grid" />
          <div className="pointer-events-none absolute inset-0 bb-noise" />

          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <h2 className="bb-h2">How it works</h2>
              <p className="bb-p mt-3 max-w-xl">
                A clean flow from campaign creation to measurable performance and transparent payouts.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/brand" className="bb-btn-primary">
                  Explore
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
                <Link to="/contact" className="bb-btn-ghost">
                  Contact
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-3 sm:grid-cols-2">
                <StepCard index="01" icon={<SparklesIcon className="h-5 w-5" />} title="Create a campaign" desc="Define products, goals, tracking method, and commission rules." />
                <StepCard index="02" icon={<UserGroupIcon className="h-5 w-5" />} title="Collaborate" desc="Invite creators and share assets + guidelines with clarity." />
                <StepCard index="03" icon={<ChartBarIcon className="h-5 w-5" />} title="Track performance" desc="Monitor clicks, conversions, and ROI in one view." />
                <StepCard index="04" icon={<CurrencyDollarIcon className="h-5 w-5" />} title="Pay commissions" desc="Keep earnings transparent and prepare payouts confidently." />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bb-card">
            <span className="bb-chip">
              <ShieldCheckIcon className="h-4 w-4" />
              For Brands
            </span>
            <h3 className="mt-4 text-2xl font-black tracking-tight bb-title-text">Control ROI, not chaos.</h3>
            <p className="bb-p mt-3">Launch campaigns faster, reduce manual ops, and keep a premium brand experience.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/brand" className="bb-btn-primary">
                Explore Brands
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/register" className="bb-btn-ghost">
                Create account
              </Link>
            </div>
          </div>

          <div className="bb-card">
            <span className="bb-chip">
              <SparklesIcon className="h-4 w-4" />
              For Influencers
            </span>
            <h3 className="mt-4 text-2xl font-black tracking-tight bb-title-text">Earn with clarity.</h3>
            <p className="bb-p mt-3">Join campaigns, track what you drive, and understand your earnings — without friction.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/influencer" className="bb-btn-soft">
                Explore Influencers
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/register" className="bb-btn-ghost">
                Join now
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={80}>
        <section className="bb-surface bb-surface-pad">
          <div className="pointer-events-none absolute inset-0 bb-spotlight opacity-80" />
          <div className="pointer-events-none absolute inset-0 bb-noise" />

          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="bb-h2">Ready to make creator marketing measurable?</h2>
              <p className="bb-p mt-3 max-w-2xl">Start with a clean workflow, premium UI, and reporting that stays consistent.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="bb-btn-primary">
                Get started
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/contact" className="bb-btn-ghost">
                Book a demo
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}