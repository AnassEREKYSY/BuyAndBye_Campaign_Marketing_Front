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

export function ContactPage() {
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
              'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.14), rgba(56,189,248,0.12), rgba(255,255,255,0.05), rgba(99,102,241,0.14))',
          }}
        />

        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <span className="bb-chip">Contact</span>
            <h1 className="bb-title mt-4">Let’s talk.</h1>
            <p className="bb-p mt-4 max-w-xl">
              Partnerships, onboarding, demos, or support. Send us the basics and we will respond quickly.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-3 sm:grid-cols-2">
              <Card title="Email" desc="contact@buyandbye.app" />
              <Card title="Business" desc="partnerships@buyandbye.app" />
              <Card title="Location" desc="France and Morocco" />
              <Card title="Response time" desc="Usually within 24 to 48 hours" />
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bb-card">
            <h2 className="bb-h2">What to include</h2>
            <p className="bb-p mt-3">A few details help us route your message and reply faster.</p>
            <div className="mt-6 grid gap-3">
              <Card title="Your profile" desc="Brand or influencer, plus your market or country." />
              <Card title="Objective" desc="Sales, launch, awareness, or live commerce." />
              <Card title="Scope" desc="Creators volume and expected duration." />
            </div>
          </div>

          <div className="bb-card">
            <h2 className="bb-h2">We can help with</h2>
            <p className="bb-p mt-3">Choosing the right setup for your goals and helping you onboard fast.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Card title="Brand onboarding" desc="Campaign structure, tracking method, and reporting setup." />
              <Card title="Creator onboarding" desc="Profile guidance, collaboration flow, and payout clarity." />
              <Card title="Partnerships" desc="Long term collaborations and custom workflows." />
              <Card title="Support" desc="Product questions and account help." />
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}