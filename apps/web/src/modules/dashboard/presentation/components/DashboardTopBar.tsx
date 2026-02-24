import { useMemo } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  search: string
  onSearch: (v: string) => void
}

export function DashboardTopBar({ search, onSearch }: Props) {
  const id = useMemo(() => `dash_search_${Math.random().toString(16).slice(2)}`, [])

  return (
    <div className="bb-gradient-border bb-glass bb-ring relative overflow-hidden rounded-[26px] border border-white/10 px-5 py-4">
      <div className="pointer-events-none absolute inset-0 bb-spotlight" />
      <div className="pointer-events-none absolute inset-0 bb-grid" />
      <div className="pointer-events-none absolute inset-0 bb-noise" />

      <div className="relative flex items-center justify-center gap-3">
        <div className="relative w-full max-w-[680px]">
          <label htmlFor={id} className="sr-only">
            Search campaigns
          </label>
          <input
            id={id}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search campaigns…"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-11 text-sm font-extrabold text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:bg-white/10 focus:shadow-[0_0_0_6px_rgba(56,189,248,0.12)]"
          />
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" />
              <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <Link to="/campaigns" className="bb-btn-primary h-12 px-5">
          Browse campaigns
        </Link>
      </div>
    </div>
  )
}