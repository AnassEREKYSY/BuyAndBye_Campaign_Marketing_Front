import type { ReactNode } from 'react'

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
        <h2 className="text-lg font-extrabold tracking-tight bb-title-text">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm bb-subtle-text">{subtitle}</p> : null}
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
        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] bb-muted-text">{label}</span>
        {hint ? <span className="text-xs bb-muted-text">{hint}</span> : null}
      </div>
      {children}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={['bb-input', props.className ?? ''].join(' ')} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition',
        'bb-soft-scroll',
        props.className ?? '',
      ].join(' ')}
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.12)',
        backgroundColor: 'rgb(var(--bb-card) / 0.86)',
        color: 'rgb(var(--bb-text) / 0.95)',
      }}
    />
  )
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={['bb-btn-primary', props.className ?? ''].join(' ')}>
      {children}
    </button>
  )
}

export function GhostButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={['bb-btn-ghost', props.className ?? ''].join(' ')}>
      {children}
    </button>
  )
}

export function SubtleCard({ children }: { children: ReactNode }) {
  return <div className="bb-card p-4">{children}</div>
}