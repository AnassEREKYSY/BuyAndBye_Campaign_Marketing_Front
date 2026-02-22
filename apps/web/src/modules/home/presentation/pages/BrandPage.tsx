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

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/7">
      <p className="text-base font-extrabold tracking-tight text-white/90">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </div>
  )
}

function MiniStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-[160px] rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-extrabold text-white/90">{v}</p>
      <p className="mt-1 text-sm text-white/60">{k}</p>
    </div>
  )
}

export function BrandPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div className="pointer-events-none absolute -inset-24 bb-float opacity-60 [background:conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.16),rgba(34,211,238,0.12),rgba(255,255,255,0.05),rgba(99,102,241,0.16))] blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              For Brands
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Launch creator campaigns with clear attribution and clean operations.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              Buy & Bye helps your team run campaigns with better tracking, consistent rules, and a premium workflow that
              scales.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/90 to-cyan-400/80 px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_55px_rgba(99,102,241,0.20)] transition hover:-translate-y-0.5"
              >
                Create an account
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-extrabold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/7"
              >
                Contact us
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <MiniStat k="Reporting" v="Realtime" />
              <MiniStat k="Attribution" v="Links plus codes" />
              <MiniStat k="Operations" v="Less manual work" />
            </div>
          </div>

          <div className="bb-pop rounded-3xl border border-white/10 bg-black/10 p-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-extrabold text-white/90">Brand outcomes</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Clear conversion reporting, creator performance, and payout readiness in one view.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Card title="Control ROI" desc="See what converts and allocate budget with confidence." />
                <Card title="Scale collaborations" desc="Manage multiple creators without losing clarity." />
                <Card title="Reduce friction" desc="Less back and forth. More structured workflows." />
                <Card title="Build trust" desc="Creators perform better when terms are consistent." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
          <h2 className="text-2xl font-black tracking-tight text-white/95">What brands do inside Buy & Bye</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
            A professional campaign flow that stays simple for the team. Everything is structured to avoid manual
            tracking.
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <Card title="Create campaigns" desc="Define products, commission rules, and collaboration guidelines." />
            <Card title="Approve creators" desc="Validate profiles and keep campaign quality consistent." />
            <Card title="Track performance" desc="Monitor conversions and identify what drives sales." />
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={60}>
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
            <h2 className="text-2xl font-black tracking-tight text-white/95">What you control</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Keep the campaign consistent, while giving creators what they need to perform.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Card title="Commission rules" desc="Rates, conditions, and payout timing remain clear." />
              <Card title="Approvals" desc="Decide who joins and which content gets validated." />
              <Card title="Assets" desc="Provide offers, media, and brand messaging." />
              <Card title="Reporting" desc="One view for performance, conversions, and commissions." />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
            <h2 className="text-2xl font-black tracking-tight text-white/95">What you gain</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Stronger performance starts with clarity. Your team spends less time chasing numbers.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Card title="Less manual ops" desc="Reduce spreadsheets and message based tracking." />
              <Card title="Better decisions" desc="Optimize offers and creators based on conversion data." />
              <Card title="Faster execution" desc="Structured flows speed up approvals and launches." />
              <Card title="Premium experience" desc="A clean product that supports your brand image." />
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}