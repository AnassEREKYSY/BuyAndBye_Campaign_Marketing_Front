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

export function InfluencerPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div className="pointer-events-none absolute -inset-24 bb-float opacity-60 [background:conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,0.14),rgba(99,102,241,0.14),rgba(255,255,255,0.05),rgba(34,211,238,0.14))] blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              For Influencers
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Earn with clarity. Track what you drive. Get paid with confidence.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              Collaborate with brands, use a unique link or promo code, see results clearly, and keep earnings
              transparent.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/90 to-cyan-400/80 px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_55px_rgba(34,211,238,0.14)] transition hover:-translate-y-0.5"
              >
                Join as influencer
              </Link>
              <Link
                to="/brand"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-extrabold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/7"
              >
                I am a brand
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-white/65">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                Links track clicks
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                Codes track sales
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                Earnings are transparent
              </span>
            </div>
          </div>

          <div className="bb-pop rounded-3xl border border-white/10 bg-black/10 p-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-extrabold text-white/90">Creator experience</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Clean collaboration, clear rules, and performance you can understand at a glance.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Card title="Clear offers" desc="Know the commission, terms, and expectations upfront." />
                <Card title="Performance view" desc="See results without manual reporting or guessing." />
                <Card title="Fair payouts" desc="Earnings are consistent, visible, and payout ready." />
                <Card title="Brand alignment" desc="Work with brands that fit your audience." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
          <h2 className="text-2xl font-black tracking-tight text-white/95">How you earn</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
            A simple flow that stays professional, from joining a campaign to receiving your payout.
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <Card title="Join a campaign" desc="Get approved by the brand and receive your tracking link or code." />
            <Card title="Promote naturally" desc="Create content that fits your style and audience." />
            <Card title="Track and earn" desc="See conversions and earnings clearly in your dashboard." />
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={60}>
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
            <h2 className="text-2xl font-black tracking-tight text-white/95">Designed for trust</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Trust is built when performance and payouts are clear. That is the focus.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Card title="Transparent earnings" desc="Know what you earned and why, with consistent rules." />
              <Card title="Less friction" desc="Reduce confusion and keep collaboration professional." />
              <Card title="Better partnerships" desc="Brands trust performance, creators trust payouts." />
              <Card title="Premium UX" desc="A clean product that respects your time and image." />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
            <h2 className="text-2xl font-black tracking-tight text-white/95">What you keep</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              You stay in control of your content and your relationship with your audience.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Card title="Creative freedom" desc="Produce content that fits your voice." />
              <Card title="Simple tracking" desc="Links and codes, no technical complexity." />
              <Card title="Clear terms" desc="Commission and expectations remain visible." />
              <Card title="Consistent payouts" desc="Reporting stays payout ready." />
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}