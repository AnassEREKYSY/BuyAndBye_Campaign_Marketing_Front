import type { ReactNode } from 'react'

export function SectionTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-bb-muted">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2">
        <span className="bb-label">{label}</span>
        {hint ? <span className="mb-1.5 text-xs text-bb-muted">{hint}</span> : null}
      </span>
      {children}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const isFile = props.type === 'file'
  return (
    <input
      {...props}
      className={[
        'bb-input',
        isFile ? 'py-1.5 file:mr-3 file:h-7 file:rounded-[8px] file:border-0 file:bg-bb-subtle file:px-3 file:text-sm file:font-medium file:text-bb-text' : '',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={['bb-input bb-soft-scroll', props.className ?? ''].join(' ')} />
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

/** Bottom row of a form: short note on the left, actions on the right. */
export function FormFooter({ note, children }: { note?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-bb-border/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-bb-muted">{note}</p>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

/** Simple on/off switch row. */
export function SwitchRow({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description ? <p className="mt-0.5 text-sm text-bb-muted">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-bb-primary' : 'bg-bb-border/15'}`}
      >
        <span className={`absolute h-5 w-5 rounded-full bg-bb-card shadow-sm transition-[left] ${checked ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}
