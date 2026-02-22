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

export function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div className="pointer-events-none absolute -inset-24 bb-float opacity-60 [background:conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.14),rgba(34,211,238,0.12),rgba(255,255,255,0.05),rgba(99,102,241,0.14))] blur-3xl" />

        <div className="relative z-10">
          <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
            Contact
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Let’s talk.</h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Partnerships, onboarding, demos, or support. Send us the basics and we will respond quickly.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <Card title="Email" desc="contact@buyandbye.app" />
            <Card title="Business" desc="partnerships@buyandbye.app" />
            <Card title="Location" desc="France and Morocco" />
            <Card title="Response time" desc="Usually within 24 to 48 hours" />
          </div>
        </div>
      </section>

      <Reveal>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
          <h2 className="text-2xl font-black tracking-tight text-white/95">What to include</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
            A few details help us route your message and reply faster.
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <Card title="Your profile" desc="Brand or influencer, plus your market or country." />
            <Card title="Your objective" desc="Sales, launch, awareness, or live commerce." />
            <Card title="Your scope" desc="Creators volume and expected duration." />
          </div>
        </section>
      </Reveal>
    </div>
  )
}