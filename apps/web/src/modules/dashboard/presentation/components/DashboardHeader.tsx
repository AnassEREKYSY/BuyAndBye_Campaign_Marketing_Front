import { useMemo } from 'react'

type Props = {
  title: string
  subtitle: string
  search: string
  onSearch: (v: string) => void
  rightSlot?: React.ReactNode
}

export function DashboardHeader({ title, subtitle, search, onSearch, rightSlot }: Props) {
  const id = useMemo(() => `search_${Math.random().toString(16).slice(2)}`, [])

  return (
    <div className="bb-gradient-border bb-glass bb-ring relative overflow-hidden rounded-[26px] border border-white/10 px-5 py-5 text-white">
      <div className="pointer-events-none absolute inset-0 bb-spotlight" />
      <div className="pointer-events-none absolute inset-0 bb-grid" />
      <div className="pointer-events-none absolute inset-0 bb-noise" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-extrabold text-white/75">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-300/80 shadow-[0_0_18px_rgba(56,189,248,0.35)]" />
            Workspace
          </div>
          <h1 className="mt-3 text-xl font-black tracking-tight text-white md:text-2xl">{title}</h1>
          <p className="mt-1 text-sm font-semibold text-white/60">{subtitle}</p>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-[620px] md:flex-row md:items-center md:justify-end">
          <div className="relative w-full">
            <label htmlFor={id} className="sr-only">
              Search campaigns
            </label>
            <input
              id={id}
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search campaigns…"
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-sm font-extrabold text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:bg-white/10 focus:shadow-[0_0_0_6px_rgba(56,189,248,0.12)]"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {rightSlot ? <div className="flex items-center justify-end">{rightSlot}</div> : null}
        </div>
      </div>
    </div>
  )
}