import { ReactNode } from 'react'

export function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-end justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/55">
          {label}
        </span>
        {hint ? <span className="text-xs text-white/35">{hint}</span> : null}
      </div>
      {children}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/95',
        'transition placeholder:text-white/30 focus:border-white/20 focus:bg-black/35 focus:bb-focus',
        'shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/95',
        'transition placeholder:text-white/30 focus:border-white/20 focus:bg-black/35 focus:bb-focus',
        'shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold text-white',
        'bg-gradient-to-r from-indigo-500/95 via-sky-400/85 to-cyan-400/85 bb-gradient-shift',
        'shadow-[0_18px_60px_rgba(56,189,248,0.16)] transition will-change-transform',
        'hover:-translate-y-[1px] hover:shadow-[0_22px_70px_rgba(99,102,241,0.22)] active:translate-y-0',
        'disabled:opacity-60 disabled:hover:translate-y-0',
        props.className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold text-white/90',
        'transition will-change-transform hover:-translate-y-[1px] hover:bg-white/10 active:translate-y-0',
        'disabled:opacity-60 disabled:hover:translate-y-0',
        props.className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function SubtleCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]">
      {children}
    </div>
  )
}