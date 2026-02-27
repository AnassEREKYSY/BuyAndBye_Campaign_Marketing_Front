import { Link } from 'react-router-dom'
import { useInView } from '@/shared/hooks'

function Reveal({ children, delayMs = 0 }: { children: React.ReactNode; delayMs?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`bb-fade-up ${inView ? 'bb-fade-up-in' : ''}`} style={{ transitionDelay: `${delayMs}ms` }}>
      {children}
    </div>
  )
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bb-card">
      <p className="text-base font-extrabold tracking-tight bb-title-text">{title}</p>
      <p className="mt-2 text-sm leading-6 bb-subtle-text">{desc}</p>
    </div>
  )
}

function TinyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bb-soft-box p-4">
      <p className="text-xs font-semibold bb-muted-text">{label}</p>
      <p className="mt-2 text-sm font-extrabold bb-title-text">{value}</p>
    </div>
  )
}

export function BrandPage() {
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

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="bb-chip">For Brands</span>
            <h1 className="bb-title mt-4">Run creator campaigns with clean tracking and premium execution.</h1>
            <p className="bb-p mt-4 max-w-2xl">
              Control ROI with clearer attribution, reduce manual operations, and keep the collaboration experience professional
              for your brand.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="bb-btn-primary">
                Create an account
              </Link>
              <Link to="/contact" className="bb-btn-ghost">
                Contact
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <TinyStat label="Reporting" value="Realtime" />
              <TinyStat label="Attribution" value="Links + codes" />
              <TinyStat label="Operations" value="Less manual" />
            </div>
          </div>

          <div className="bb-pop grid gap-3 sm:grid-cols-2">
            <Card title="Campaign setup" desc="Define products, rules, assets, and collaboration flow." />
            <Card title="Creator matching" desc="Invite and select creators aligned with your goals." />
            <Card title="Attribution" desc="Track conversions with consistent signals across channels." />
            <Card title="Commissions" desc="Transparent earnings and payout-ready reporting." />
          </div>
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="bb-card lg:col-span-5">
            <h2 className="bb-h2">What you control</h2>
            <p className="bb-p mt-3">Keep campaigns consistent while giving creators a clean workflow that improves performance.</p>
            <div className="mt-6 grid gap-3">
              <Card title="Commission rules" desc="Rates and conditions stay clear and consistent." />
              <Card title="Approvals" desc="Choose who joins and keep quality high." />
              <Card title="Assets" desc="Provide brand messaging and content guidelines." />
            </div>
          </div>

          <div className="bb-card lg:col-span-7">
            <h2 className="bb-h2">What you gain</h2>
            <p className="bb-p mt-3 max-w-3xl">
              Stronger outcomes start with clarity. Reduce time spent chasing numbers and focus on growth.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Card title="Better decisions" desc="Optimize creators and offers based on conversion data." />
              <Card title="Faster execution" desc="Structured workflows speed up launch cycles." />
              <Card title="Less friction" desc="Reduce confusion and manual coordination." />
              <Card title="Premium brand image" desc="A clean product experience that matches your brand." />
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}