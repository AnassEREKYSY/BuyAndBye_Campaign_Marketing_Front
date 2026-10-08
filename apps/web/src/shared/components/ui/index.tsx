import type { ReactNode } from 'react'

/** Page title row used at the top of every signed-in page. */
export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-bb-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/** Card with an optional title row. */
export function Section({ title, description, actions, children, className = '', bodyClassName = '' }: { title?: ReactNode; description?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={`bb-card p-0 ${className}`}>
      {title || actions ? (
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
          <div className="min-w-0">
            {title ? <h2 className="text-[15px] font-semibold">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-xs text-bb-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={bodyClassName || 'px-5 pb-5'}>{children}</div>
    </section>
  )
}

export function Stat({ label, value, hint, icon, tone }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode; tone?: 'up' | 'down' }) {
  return (
    <div className="bb-card">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-bb-muted">{label}</p>
        {icon ? <span className="bb-stat-icon h-8 w-8">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint ? <p className={`mt-1 text-xs ${tone === 'up' ? 'text-bb-success' : tone === 'down' ? 'text-bb-accent-strong' : 'text-bb-muted'}`}>{hint}</p> : null}
    </div>
  )
}

const statusTone: Record<string, string> = {
  active: 'bb-badge-green',
  published: 'bb-badge-green',
  accepted: 'bb-badge-green',
  paid: 'bb-badge-green',
  open: 'bb-badge-green',
  pending: 'bb-badge-amber',
  shortlisted: 'bb-badge-brown',
  approved: 'bb-badge-brown',
  draft: '',
  closed: '',
  archived: '',
  withdrawn: '',
  rejected: 'bb-badge-red',
  cancelled: 'bb-badge-red',
  suspended: 'bb-badge-red',
}

/** Small colored pill for any status string coming from the API. */
export function StatusBadge({ status }: { status?: string | null }) {
  const s = String(status ?? '').toLowerCase()
  if (!s) return null
  return <span className={`bb-badge capitalize ${statusTone[s] ?? ''}`}>{s.replace(/_/g, ' ')}</span>
}

export function EmptyState({ title, text, action, icon }: { title: string; text?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="bb-empty flex flex-col items-center">
      {icon ? <span className="bb-stat-icon mb-3">{icon}</span> : null}
      <p className="font-medium text-bb-text">{title}</p>
      {text ? <p className="mt-1 max-w-sm text-sm text-bb-muted">{text}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bb-skeleton ${className}`} />
}

/** Segmented control, e.g. for 7 / 30 / 90 day ranges or tabs. */
export function Segmented<T extends string | number>({ value, options, onChange }: { value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-[10px] border border-bb-border/15 bg-bb-subtle p-0.5" role="tablist">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={`h-8 rounded-[8px] px-3 text-sm font-medium transition-colors ${o.value === value ? 'bg-bb-card text-bb-text shadow-[0_0_0_1px_rgb(var(--bb-border)/0.1)]' : 'text-bb-muted hover:text-bb-text'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Accessible modal shell. Content scrolls; header and footer stay put. */
export function Modal({ open, onClose, title, children, footer, width = 'max-w-lg' }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; width?: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`bb-popover bb-pop relative flex max-h-[90vh] w-full ${width} flex-col`}>
        <div className="flex items-center justify-between border-b border-bb-border/10 px-5 py-4">
          <h2 className="font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="bb-icon-btn h-8 w-8" aria-label="Close">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-bb-border/10 px-5 py-3">{footer}</div> : null}
      </div>
    </div>
  )
}

export function formatNumber(n: number | null | undefined) {
  return new Intl.NumberFormat('en-US').format(Number(n ?? 0))
}

export function formatMoney(amount: number | null | undefined, currency = 'MAD') {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(amount ?? 0))} ${currency}`
}

export function formatDate(iso?: string | null, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return '—'
  const d = new Date(iso.replace(' ', 'T'))
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', opts)
}
