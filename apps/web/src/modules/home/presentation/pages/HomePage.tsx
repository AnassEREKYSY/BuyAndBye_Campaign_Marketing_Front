// apps/web/src/modules/home/presentation/pages/HomePage.tsx
import { Link } from 'react-router-dom'
import { useInView } from '@/shared/hooks'

function Reveal({ children, delayMs = 0 }: { children: React.ReactNode; delayMs?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`bb-fade-up ${inView ? 'bb-fade-up-in' : ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bb-card">
      <p className="text-3xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm font-extrabold text-white/80">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{hint}</p>
    </div>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bb-card">
      <p className="text-base font-extrabold tracking-tight text-white/90">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </div>
  )
}

function VisualPanel({
  title,
  subtitle,
  chips,
}: {
  title: string
  subtitle: string
  chips: string[]
}) {
  return (
    <div className="bb-pop bb-surface p-6">
      <div className="pointer-events-none absolute inset-0 bb-spotlight" />
      <div className="pointer-events-none absolute inset-0 bb-grid" />
      <div className="pointer-events-none absolute inset-0 bb-noise" />
      <div className="pointer-events-none absolute -inset-24 bb-float opacity-60 [background:conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.16),rgba(56,189,248,0.12),rgba(255,255,255,0.05),rgba(99,102,241,0.16))] blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="bb-chip">
            <span className="h-2 w-2 rounded-full bg-sky-300/90 shadow-[0_0_0_6px_rgba(56,189,248,0.10)]" />
            {title}
          </span>
          <span className="bb-chip">Realtime</span>
        </div>

        <p className="mt-4 text-xl font-black tracking-tight text-white/95">{subtitle}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
            <p className="text-xs font-semibold text-white/60">Clicks</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-black tracking-tight text-white">12,480</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
            <p className="text-xs font-semibold text-white/60">Conversions</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-black tracking-tight text-white">1,042</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/15 p-4 sm:col-span-2">
            <p className="text-xs font-semibold text-white/60">Highlights</p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Clear attribution, creator performance, and payout readiness in one view.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span key={c} className="bb-chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute right-3 top-14 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/18 to-cyan-400/14 blur-3xl" />
        <div className="pointer-events-none absolute -left-6 -bottom-8 h-48 w-48 rounded-full bg-gradient-to-br from-sky-400/14 to-white/8 blur-3xl" />
      </div>
    </div>
  )
}

export function HomePage() {
  return (
    <div className="bb-page flex flex-col gap-10">
      <section className="bb-surface bb-surface-pad">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div className="pointer-events-none absolute -inset-24 bb-float opacity-60 [background:conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.16),rgba(56,189,248,0.12),rgba(255,255,255,0.05),rgba(99,102,241,0.16))] blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="bb-chip">
              <span className="h-2 w-2 rounded-full bg-sky-300/90 shadow-[0_0_0_6px_rgba(56,189,248,0.10)]" />
              Attribution • Performance • Payouts
            </span>

            <h1 className="bb-title mt-4">
              Buy & Bye turns creator collaborations into{' '}
              <span className="bg-gradient-to-r from-indigo-300 via-sky-200 to-cyan-200 bg-clip-text text-transparent">
                measurable growth
              </span>
              .
            </h1>

            <p className="bb-p mt-4 max-w-2xl">
              Launch campaigns, track conversions with links and codes, and keep commissions transparent with a premium
              experience for brands and influencers.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/brand" className="bb-btn-primary">
                Explore for Brands
              </Link>
              <Link to="/influencer" className="bb-btn-ghost">
                Explore for Influencers
              </Link>
              <Link to="/login" className="bb-btn-soft">
                Login
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-extrabold text-white/90">Clear attribution</p>
                <p className="mt-2 text-sm leading-6 text-white/65">Links plus codes, consistent reporting.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-extrabold text-white/90">Less manual work</p>
                <p className="mt-2 text-sm leading-6 text-white/65">No spreadsheets, fewer ops steps.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-extrabold text-white/90">Premium UX</p>
                <p className="mt-2 text-sm leading-6 text-white/65">Clean experience for both sides.</p>
              </div>
            </div>
          </div>

          <VisualPanel
            title="Campaign dashboard"
            subtitle="All the signals in one place"
            chips={['Links', 'Codes', 'Commissions', 'Reporting']}
          />
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bb-card">
            <h2 className="bb-h2">What you get</h2>
            <p className="bb-p mt-3 max-w-2xl">
              A professional workflow that stays simple to use, but powerful enough to scale from micro-creators to
              larger campaigns.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Feature title="Campaign builder" desc="Define offers, rules, assets, and collaboration flow." />
              <Feature title="Creator workflow" desc="Invite and manage collaborations with clarity." />
              <Feature title="Attribution" desc="Track conversions with unique links and promo codes." />
              <Feature title="Payout readiness" desc="Clear commission reporting and payout preparation." />
            </div>
          </div>

          <div className="bb-card">
            <h2 className="bb-h2">Why it works</h2>
            <p className="bb-p mt-3 max-w-2xl">
              Better results come from clarity and trust. Less friction improves execution for everyone.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Stat label="Attribution clarity" value="High" hint="Consistent signals across channels." />
              <Stat label="Operational load" value="Lower" hint="Fewer manual steps and checks." />
              <Stat label="Creator trust" value="Up" hint="Transparent earnings and rules." />
              <Stat label="Reporting" value="Realtime" hint="One view for performance and payouts." />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={60}>
        <section className="bb-surface bb-surface-pad">
          <div className="pointer-events-none absolute inset-0 bb-spotlight opacity-70" />
          <div className="pointer-events-none absolute inset-0 bb-grid" />
          <div className="pointer-events-none absolute inset-0 bb-noise" />

          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <h2 className="bb-h2">How it works</h2>
              <p className="bb-p mt-3 max-w-xl">
                A clean flow from campaign creation to measurable sales and transparent payouts.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="bb-card">
                  <p className="text-xs font-extrabold text-sky-300/90">01</p>
                  <p className="mt-2 text-base font-extrabold text-white/90">Create a campaign</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Define products, goals, tracking method, and commission rules.
                  </p>
                </div>
                <div className="bb-card">
                  <p className="text-xs font-extrabold text-sky-300/90">02</p>
                  <p className="mt-2 text-base font-extrabold text-white/90">Collaborate</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Invite creators and share assets and guidelines.
                  </p>
                </div>
                <div className="bb-card">
                  <p className="text-xs font-extrabold text-sky-300/90">03</p>
                  <p className="mt-2 text-base font-extrabold text-white/90">Track performance</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Monitor clicks, conversions, and ROI in one view.
                  </p>
                </div>
                <div className="bb-card">
                  <p className="text-xs font-extrabold text-sky-300/90">04</p>
                  <p className="mt-2 text-base font-extrabold text-white/90">Pay commissions</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Keep earnings clear and prepare payouts with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="bb-card lg:col-span-1">
            <h2 className="bb-h2">Start with the right profile</h2>
            <p className="bb-p mt-3">
              Explore how Buy & Bye speaks your language. Brand-first or creator-first.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/brand" className="bb-btn-primary">
                Brand
              </Link>
              <Link to="/influencer" className="bb-btn-ghost">
                Influencer
              </Link>
              <Link to="/contact" className="bb-btn-soft">
                Contact
              </Link>
            </div>
          </div>

          <div className="bb-card lg:col-span-2">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-white/5 p-6">
                <p className="text-sm font-extrabold text-white/90">For brands</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Launch campaigns, control ROI, and scale collaborations with clean operations.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-400/10 to-white/5 p-6">
                <p className="text-sm font-extrabold text-white/90">For influencers</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Monetize your audience with transparent tracking and consistent payouts.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/60">Trust</p>
                <p className="mt-2 text-sm font-extrabold text-white/90">Clear rules</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/60">Signals</p>
                <p className="mt-2 text-sm font-extrabold text-white/90">Links + codes</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/60">Workflow</p>
                <p className="mt-2 text-sm font-extrabold text-white/90">Payout ready</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}