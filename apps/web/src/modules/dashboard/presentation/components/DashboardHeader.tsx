
import { useMemo } from 'react'

type Props = {
  title: string
  subtitle: string
  search: string
  onSearch: (v: string) => void
  rightSlot?: React.ReactNode
  searchPlaceholder?: string
}

export function DashboardHeader({ title, subtitle, search, onSearch, rightSlot, searchPlaceholder }: Props) {
  const id = useMemo(() => `search_${Math.random().toString(16).slice(2)}`, [])

  return (
    <div className="bb-pop bb-surface px-5 py-5">
      <div className="pointer-events-none absolute inset-0 bb-spotlight" />
      <div className="pointer-events-none absolute inset-0 bb-grid" />
      <div className="pointer-events-none absolute inset-0 bb-noise" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="bb-chip">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: 'rgb(var(--bb-accent) / 0.90)',
                boxShadow: '0 0 18px rgb(var(--bb-accent) / 0.35)',
              }}
            />
            Workspace
          </div>

          <h1 className="mt-3 text-xl font-black tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
            {title}
          </h1>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
            {subtitle}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-[620px] md:flex-row md:items-center md:justify-end">
          <div className="relative w-full">
            <label htmlFor={id} className="sr-only">
              Search
            </label>

            <input
              id={id}
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder ?? 'Search…'}
              className="bb-input pr-10"
            />

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" />
                <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {rightSlot ? <div className="flex items-center justify-end">{rightSlot}</div> : null}
        </div>
      </div>
    </div>
  )
}