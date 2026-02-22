import { Link } from 'react-router-dom'
import { useInView } from '@/shared/hooks'

function Reveal({
  children,
  delayMs = 0,
}: {
  children: React.ReactNode
  delayMs?: number
}) {
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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
      {children}
    </span>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/7">
      <p className="text-2xl font-extrabold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm font-bold text-white/80">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{hint}</p>
    </div>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/7">
      <p className="text-base font-extrabold tracking-tight text-white/90">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </div>
  )
}

function Step({ i, title, desc }: { i: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/7">
      <p className="text-xs font-extrabold text-cyan-300/90">{i}</p>
      <p className="mt-2 text-base font-extrabold tracking-tight text-white/90">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </div>
  )
}

function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/7">
      <div className="pointer-events-none absolute -left-2 -top-6 text-7xl font-black text-white/10">"</div>
      <p className="relative z-10 text-sm leading-6 text-white/75">{quote}</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/40 to-cyan-400/30" />
        <div>
          <p className="text-sm font-extrabold text-white/90">{name}</p>
          <p className="text-sm text-white/60">{role}</p>
        </div>
      </div>
    </div>
  )
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/5 p-5">
      <summary className="cursor-pointer list-none text-sm font-extrabold text-white/85">
        <span className="mr-2 inline-block transition group-open:rotate-90">›</span>
        {q}
      </summary>
      <p className="mt-3 text-sm leading-6 text-white/65">{a}</p>
    </details>
  )
}

function DashboardPreview() {
  return (
    <div className="bb-pop relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
      <div className="absolute inset-0 pointer-events-none bb-spotlight" />
      <div className="absolute inset-0 pointer-events-none bb-grid" />
      <div className="absolute inset-0 pointer-events-none bb-noise" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-white/80">
          <span className="h-2 w-2 rounded-full bg-cyan-300/90 shadow-[0_0_0_6px_rgba(34,211,238,0.12)]" />
          Campaign dashboard
        </div>
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
          Realtime
        </div>
      </div>

      <div className="relative z-10 mt-5 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white/60">Clicks</p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">12,480</p>
            </div>
            <div className="relative h-9 w-28 overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-indigo-500/25 to-cyan-400/25">
              <div className="bb-shimmer absolute inset-0" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white/60">Conversions</p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">1,042</p>
            </div>
            <div className="relative h-9 w-28 overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-cyan-400/25 to-indigo-500/20">
              <div className="bb-shimmer absolute inset-0" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-white/60">ROI</p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">3.6x</p>
            </div>
            <div className="relative h-9 w-28 overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-white/10 to-cyan-400/20">
              <div className="bb-shimmer absolute inset-0" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-semibold text-white/60">Insights</p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Clear attribution, creator performance, and payout readiness in one view.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>Links</Pill>
            <Pill>Codes</Pill>
            <Pill>Commissions</Pill>
            <Pill>Reporting</Pill>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div className="pointer-events-none absolute -inset-24 bb-float opacity-60 [background:conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.16),rgba(34,211,238,0.12),rgba(255,255,255,0.05),rgba(99,102,241,0.16))] blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              <span className="h-2 w-2 rounded-full bg-cyan-300/90 shadow-[0_0_0_6px_rgba(34,211,238,0.12)]" />
              Attribution. Performance. Payouts.
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Buy & Bye helps brands grow with creators, with{' '}
              <span className="bg-gradient-to-r from-indigo-300 to-cyan-200 bg-clip-text text-transparent">
                measurable results
              </span>
              .
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              A clean platform to run campaigns, track conversions with links and codes, and keep commissions and payouts
              transparent for everyone.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/brand"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/90 to-cyan-400/80 px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_55px_rgba(99,102,241,0.20)] transition hover:-translate-y-0.5"
              >
                Explore for Brands
              </Link>
              <Link
                to="/influencer"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-extrabold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/7"
              >
                Explore for Influencers
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/10 px-5 py-3 text-sm font-bold text-white/80 transition hover:-translate-y-0.5 hover:bg-white/5"
              >
                Login
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-white/65">
              <Pill>No spreadsheets</Pill>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <Pill>Transparent commissions</Pill>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <Pill>Premium experience</Pill>
            </div>
          </div>

          <DashboardPreview />
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-8">
            <h2 className="text-2xl font-black tracking-tight text-white/95">What you get</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Simple to use, but designed for serious performance tracking and professional collaboration.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Feature
                title="Campaign builder"
                desc="Set offers, commission rules, and the collaboration flow."
              />
              <Feature
                title="Creator workflow"
                desc="Invite, approve, and manage collaborations with clarity."
              />
              <Feature
                title="Attribution"
                desc="Track conversions using unique links and promo codes."
              />
              <Feature
                title="Payout readiness"
                desc="Commission visibility and payout reporting that stays clean."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-8">
            <h2 className="text-2xl font-black tracking-tight text-white/95">Why it works</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Clarity reduces friction. Less manual work, more trust, better decisions.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Stat label="Operational time" value="Lower" hint="Less manual tracking and reporting." />
              <Stat label="Attribution clarity" value="High" hint="Links plus codes for consistent attribution." />
              <Stat label="Creator trust" value="Up" hint="Transparent earnings and consistent rules." />
              <Stat label="Reporting" value="Realtime" hint="One view for performance and payouts." />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={60}>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black tracking-tight text-white/95">How it works</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              A clean flow from campaign creation to measurable sales and transparent payouts.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Step i="01" title="Create a campaign" desc="Choose products, goals, and tracking method." />
            <Step i="02" title="Collaborate" desc="Invite creators and share the campaign details." />
            <Step i="03" title="Track performance" desc="Monitor clicks and conversions in one view." />
            <Step i="04" title="Pay commissions" desc="Keep earnings clear and prepare payouts." />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black tracking-tight text-white/95">What people love</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Premium UX, clear tracking, and less operational friction.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <Testimonial
              quote="We stopped arguing about attribution. The dashboard tells the story instantly."
              name="Campaign Manager"
              role="DTC brand"
            />
            <Testimonial
              quote="I know what I earned and why. That transparency changes everything."
              name="Creator"
              role="Lifestyle influencer"
            />
            <Testimonial
              quote="It feels like a product built for scale. Simple, premium, and focused."
              name="Growth lead"
              role="E-commerce"
            />
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={60}>
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-8">
            <h2 className="text-2xl font-black tracking-tight text-white/95">FAQ</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Quick answers. For anything else, use the contact page.
            </p>

            <div className="mt-6 grid gap-3">
              <FAQ
                q="Do I need an account to browse?"
                a="No. The public pages are available without login. Accounts are for managing campaigns and collaborations."
              />
              <FAQ
                q="How is performance tracked?"
                a="Using unique links and promo codes. The goal is consistent attribution and clear reporting."
              />
              <FAQ
                q="Is it only for brands?"
                a="No. Brands run campaigns and influencers join collaborations to monetize their audience with clarity."
              />
              <FAQ
                q="Is live commerce supported?"
                a="The concept supports live selling flows. Tracking stays consistent through links and codes."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/6 to-white/4 p-7 sm:p-8">
            <h2 className="text-2xl font-black tracking-tight text-white/95">Start with the right profile</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Explore the platform with the language that fits you best.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/brand"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/90 to-cyan-400/80 px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_55px_rgba(34,211,238,0.14)] transition hover:-translate-y-0.5"
              >
                Brand
              </Link>
              <Link
                to="/influencer"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-extrabold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/7"
              >
                Influencer
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/10 px-5 py-3 text-sm font-bold text-white/80 transition hover:-translate-y-0.5 hover:bg-white/5"
              >
                Contact
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-extrabold text-white/90">Brands</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Launch campaigns, control ROI, and scale collaborations with confidence.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-extrabold text-white/90">Influencers</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Monetize your audience with transparent tracking and consistent payouts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}