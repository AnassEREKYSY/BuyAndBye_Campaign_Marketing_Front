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
    <div className="bb-card">
      <p className="text-base font-extrabold tracking-tight text-white/90">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </div>
  )
}

export function InfluencerPage() {
  return (
    <div className="bb-page flex flex-col gap-10">
      <section className="bb-surface bb-surface-pad">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div className="pointer-events-none absolute -inset-24 bb-float opacity-60 [background:conic-gradient(from_180deg_at_50%_50%,rgba(56,189,248,0.14),rgba(99,102,241,0.14),rgba(255,255,255,0.05),rgba(56,189,248,0.14))] blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="bb-chip">For Influencers</span>
            <h1 className="bb-title mt-4">Track what you drive. Earn with clarity. Get paid with confidence.</h1>
            <p className="bb-p mt-4 max-w-2xl">
              Collaborate with brands, use your unique link or code, and keep your earnings transparent in a clean
              workflow.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="bb-btn-primary">
                Join as influencer
              </Link>
              <Link to="/brand" className="bb-btn-ghost">
                I am a brand
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/60">Tracking</p>
                <p className="mt-2 text-sm font-extrabold text-white/90">Links</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/60">Tracking</p>
                <p className="mt-2 text-sm font-extrabold text-white/90">Codes</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/60">Earnings</p>
                <p className="mt-2 text-sm font-extrabold text-white/90">Transparent</p>
              </div>
            </div>
          </div>

          <div className="bb-pop grid gap-3 sm:grid-cols-2">
            <Card title="Clear offers" desc="Know the terms and commission upfront." />
            <Card title="Performance view" desc="See results without manual reporting." />
            <Card title="Fair payouts" desc="Earnings are consistent and payout-ready." />
            <Card title="Better partnerships" desc="Brands trust performance, creators trust payouts." />
          </div>
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="bb-card lg:col-span-7">
            <h2 className="bb-h2">How you earn</h2>
            <p className="bb-p mt-3 max-w-3xl">
              A simple path from joining a campaign to receiving your payout, without confusion.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="bb-card">
                <p className="text-xs font-extrabold text-sky-300/90">01</p>
                <p className="mt-2 text-base font-extrabold text-white/90">Join</p>
                <p className="mt-2 text-sm leading-6 text-white/65">Get approved and receive your link or code.</p>
              </div>
              <div className="bb-card">
                <p className="text-xs font-extrabold text-sky-300/90">02</p>
                <p className="mt-2 text-base font-extrabold text-white/90">Promote</p>
                <p className="mt-2 text-sm leading-6 text-white/65">Create content that fits your style.</p>
              </div>
              <div className="bb-card">
                <p className="text-xs font-extrabold text-sky-300/90">03</p>
                <p className="mt-2 text-base font-extrabold text-white/90">Earn</p>
                <p className="mt-2 text-sm leading-6 text-white/65">Track conversions and earnings clearly.</p>
              </div>
            </div>
          </div>

          <div className="bb-card lg:col-span-5">
            <h2 className="bb-h2">Designed for trust</h2>
            <p className="bb-p mt-3">
              Trust is built when performance and payouts are clear. That is the focus.
            </p>
            <div className="mt-6 grid gap-3">
              <Card title="Transparent earnings" desc="Know what you earned and why." />
              <Card title="Less friction" desc="Avoid confusion with consistent reporting." />
              <Card title="Premium UX" desc="A clean product experience that respects your time." />
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}